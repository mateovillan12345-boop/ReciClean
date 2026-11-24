import { Suspense } from "react";
import { AnimacionesScroll } from "@/components/AnimacionesScroll";
import { Encabezado } from "@/components/Encabezado";
import { PiePagina } from "@/components/PiePagina";
import { WhatsAppFlotante } from "@/components/WhatsAppFlotante";
import { site } from "@/lib/site";

const negocioLocal = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.nombre,
  description: site.descripcion,
  url: site.url,
  image: `${site.url}/images/equipo.webp`,
  telephone: "+59176227202",
  email: site.correo,
  sameAs: [site.facebook],
  foundingDate: "2020",
  founder: { "@type": "Person", name: "Vivian Carlo" },
  areaServed: [
    { "@type": "City", name: "La Paz" },
    { "@type": "City", name: "El Alto" },
  ],
  address: { "@type": "PostalAddress", addressLocality: "La Paz", addressCountry: "BO" },
};

/** Marco del sitio público: header, footer y botón flotante de WhatsApp. */
export default function LayoutSitio({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Encabezado />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <PiePagina />
      <WhatsAppFlotante />
      {/* Animaciones al hacer scroll en todas las páginas públicas (lee la ruta: va en Suspense) */}
      <Suspense fallback={null}>
        <AnimacionesScroll />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(negocioLocal) }}
      />
    </>
  );
}
