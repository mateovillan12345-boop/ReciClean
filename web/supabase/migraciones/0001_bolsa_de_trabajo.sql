-- =====================================================================
-- Bolsa de trabajo de ReciClean
-- Ejecutar UNA vez en Supabase: SQL Editor → pegar todo → Run.
-- Es idempotente en lo posible (if not exists / on conflict), pero está
-- pensado para un proyecto nuevo.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Tablas
-- ---------------------------------------------------------------------

create table if not exists public.vacantes (
  id                uuid primary key default gen_random_uuid(),
  titulo            text not null check (char_length(titulo) between 3 and 120),
  slug              text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  area              text not null check (area in ('Limpieza', 'Reciclaje', 'Logística', 'Supervisión')),
  zona              text not null check (zona in ('La Paz', 'El Alto')),
  jornada           text not null check (char_length(jornada) <= 60),
  horario           text not null check (char_length(horario) <= 120),
  tipo_contrato     text not null check (char_length(tipo_contrato) <= 60),
  salario           text check (char_length(salario) <= 60),
  resumen           text not null check (char_length(resumen) <= 280),
  descripcion       text not null check (char_length(descripcion) <= 4000),
  responsabilidades text[] not null default '{}',
  requisitos        text[] not null default '{}',
  estado            text not null default 'activa' check (estado in ('activa', 'pausada', 'cubierta')),
  creada_en         timestamptz not null default now(),
  cubierta_en       timestamptz
);

create index if not exists vacantes_estado_idx on public.vacantes (estado, creada_en desc);

-- cubierta_en se completa sola: se fija al pasar a 'cubierta' y se borra si se reactiva.
-- La limpieza diaria usa esta fecha (aplicaciones de vacantes cubiertas hace más de 7 días).
create or replace function public.vacantes_fecha_cubierta()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.estado = 'cubierta' and (tg_op = 'INSERT' or old.estado is distinct from 'cubierta') then
    new.cubierta_en := now();
  elsif new.estado <> 'cubierta' then
    new.cubierta_en := null;
  end if;
  return new;
end;
$$;

drop trigger if exists vacantes_fecha_cubierta on public.vacantes;
create trigger vacantes_fecha_cubierta
  before insert or update of estado on public.vacantes
  for each row execute function public.vacantes_fecha_cubierta();


create table if not exists public.aplicaciones (
  id          uuid primary key default gen_random_uuid(),
  -- null = postulación espontánea. Si se borra la vacante, la postulación queda como espontánea.
  vacante_id  uuid references public.vacantes (id) on delete set null,
  nombre      text not null check (char_length(nombre) between 3 and 80),
  telefono    text not null check (char_length(telefono) between 8 and 16),
  celular     text check (char_length(celular) between 8 and 16),  -- opcional, además del teléfono/WhatsApp
  correo      text check (char_length(correo) <= 120),
  zona        text not null check (zona in ('La Paz', 'El Alto', 'Otra')),
  experiencia text not null check (experiencia in ('Sin experiencia', 'Menos de 1 año', '1 a 3 años', 'Más de 3 años')),
  cv_ruta     text not null unique,
  estado      text not null default 'nuevo' check (estado in ('nuevo', 'revisado', 'entrevista', 'descartado')),
  ip_hash     text not null,
  creada_en   timestamptz not null default now()
);

create index if not exists aplicaciones_creada_idx   on public.aplicaciones (creada_en desc);
create index if not exists aplicaciones_vacante_idx  on public.aplicaciones (vacante_id);
create index if not exists aplicaciones_estado_idx   on public.aplicaciones (estado);
create index if not exists aplicaciones_telefono_idx on public.aplicaciones (telefono, creada_en desc);
create index if not exists aplicaciones_ip_idx       on public.aplicaciones (ip_hash, creada_en desc);


