import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { ResumenVacante } from "@/components/empleos/ResumenVacante";
import { Etiqueta } from "@/components/empleos/TarjetaVacante";
import { vacantePorSlug, vacantesActivas } from "@/lib/empleos/consultas";
import { fechaCorta, fechaISO } from "@/lib/empleos/texto";
import type { Vacante } from "@/lib/empleos/tipos";
import { site } from "@/lib/site";

// Con Cache Components hay que devolver al menos un slug. Si no hay vacantes activas,
// este slug de relleno no existe en la base y muestra el 404 (así el build nunca falla).
const SLUG_SIN_VACANTES = "sin-vacantes";

export async function generateStaticParams() {
  const vacantes = await vacantesActivas();
  return vacantes.length > 0 ? vacantes.map((v) => ({ slug: v.slug })) : [{ slug: SLUG_SIN_VACANTES }];
}

export async function generateMetadata({ params }: PageProps<"/empleos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const v = await vacantePorSlug(slug);
  if (!v) return { title: "Vacante no disponible", robots: { index: false } };
  return {
    title: `${v.titulo} en ${v.zona}`,
    description: v.resumen,
    alternates: { canonical: `/empleos/${v.slug}` },
  };
}

/** Datos estructurados JobPosting para que Google muestre la vacante en su buscador de empleos. */
function datosEstructurados(v: Vacante) {
  const tipo = /medio|parcial/i.test(v.jornada) ? "PART_TIME" : "FULL_TIME";
  const descripcion = [
    `<p>${v.descripcion}</p>`,
    v.responsabilidades.length ? `<h3>Qué harás</h3><ul>${v.responsabilidades.map((r) => `<li>${r}</li>`).join("")}</ul>` : "",
    v.requisitos.length ? `<h3>Qué buscamos</h3><ul>${v.requisitos.map((r) => `<li>${r}</li>`).join("")}</ul>` : "",
  ].join("");
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: v.titulo,
    description: descripcion,
    datePosted: fechaISO(v.creada_en),
    employmentType: tipo,
    directApply: true,
    hiringOrganization: {
      "@type": "Organization",
      name: site.nombre,
      sameAs: site.url,
      logo: `${site.url}/images/logo.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: v.zona,
        addressRegion: "La Paz",
        addressCountry: "BO",
      },
    },
  };
}

/** Lista con viñetas de punto negro normales. */
function ListaPuntos({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 list-disc space-y-2.5 pl-5 text-texto-suave marker:text-black">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** JSON dentro de <script>: escapa "<" para que ningún texto pueda cerrar la etiqueta. */
function jsonSeguro(datos: unknown): string {
  return JSON.stringify(datos).replace(/</g, "\\u003c");
}

export default async function DetalleVacante({ params }: PageProps<"/empleos/[slug]">) {
  const { slug } = await params;
  const v = await vacantePorSlug(slug);
  if (!v) notFound();

  return (
    <>
      <section className="bg-agua pb-12 pt-32 md:pb-16 md:pt-40">
        <div className="contenedor entrada-rapida">
          <Link href="/empleos" className="enlace inline-flex items-center gap-1.5 text-base">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Todas las vacantes
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Etiqueta>{v.area}</Etiqueta>
            <Etiqueta>{v.jornada}</Etiqueta>
          </div>
          <h1 className="mt-4 max-w-3xl">{v.titulo}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-texto-suave">
            <CalendarDays aria-hidden="true" className="h-4 w-4" />
            <span>
              Publicada el <time dateTime={fechaISO(v.creada_en)}>{fechaCorta(v.creada_en)}</time>
            </span>
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-texto-suave">
            <MapPin aria-hidden="true" className="h-4 w-4" />
            {v.zona}
          </p>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-16">
          {/* En celular la tarjeta va primero; en escritorio pasa a la derecha y queda fija */}
          <div className="lg:order-2">
            <div className="lg:sticky lg:top-28">
              <ResumenVacante vacante={v} />
            </div>
          </div>

          <article className="lg:order-1">
            <h2 className="text-2xl md:text-[1.75rem]">Sobre el puesto</h2>
            <p className="mt-4 whitespace-pre-line text-texto-suave">{v.descripcion}</p>

            {v.responsabilidades.length > 0 && (
              <>
                <h2 className="mt-10 text-2xl md:text-[1.75rem]">Qué harás</h2>
                <ListaPuntos items={v.responsabilidades} />
              </>
            )}

            {v.requisitos.length > 0 && (
              <>
                <h2 className="mt-10 text-2xl md:text-[1.75rem]">Qué buscamos</h2>
                <ListaPuntos items={v.requisitos} />
              </>
            )}
          </article>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonSeguro(datosEstructurados(v)) }} />
    </>
  );
}
