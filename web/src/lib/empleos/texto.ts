// Utilidades de texto y fechas de la bolsa de trabajo. Sin dependencias: sirven en servidor y navegador.

/** Minúsculas y sin acentos, para buscar "logistica" y encontrar "Logística". */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** "Operario/a de limpieza (La Paz)" → "operario-a-de-limpieza-la-paz" */
export function slugDesde(texto: string): string {
  return normalizar(texto)
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const HORAS_BOLIVIA = -4; // Bolivia no usa horario de verano

/**
 * "12 nov 2026", en hora de Bolivia.
 * Se arma a mano (sin Intl) para que el servidor y el navegador den exactamente el mismo texto.
 */
export function fechaCorta(iso: string): string {
  const d = new Date(new Date(iso).getTime() + HORAS_BOLIVIA * 3_600_000);
  return `${d.getUTCDate()} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Fecha en formato AAAA-MM-DD (hora de Bolivia), para atributos dateTime y datos estructurados. */
export function fechaISO(iso: string): string {
  const d = new Date(new Date(iso).getTime() + HORAS_BOLIVIA * 3_600_000);
  return d.toISOString().slice(0, 10);
}

const DIAS_NUEVA = 3;

/** true si la vacante se publicó hace menos de 3 días. `ahora` lo pasa quien llama (solo en el navegador). */
export function esNueva(creadaEn: string, ahora: number): boolean {
  return ahora - new Date(creadaEn).getTime() < DIAS_NUEVA * 86_400_000;
}
