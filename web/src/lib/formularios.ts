import { z } from "zod";

// Teléfono boliviano: 8 dígitos (celular 6/7, fijo 2/3/4), con o sin +591.
export const telefono = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s().-]/g, ""))
  .refine((v) => /^(\+?591)?[2-7]\d{7}$/.test(v), {
    message: "Escribe un teléfono válido de 8 dígitos.",
  });

export const nombre = z.string().trim().min(3, "Escribe tu nombre completo.").max(80);

export const zonas = ["La Paz", "El Alto"] as const;

export const esquemaContacto = z.object({
  nombre,
  telefono,
  empresa: z.string().trim().max(100).optional(),
  servicio: z.string().min(1, "Elige un tipo de servicio."),
  zona: z.enum(zonas, { message: "Elige una zona." }),
  mensaje: z.string().trim().max(600).optional(),
});

export type DatosContacto = z.infer<typeof esquemaContacto>;

export function mensajeContacto(d: DatosContacto): string {
  const lineas = [
    `Hola ReciClean, vengo de la página web y quiero cotizar un servicio de ${d.servicio}.`,
    "",
    `Nombre: ${d.nombre}`,
    `Teléfono: ${d.telefono}`,
  ];
  if (d.empresa) lineas.push(`Institución o empresa: ${d.empresa}`);
  lineas.push(`Zona: ${d.zona}`);
  if (d.mensaje) lineas.push("", d.mensaje);
  return lineas.join("\n");
}

/** Convierte los errores de Zod en un mapa campo → mensaje. */
export function erroresPorCampo(error: z.ZodError): Record<string, string> {
  const salida: Record<string, string> = {};
  for (const issue of error.issues) {
    const campo = String(issue.path[0] ?? "");
    if (campo && !salida[campo]) salida[campo] = issue.message;
  }
  return salida;
}
