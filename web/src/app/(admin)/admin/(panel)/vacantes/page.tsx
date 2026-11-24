import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ExternalLink, Plus } from "lucide-react";
import { cambiarEstadoVacante } from "@/app/(admin)/admin/acciones";
import { DialogoConfirmar } from "@/components/admin/DialogoConfirmar";
import { Aviso, Cargando, InsigniaEstado } from "@/components/admin/Piezas";
import { requerirAdmin } from "@/lib/admin/sesion";
import { fechaCorta } from "@/lib/empleos/texto";
import type { EstadoVacante } from "@/lib/empleos/tipos";

export const metadata: Metadata = { title: "Vacantes" };

const avisos: Record<string, string> = {
  creada: "Vacante publicada. Ya se ve en la página de empleos si está activa.",
  editada: "Cambios guardados.",
};

/** Botón pequeño que cambia el estado de una vacante (Pausar / Reactivar). */
function BotonEstado({ id, estado, texto }: { id: string; estado: EstadoVacante; texto: string }) {
  return (
    <form action={cambiarEstadoVacante}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="estado" value={estado} />
      <button type="submit" className="enlace px-1 py-1 text-base">
        {texto}
      </button>
    </form>
  );
}

async function ListaVacantes({ searchParams }: { searchParams: PageProps<"/admin/vacantes">["searchParams"] }) {
  const { supabase } = await requerirAdmin();
  const sp = await searchParams;
  const aviso = avisos[typeof sp.aviso === "string" ? sp.aviso : ""];

  const { data: vacantes, error } = await supabase
    .from("vacantes")
    .select("id, titulo, slug, area, zona, estado, creada_en, aplicaciones(count)")
    .order("creada_en", { ascending: false });
  if (error) throw error;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-normal">Vacantes</h1>
          <p className="mt-1 text-base text-texto-suave">
            {vacantes.filter((v) => v.estado === "activa").length} activas de {vacantes.length}
          </p>
        </div>
        <Link href="/admin/vacantes/nueva" className="btn btn-turquesa">
          <Plus aria-hidden="true" className="h-5 w-5" />
          Nueva vacante
        </Link>
      </div>

      {aviso && (
        <div className="mt-6">
          <Aviso>{aviso}</Aviso>
        </div>
      )}

      {vacantes.length === 0 ? (
        <div className="mt-6 rounded-lg border border-linea bg-white px-6 py-12 text-center">
          <p className="text-lg font-medium">Todavía no hay vacantes.</p>
          <Link href="/admin/vacantes/nueva" className="enlace mt-2 inline-block">
            Publicar la primera
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-linea bg-white">
          <table className="w-full min-w-[52rem] text-left text-base">
            <caption className="sr-only">Vacantes, de la más reciente a la más antigua</caption>
            <thead className="border-b border-linea bg-[#fafbfc] text-sm text-texto-suave">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Puesto</th>
                <th scope="col" className="px-4 py-3 font-medium">Zona</th>
                <th scope="col" className="px-4 py-3 font-medium">Postulaciones</th>
                <th scope="col" className="px-4 py-3 font-medium">Publicada</th>
                <th scope="col" className="px-4 py-3 font-medium">Estado</th>
                <th scope="col" className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-linea">
              {vacantes.map((v) => {
                const postulaciones = (v.aplicaciones as unknown as { count: number }[])[0]?.count ?? 0;
                const estado = v.estado as EstadoVacante;
                return (
                  <tr key={v.id} className="align-top hover:bg-[#fafbfc]">
                    <th scope="row" className="px-4 py-3 font-medium">
                      <Link href={`/admin/vacantes/${v.id}`} className="text-morado hover:underline hover:underline-offset-4">
                        {v.titulo}
                      </Link>
                      <span className="block text-sm font-normal text-texto-suave">{v.area}</span>
                    </th>
                    <td className="px-4 py-3">{v.zona}</td>
                    <td className="px-4 py-3">
                      {postulaciones > 0 ? (
                        <Link href={`/admin?vacante=${v.id}`} className="enlace">
                          {postulaciones} {postulaciones === 1 ? "postulación" : "postulaciones"}
                        </Link>
                      ) : (
                        <span className="text-texto-suave">Ninguna</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-texto-suave">{fechaCorta(v.creada_en)}</td>
                    <td className="px-4 py-3">
                      <InsigniaEstado estado={estado} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <Link href={`/admin/vacantes/${v.id}`} className="enlace px-1 py-1">
                          Editar
                        </Link>
                        {estado === "activa" && <BotonEstado id={v.id} estado="pausada" texto="Pausar" />}
                        {estado !== "activa" && <BotonEstado id={v.id} estado="activa" texto="Reactivar" />}
                        {estado !== "cubierta" && (
                          <DialogoConfirmar
                            textoBoton="Marcar cubierta"
                            claseBoton="enlace px-1 py-1 text-base"
                            titulo={`¿Marcar “${v.titulo}” como cubierta?`}
                            descripcion={
                              <>
                                Deja de verse en la página de empleos. Sus postulaciones se borran
                                automáticamente <strong>a los 7 días</strong> (si la reactivas antes, no se borran).
                              </>
                            }
                            textoConfirmar="Marcar cubierta"
                            accion={cambiarEstadoVacante}
                            ocultos={{ id: v.id, estado: "cubierta" }}
                          />
                        )}
                        {estado === "activa" && (
                          <Link href={`/empleos/${v.slug}`} target="_blank" className="enlace inline-flex items-center gap-1 px-1 py-1">
                            Ver
                            <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                            <span className="sr-only">en el sitio (se abre en otra pestaña)</span>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default function Vacantes({ searchParams }: PageProps<"/admin/vacantes">) {
  return (
    <Suspense fallback={<Cargando texto="Cargando vacantes…" />}>
      <ListaVacantes searchParams={searchParams} />
    </Suspense>
  );
}
