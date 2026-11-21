import type { MetadataRoute } from "next";
import { servicios } from "@/content/servicios";
import { funciones, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const rutas = [
    "",
    "/servicios",
    ...servicios.map((s) => `/servicios/${s.slug}`),
    "/sostenibilidad",
    "/nosotros",
    ...(funciones.trabajaConNosotros ? ["/trabaja-con-nosotros"] : []),
    "/contacto",
  ];
  return rutas.map((ruta) => ({ url: `${site.url}${ruta}` }));
}
