-- Agrega el campo opcional "celular" a las postulaciones.
-- Solo hace falta si YA ejecutaste 0001 antes de que incluyera esta columna.
-- Si lo ejecutas de más no pasa nada: no hace cambios cuando la columna ya existe.

alter table public.aplicaciones
  add column if not exists celular text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'aplicaciones_celular_check'
      and conrelid = 'public.aplicaciones'::regclass
  ) then
    alter table public.aplicaciones
      add constraint aplicaciones_celular_check check (char_length(celular) between 8 and 16);
  end if;
end;
$$;
