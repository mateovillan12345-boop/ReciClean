import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { clientePublico } from "@/lib/supabase/publico";
import type { Vacante } from "./tipos";

/**
 * Lecturas públicas de vacantes, con caché ('use cache').
 * El panel /admin invalida la etiqueta "vacantes" al crear, editar o cambiar el estado de una vacante,
 * así los cambios se ven al instante. Además, la caché se renueva sola cada hora por si acaso.
 * Usan el cliente anónimo: RLS solo deja ver las vacantes con estado "activa".
 */

export const ETIQUETA_VACANTES = "vacantes";

const COLUMNAS =
  "id, titulo, slug, area, zona, jornada, horario, tipo_contrato, salario, resumen, descripcion, responsabilidades, requisitos, estado, creada_en, cubierta_en";

export async function vacantesActivas(): Promise<Vacante[]> {
  "use cache";
  cacheTag(ETIQUETA_VACANTES);
  cacheLife("hours");

  const { data, error } = await clientePublico()
    .from("vacantes")
    .select(COLUMNAS)
    .eq("estado", "activa")
    .order("creada_en", { ascending: false });

  // Si Supabase falla, se lanza el error en vez de guardar en caché una lista vacía.
  if (error) throw new Error(`No se pudieron cargar las vacantes: ${error.message}`);
  return (data ?? []) as Vacante[];
}

export async function vacantePorSlug(slug: string): Promise<Vacante | null> {
  "use cache";
  cacheTag(ETIQUETA_VACANTES);
  cacheLife("hours");

  const { data, error } = await clientePublico()
    .from("vacantes")
    .select(COLUMNAS)
    .eq("slug", slug)
    .eq("estado", "activa")
    .maybeSingle();

  if (error) throw new Error(`No se pudo cargar la vacante: ${error.message}`);
  return (data as Vacante | null) ?? null;
}