create table if not exists public.bloqueados (
  id        uuid primary key default gen_random_uuid(),
  telefono  text,
  correo    text,
  motivo    text not null default '' check (char_length(motivo) <= 300),
  creado_en timestamptz not null default now(),
  check (telefono is not null or correo is not null)
);

create index if not exists bloqueados_telefono_idx on public.bloqueados (telefono);
create index if not exists bloqueados_correo_idx   on public.bloqueados (lower(correo));


-- Cada vez que alguien pide una URL de subida (paso 1 del envío) se registra aquí.
-- Sirve para el límite de 3 intentos por hora, aunque la postulación nunca se confirme.
-- La limpieza diaria borra los registros de más de 1 día.
create table if not exists public.intentos_postulacion (
  id        bigint generated always as identity primary key,
  ip_hash   text not null,
  telefono  text not null,
  creado_en timestamptz not null default now()
);

create index if not exists intentos_ip_idx       on public.intentos_postulacion (ip_hash, creado_en desc);
create index if not exists intentos_telefono_idx on public.intentos_postulacion (telefono, creado_en desc);


-- ---------------------------------------------------------------------
-- 2. Permisos y RLS
--    anon          = cualquier visitante (clave pública)
--    authenticated = usuario con sesión (solo administradores: el registro
--                    público debe estar DESACTIVADO en Supabase Auth)
--    service_role  = el servidor de Next.js; se salta RLS. Es la única vía
--                    para insertar aplicaciones e intentos.
-- ---------------------------------------------------------------------

alter table public.vacantes             enable row level security;
alter table public.aplicaciones         enable row level security;
alter table public.bloqueados           enable row level security;
alter table public.intentos_postulacion enable row level security;

-- Permisos explícitos (no dependemos de los permisos por defecto del proyecto).
revoke all on public.vacantes, public.aplicaciones, public.bloqueados, public.intentos_postulacion from anon, authenticated;

grant select                         on public.vacantes     to anon;
grant select, insert, update, delete on public.vacantes     to authenticated;
grant select, update, delete         on public.aplicaciones to authenticated;
grant select, insert, update, delete on public.bloqueados   to authenticated;
-- intentos_postulacion: sin permisos para anon ni authenticated.

-- vacantes
drop policy if exists "publico lee vacantes activas" on public.vacantes;
create policy "publico lee vacantes activas"
  on public.vacantes for select
  to anon
  using (estado = 'activa');

drop policy if exists "admin gestiona vacantes" on public.vacantes;
create policy "admin gestiona vacantes"
  on public.vacantes for all
  to authenticated
  using (true)
  with check (true);

-- aplicaciones: sin política de insert → nadie inserta salvo el servidor.
drop policy if exists "admin lee aplicaciones" on public.aplicaciones;
create policy "admin lee aplicaciones"
  on public.aplicaciones for select
  to authenticated
  using (true);

drop policy if exists "admin actualiza aplicaciones" on public.aplicaciones;
create policy "admin actualiza aplicaciones"
  on public.aplicaciones for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "admin borra aplicaciones" on public.aplicaciones;
create policy "admin borra aplicaciones"
  on public.aplicaciones for delete
  to authenticated
  using (true);

-- bloqueados
drop policy if exists "admin gestiona bloqueados" on public.bloqueados;
create policy "admin gestiona bloqueados"
  on public.bloqueados for all
  to authenticated
  using (true)
  with check (true);


-- ---------------------------------------------------------------------
-- 3. Storage: bucket privado "cvs"
--    El propio bucket rechaza archivos de más de 5 MB o de otro tipo.
--    Sin política de insert: solo se sube con una URL firmada que crea el servidor.
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cvs', 'cvs', false, 5242880, array['application/pdf', 'image/png', 'image/jpeg'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admin lee cvs" on storage.objects;
create policy "admin lee cvs"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'cvs');

drop policy if exists "admin borra cvs" on storage.objects;
create policy "admin borra cvs"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'cvs');
