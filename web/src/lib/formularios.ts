import { z } from "zod";

// Teléfono boliviano: 8 dígitos (celular 6/7, fijo 2/3/4), con o sin +591.
const telefono = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s().-]/g, ""))
  .refine((v) => /^(\+?591)?[2-7]\d{7}$/.test(v), {
    message: "Escribe un teléfono válido de 8 dígitos.",
  });

const nombre = z.string().trim().min(3, "Escribe tu nombre completo.").max(80);

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

export const disponibilidades = [
  "Tiempo completo",
  "Medio tiempo, mañanas",
  "Medio tiempo, tardes",
  "Fines de semana",
] as const;

export const esquemaPostulacion = z.object({
  nombre,
  telefono,
  zona: z.enum(zonas, { message: "Elige una zona." }),
  experiencia: z.string().trim().max(400).optional(),
  disponibilidad: z.enum(disponibilidades, { message: "Elige tu disponibilidad." }),
  consentimiento: z.literal(true, {
    message: "Necesitamos tu autorización para usar tus datos.",
  }),
});

export type DatosPostulacion = z.infer<typeof esquemaPostulacion>;

export function mensajePostulacionCompleta(d: DatosPostulacion): string {
  const lineas = [
    "Hola ReciClean, vengo de la página web y quiero postular para trabajar con ustedes.",
    "",
    `Nombre: ${d.nombre}`,
    `Teléfono: ${d.telefono}`,
    `Zona donde vivo: ${d.zona}`,
    `Disponibilidad: ${d.disponibilidad}`,
  ];
  if (d.experiencia) lineas.push(`Experiencia: ${d.experiencia}`);
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
