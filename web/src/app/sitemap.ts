import type { MetadataRoute } from "next";
import { servicios } from "@/content/servicios";
import { vacantesActivas } from "@/lib/empleos/consultas";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rutas = [
    "",
    "/servicios",
    ...servicios.map((s) => `/servicios/${s.slug}`),
    "/sostenibilidad",
    "/nosotros",
    "/empleos",
    "/contacto",
  ];
  // Vacantes activas (misma consulta en caché que /empleos: se actualiza al publicar o pausar).
  const vacantes = await vacantesActivas();
  return [
    ...rutas.map((ruta) => ({ url: `${site.url}${ruta}` })),
    ...vacantes.map((v) => ({ url: `${site.url}/empleos/${v.slug}`, lastModified: v.creada_en })),
  ];
}
