import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Download, ExternalLink, FileText, Phone } from "lucide-react";
import { desbloquearAplicante } from "@/app/(admin)/admin/acciones";
import { FormularioEstado, ZonaCuidado } from "@/components/admin/AccionesAplicante";
import { Cargando, fechaHora, InsigniaEstado } from "@/components/admin/Piezas";
import { IconoWhatsApp } from "@/components/Iconos";
import { requerirAdmin } from "@/lib/admin/sesion";
import type { Aplicacion } from "@/lib/empleos/tipos";

export const metadata: Metadata = { title: "Aplicante" };

function Dato({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-sm text-texto-suave">{etiqueta}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  );
}

function Tarjeta({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section aria-label={titulo} className="rounded-lg border border-linea bg-white p-5">
      <h2 className="text-base font-semibold">{titulo}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

async function DetalleAplicante({ params }: { params: PageProps<"/admin/aplicantes/[id]">["params"] }) {
  const { supabase } = await requerirAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();

  const { data } = await supabase
    .from("aplicaciones")
    .select("*, vacantes(titulo, slug)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const a = data as Aplicacion & { vacantes: { titulo: string; slug: string } | null };

  const numeros = [a.telefono, a.celular].filter((n): n is string => Boolean(n));
  const { data: bloqueos } = await supabase.from("bloqueados").select("id").in("telefono", numeros).limit(1);
  const bloqueado = (bloqueos ?? []).length > 0;

  const puesto = a.vacantes?.titulo ?? "un puesto en ReciClean";
  const mensaje = `Hola ${a.nombre.split(" ")[0]}, te escribimos de ReciClean por tu postulación a ${puesto}.`;
  const whatsapp = `https://wa.me/591${a.telefono}?text=${encodeURIComponent(mensaje)}`;
  const esPdf = a.cv_ruta.endsWith(".pdf");

  return (
    <>
      <Link href="/admin" className="enlace inline-flex items-center gap-1.5 text-base">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Aplicantes
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-normal">{a.nombre}</h1>
        <InsigniaEstado estado={a.estado} />
        {bloqueado && (
          <span className="rounded-full bg-[#fdecea] px-2.5 py-0.5 text-sm font-medium text-[#b3261e]">Bloqueado</span>
        )}
      </div>
      <p className="mt-1 text-base text-texto-suave">
        {a.vacantes ? (
          <>
            Postuló a{" "}
            <Link href={`/empleos/${a.vacantes.slug}`} target="_blank" className="enlace inline-flex items-center gap-1">
              {a.vacantes.titulo}
              <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="sr-only">(se abre en otra pestaña)</span>
            </Link>
          </>
        ) : (
          "Postulación espontánea (sin vacante)"
        )}{" "}
        · {fechaHora(a.creada_en)}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Tarjeta titulo="Datos">
            <dl className="divide-y divide-linea">
              <Dato etiqueta="Teléfono / WhatsApp">{a.telefono}</Dato>
              <Dato etiqueta="Celular">{a.celular ?? <span className="font-normal text-texto-suave">No indicó</span>}</Dato>
              <Dato etiqueta="Correo">
                {a.correo ? (
                  <a href={`mailto:${a.correo}`} className="enlace break-all">
                    {a.correo}
                  </a>
                ) : (
                  <span className="font-normal text-texto-suave">No indicó</span>
                )}
              </Dato>
              <Dato etiqueta="Vive en">{a.zona}</Dato>
              <Dato etiqueta="Experiencia">{a.experiencia}</Dato>
            </dl>
          </Tarjeta>

          <Tarjeta titulo="CV">
            <div className="flex flex-wrap items-center gap-3">
              <FileText aria-hidden="true" className="h-8 w-8 text-turquesa-oscuro" strokeWidth={1.5} />
              <span className="mr-auto text-base text-texto-suave">{esPdf ? "Documento PDF" : "Imagen"}</span>
              {/* Cada clic pide al servidor un enlace firmado que dura 60 segundos */}
              <a href={`/admin/aplicantes/${a.id}/cv`} target="_blank" rel="noopener" className="btn btn-turquesa min-h-[2.75rem] px-4">
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
                Ver CV
                <span className="sr-only">(se abre en otra pestaña)</span>
              </a>
              <a href={`/admin/aplicantes/${a.id}/cv?descargar=1`} className="btn btn-borde min-h-[2.75rem] px-4">
                <Download aria-hidden="true" className="h-4 w-4" />
                Descargar
              </a>
            </div>
          </Tarjeta>
        </div>

        <div className="space-y-6">
          <Tarjeta titulo="Seguimiento">
            <FormularioEstado id={a.id} estado={a.estado} />
          </Tarjeta>

          <Tarjeta titulo="Contactar">
            <div className="flex flex-col gap-3">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-turquesa">
                <IconoWhatsApp className="h-5 w-5" />
                Escribir por WhatsApp
              </a>
              {numeros.map((n) => (
                <a key={n} href={`tel:+591${n}`} className="btn btn-borde">
                  <Phone aria-hidden="true" className="h-4 w-4" />
                  Llamar al {n}
                </a>
              ))}
            </div>
          </Tarjeta>

          <Tarjeta titulo="Otras acciones">
            <ZonaCuidado id={a.id} nombre={a.nombre} bloqueado={bloqueado} />
            {bloqueado && (
              <form action={desbloquearAplicante} className="mt-3">
                <input type="hidden" name="id" value={a.id} />
                <button type="submit" className="enlace text-base">
                  Quitar el bloqueo
                </button>
              </form>
            )}
          </Tarjeta>
        </div>
      </div>
    </>
  );
}

export default function PaginaAplicante({ params }: PageProps<"/admin/aplicantes/[id]">) {
  return (
    <Suspense fallback={<Cargando texto="Cargando postulación…" />}>
      <DetalleAplicante params={params} />
    </Suspense>
  );
}
