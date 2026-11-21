import type { Metadata } from "next";
import localFont from "next/font/local";
import { Encabezado } from "@/components/Encabezado";
import { PiePagina } from "@/components/PiePagina";
import { WhatsAppFlotante } from "@/components/WhatsAppFlotante";
import { site } from "@/lib/site";
import "./globals.css";

/* Fuente activa: Huninn (archivo en src/app/fonts). Solo existe en peso Regular (400). 
const fuente = localFont({
  variable: "--font-principal",
  src: [{ path: "./fonts/Huninn-Regular.ttf", weight: "400", style: "normal" }],
  display: "swap",
});
*/
/* Para volver a DM Sans, reemplaza el bloque de arriba por este (es variable: pesos 100 a 1000):*/
const fuente = localFont({
  variable: "--font-principal",
  src: [
    { path: "./fonts/DMSans-Variable.ttf", weight: "100 1000", style: "normal" },
    { path: "./fonts/DMSans-Italic-Variable.ttf", weight: "100 1000", style: "italic" },
  ],
  display: "swap",
});

/* Fredoka: solo para el nombre "ReciClean" del header (variable: pesos 300 a 700). */
const fuenteLogo = localFont({
  variable: "--font-fredoka",
  src: [{ path: "./fonts/Fredoka-Variable.ttf", weight: "300 700", style: "normal" }],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "ReciClean | Empresa de limpieza en La Paz y El Alto",
    template: "%s | ReciClean",
  },
  description: site.descripcion,
  keywords: [
    "empresa de limpieza La Paz",
    "limpieza institucional La Paz",
    "limpieza institucional El Alto",
    "limpieza de oficinas La Paz",
    "limpieza post obra La Paz",
    "lavado de alfombras La Paz",
    "lavado de sillones a domicilio La Paz",
    "limpieza a domicilio El Alto",
    "empresa de limpieza sostenible Bolivia",
  ],
  openGraph: {
    type: "website",
    locale: "es_BO",
    siteName: site.nombre,
    title: "ReciClean | Empresa de limpieza en La Paz y El Alto",
    description: site.descripcion,
    images: [{ url: "/images/equipo.webp", width: 1400, height: 856, alt: "Equipo de ReciClean" }],
  },
  icons: { icon: "/images/logo.png" },
};

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${fuente.variable} ${fuenteLogo.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:font-bold focus:text-morado"
        >
          Saltar al contenido
        </a>
        <Encabezado />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <PiePagina />
        <WhatsAppFlotante />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(negocioLocal) }}
        />
      </body>
    </html>
  );
}
