import type { EstadoAplicacion, EstadoVacante } from "@/lib/empleos/tipos";

// Piezas pequeñas del panel, compartidas entre páginas.

export const nombreEstadoAplicacion: Record<EstadoAplicacion, string> = {
  nuevo: "Nuevo",
  revisado: "Revisado",
  entrevista: "Entrevista",
  descartado: "Descartado",
};

export const nombreEstadoVacante: Record<EstadoVacante, string> = {
  activa: "Activa",
  pausada: "Pausada",
  cubierta: "Cubierta",
};

const colores: Record<EstadoAplicacion | EstadoVacante, string> = {
  nuevo: "bg-[#067d98] text-white",
  revisado: "bg-agua text-turquesa-oscuro",
  entrevista: "bg-lila text-morado",
  descartado: "bg-[#eceef1] text-texto-suave",
  activa: "bg-[#e8f5ec] text-[#1d6b3f]",
  pausada: "bg-[#fdf3e1] text-[#8a5300]",
  cubierta: "bg-[#eceef1] text-texto-suave",
};

/** Etiqueta de color para un estado (de aplicación o de vacante). */
export function InsigniaEstado({ estado }: { estado: EstadoAplicacion | EstadoVacante }) {
  const texto =
    estado in nombreEstadoAplicacion
      ? nombreEstadoAplicacion[estado as EstadoAplicacion]
      : nombreEstadoVacante[estado as EstadoVacante];
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-sm font-medium ${colores[estado]}`}>
      {texto}
    </span>
  );
}

/** Esqueleto gris mientras carga una página del panel. */
export function Cargando({ texto = "Cargando…" }: { texto?: string }) {
  return (
    <div role="status" className="animate-pulse space-y-4 motion-reduce:animate-none">
      <span className="sr-only">{texto}</span>
      <div className="h-8 w-56 rounded bg-linea" />
      <div className="h-40 rounded-lg bg-white" />
    </div>
  );
}

/** Mensaje verde/rojo tras una acción. */
export function Aviso({ tipo = "ok", children }: { tipo?: "ok" | "error"; children: React.ReactNode }) {
  return (
    <p
      role={tipo === "error" ? "alert" : "status"}
      className={`rounded p-3 text-base ${tipo === "error" ? "bg-[#fdecea] text-[#b3261e]" : "bg-[#e8f5ec] text-[#1d6b3f]"}`}
    >
      {children}
    </p>
  );
}

/** Fecha y hora cortas en hora de Bolivia: "21 nov 2026, 14:05". */
export function fechaHora(iso: string): string {
  const d = new Date(new Date(iso).getTime() - 4 * 3_600_000);
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${d.getUTCDate()} ${meses[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${hh}:${mm}`;
}
