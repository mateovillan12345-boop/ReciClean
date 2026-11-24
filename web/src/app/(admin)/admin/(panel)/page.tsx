import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Aviso, Cargando, fechaHora, InsigniaEstado, nombreEstadoAplicacion } from "@/components/admin/Piezas";
import { requerirAdmin } from "@/lib/admin/sesion";
import { estadosAplicacion, type EstadoAplicacion } from "@/lib/empleos/tipos";

export const metadata: Metadata = { title: "Aplicantes" };

const POR_PAGINA = 20;
const ESPONTANEAS = "espontaneas";

type Filtros = { q: string; estado: string; vacante: string; pagina: number };

function texto(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

/** Arma la URL de la lista con los filtros actuales (para la paginación). */
function urlLista(f: Filtros, pagina: number): string {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.estado) p.set("estado", f.estado);
  if (f.vacante) p.set("vacante", f.vacante);
  if (pagina > 1) p.set("pagina", String(pagina));
  const qs = p.toString();
  return qs ? `/admin?${qs}` : "/admin";
}

async function ListaAplicantes({ searchParams }: { searchParams: PageProps<"/admin">["searchParams"] }) {
  const { supabase } = await requerirAdmin();
  const sp = await searchParams;

  // Solo letras, números, espacios, @ . + - : así el texto no puede alterar el filtro de la consulta.
  const q = texto(sp.q).replace(/[^\p{L}\p{N}@.+\s-]/gu, "").trim().slice(0, 60);
  const estado = (estadosAplicacion as readonly string[]).includes(texto(sp.estado)) ? texto(sp.estado) : "";
  const vacante = /^[0-9a-f-]{36}$/.test(texto(sp.vacante)) || texto(sp.vacante) === ESPONTANEAS ? texto(sp.vacante) : "";
  const pagina = Math.max(1, Number.parseInt(texto(sp.pagina), 10) || 1);
  const filtros: Filtros = { q, estado, vacante, pagina };

  let consulta = supabase
    .from("aplicaciones")
    .select("id, nombre, telefono, zona, experiencia, estado, creada_en, vacantes(titulo)", { count: "exact" })
    .order("creada_en", { ascending: false })
    .range((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA - 1);
  if (q) {
    const patron = `"*${q}*"`;
    consulta = consulta.or(
      `nombre.ilike.${patron},telefono.ilike.${patron},celular.ilike.${patron},correo.ilike.${patron}`,
    );
  }
  if (estado) consulta = consulta.eq("estado", estado);
  if (vacante === ESPONTANEAS) consulta = consulta.is("vacante_id", null);
  else if (vacante) consulta = consulta.eq("vacante_id", vacante);

  const [{ data: filas, count, error }, { data: vacantes }] = await Promise.all([
    consulta,
    supabase.from("vacantes").select("id, titulo, estado").order("creada_en", { ascending: false }),
  ]);
  if (error) throw error;

  const total = count ?? 0;
  const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const hayFiltros = Boolean(q || estado || vacante);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-normal">Aplicantes</h1>
          <p className="mt-1 text-base text-texto-suave">
            {total === 1 ? "1 postulación" : `${total} postulaciones`}
            {hayFiltros ? " con estos filtros" : ""}
          </p>
        </div>
      </div>

      {texto(sp.aviso) === "eliminada" && (
        <div className="mt-6">
          <Aviso>Postulación eliminada, junto con su CV.</Aviso>
        </div>
      )}

      {/* Filtros: formulario GET, funciona sin JavaScript y la URL se puede compartir */}
      <form action="/admin" className="mt-6 grid gap-4 rounded-lg border border-linea bg-white p-4 md:grid-cols-[1fr_12rem_16rem_auto] md:items-end">
        <div>
          <label htmlFor="f-q" className="mb-1.5 block text-sm font-medium">
            Buscar
          </label>
          <div className="relative">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-texto-suave" />
            <input id="f-q" name="q" type="search" defaultValue={q} placeholder="Nombre, teléfono o correo" className="campo pl-9" />
          </div>
        </div>
        <div>
          <label htmlFor="f-estado" className="mb-1.5 block text-sm font-medium">
            Estado
          </label>
          <select id="f-estado" name="estado" defaultValue={estado} className="campo">
            <option value="">Todos</option>
            {estadosAplicacion.map((e) => (
              <option key={e} value={e}>
                {nombreEstadoAplicacion[e]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-vacante" className="mb-1.5 block text-sm font-medium">
            Vacante
          </label>
          <select id="f-vacante" name="vacante" defaultValue={vacante} className="campo">
            <option value="">Todas</option>
            <option value={ESPONTANEAS}>Espontáneas (sin vacante)</option>
            {(vacantes ?? []).map((v) => (
              <option key={v.id} value={v.id}>
                {v.titulo}
                {v.estado !== "activa" ? ` (${v.estado})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn btn-turquesa min-h-[3rem] px-5">
            Filtrar
          </button>
          {hayFiltros && (
            <Link href="/admin" className="btn btn-borde min-h-[3rem] px-4">
              Limpiar
            </Link>
          )}
        </div>
      </form>

      {filas && filas.length > 0 ? (
        <div className="mt-6 overflow-x-auto rounded-lg border border-linea bg-white">
          <table className="w-full min-w-[48rem] text-left text-base">
            <caption className="sr-only">Postulaciones recibidas, de la más reciente a la más antigua</caption>
            <thead className="border-b border-linea bg-[#fafbfc] text-sm text-texto-suave">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Nombre</th>
                <th scope="col" className="px-4 py-3 font-medium">Vacante</th>
                <th scope="col" className="px-4 py-3 font-medium">Teléfono</th>
                <th scope="col" className="px-4 py-3 font-medium">Zona</th>
                <th scope="col" className="px-4 py-3 font-medium">Experiencia</th>
                <th scope="col" className="px-4 py-3 font-medium">Recibida</th>
                <th scope="col" className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-linea">
              {filas.map((a) => {
                // Supabase devuelve la relación como objeto (o null si es espontánea)
                const v = a.vacantes as unknown as { titulo: string } | null;
                return (
                  <tr key={a.id} className="hover:bg-[#fafbfc]">
                    <th scope="row" className="px-4 py-3 font-medium">
                      <Link href={`/admin/aplicantes/${a.id}`} className="text-morado hover:underline hover:underline-offset-4">
                        {a.nombre}
                      </Link>
                    </th>
                    <td className="px-4 py-3">{v?.titulo ?? <span className="text-texto-suave">Espontánea</span>}</td>
                    <td className="whitespace-nowrap px-4 py-3">{a.telefono}</td>
                    <td className="px-4 py-3">{a.zona}</td>
                    <td className="px-4 py-3">{a.experiencia}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-texto-suave">{fechaHora(a.creada_en)}</td>
                    <td className="px-4 py-3">
                      <InsigniaEstado estado={a.estado as EstadoAplicacion} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-linea bg-white px-6 py-12 text-center">
          <p className="text-lg font-medium">
            {hayFiltros ? "Ninguna postulación coincide con estos filtros." : "Todavía no hay postulaciones."}
          </p>
          {hayFiltros && (
            <Link href="/admin" className="enlace mt-2 inline-block">
              Ver todas
            </Link>
          )}
        </div>
      )}

      {paginas > 1 && (
        <nav aria-label="Paginación" className="mt-6 flex items-center justify-between gap-4">
          {pagina > 1 ? (
            <Link href={urlLista(filtros, pagina - 1)} className="btn btn-borde min-h-[2.75rem] px-4">
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
              Anterior
            </Link>
          ) : (
            <span />
          )}
          <p className="text-base text-texto-suave">
            Página {Math.min(pagina, paginas)} de {paginas}
          </p>
          {pagina < paginas ? (
            <Link href={urlLista(filtros, pagina + 1)} className="btn btn-borde min-h-[2.75rem] px-4">
              Siguiente
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  );
}

export default function Aplicantes({ searchParams }: PageProps<"/admin">) {
  return (
    <Suspense fallback={<Cargando texto="Cargando aplicantes…" />}>
      <ListaAplicantes searchParams={searchParams} />
    </Suspense>
  );
}
