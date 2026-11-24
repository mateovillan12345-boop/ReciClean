import { z } from "zod";
import { nombre, telefono } from "@/lib/formularios";
import {
  areas,
  estadosVacante,
  experiencias,
  formatosCV,
  TAMANO_MAXIMO_CV,
  zonasPostulante,
  zonasVacante,
} from "./tipos";

// Validación de la postulación. Se usa en el navegador (para mostrar errores al instante)
// y otra vez en el servidor (la única que cuenta: el navegador se puede saltar).

/** Teléfono guardado siempre como 8 dígitos (sin +591), así se compara bien con `bloqueados`. */
const telefonoNormalizado = telefono.transform((v) => v.slice(-8));

/** Campo opcional: si viene vacío (o solo espacios) se guarda como undefined. */
function opcional<T extends z.ZodType>(esquema: T) {
  return z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    esquema.optional(),
  );
}

/** Paso 1 del formulario: datos de la persona. */
export const esquemaDatosPostulante = z.object({
  nombre,
  telefono: telefonoNormalizado,
  celular: opcional(telefonoNormalizado),
  correo: opcional(
    z.string().trim().toLowerCase().max(120).pipe(z.email("Escribe un correo válido.")),
  ),
  zona: z.enum(zonasPostulante, { message: "Elige tu zona." }),
  experiencia: z.enum(experiencias, { message: "Elige tu experiencia." }),
});

export type DatosPostulante = z.infer<typeof esquemaDatosPostulante>;

/** Descripción del archivo (el archivo en sí va directo a Storage, no pasa por el servidor). */
export const esquemaArchivoCV = z.object({
  tipo: z.enum(Object.values(formatosCV) as [string, ...string[]], {
    message: "El CV debe ser PDF, PNG o JPG.",
  }),
  tamano: z
    .number()
    .int()
    .positive("El archivo está vacío.")
    .max(TAMANO_MAXIMO_CV, "El archivo pesa más de 5 MB."),
});

/** Todo lo que el navegador manda en el primer paso del envío (prepararPostulacion). */
export const esquemaPreparar = esquemaDatosPostulante.extend({
  vacanteId: z.uuid().nullable(),
  archivo: esquemaArchivoCV,
  consentimiento: z.literal(true, { message: "Necesitamos tu autorización para continuar." }),
  turnstile: z.string().min(1, "Completa la verificación.").max(4096),
});

/** Lo que manda el navegador, sin validar todavía (por eso todo es string). */
export type EntradaPreparar = Record<keyof DatosPostulante, string> & {
  vacanteId: string | null;
  archivo: { tipo: string; tamano: number };
  consentimiento: boolean;
  turnstile: string;
  /** Honeypot: campo invisible. Una persona lo deja vacío; un bot suele llenarlo. */
  sitioWeb: string;
};

/** Respuesta de las Server Actions. `campos` = errores por campo, para mostrarlos junto a cada uno. */
export type Resultado<T = object> =
  | ({ ok: true } & T)
  | { ok: false; error: string; campos?: Record<string, string> };

/** Lo que devuelve prepararPostulacion: dónde subir el CV y el ticket firmado para confirmar. */
export type Preparada =
  | { simulada: true }
  | { simulada: false; ruta: string; tokenSubida: string; ticket: string };

/** Extensión a partir del tipo MIME (el nombre del archivo del usuario no se usa nunca). */
export function extensionDeTipo(tipo: string) {
  const par = Object.entries(formatosCV).find(([, mime]) => mime === tipo);
  return par?.[0] as keyof typeof formatosCV | undefined;
}

/**
 * Tipo MIME de un archivo elegido en el navegador. Algunos sistemas dejan `file.type` vacío,
 * así que se deduce de la extensión. Devuelve undefined si no es PDF, PNG ni JPG.
 */
export function tipoDeArchivo(archivo: { name: string; type: string }) {
  const permitidos: string[] = Object.values(formatosCV);
  if (permitidos.includes(archivo.type)) return archivo.type;
  const ext = archivo.name.split(".").pop()?.toLowerCase();
  if (ext === "jpeg") return formatosCV.jpg;
  return ext && ext in formatosCV ? formatosCV[ext as keyof typeof formatosCV] : undefined;
}

// ------------------------------------------------------------------ Panel /admin

/** Texto de varias líneas → lista (una línea = un elemento; se ignoran las vacías y las viñetas "- "). */
const lista = z
  .string()
  .transform((v) =>
    v
      .split(/\r?\n/)
      .map((l) => l.replace(/^\s*[-•*]\s*/, "").trim())
      .filter(Boolean),
  )
  .pipe(z.array(z.string().max(200, "Cada línea puede tener hasta 200 caracteres.")).max(20, "Máximo 20 líneas."));

/** Formulario de crear/editar vacante. Los límites son los mismos CHECK de la tabla. */
export const esquemaVacante = z.object({
  titulo: z.string().trim().min(3, "Escribe el título del puesto.").max(120),
  area: z.enum(areas, { message: "Elige un área." }),
  zona: z.enum(zonasVacante, { message: "Elige una zona." }),
  jornada: z.string().trim().min(1, "Escribe la jornada.").max(60),
  horario: z.string().trim().min(1, "Escribe el horario.").max(120),
  tipo_contrato: z.string().trim().min(1, "Escribe el tipo de contrato.").max(60),
  salario: opcional(z.string().trim().max(60)),
  resumen: z.string().trim().min(10, "Escribe un resumen corto (mínimo 10 caracteres).").max(280, "Máximo 280 caracteres."),
  descripcion: z.string().trim().min(20, "Describe el puesto (mínimo 20 caracteres).").max(4000),
  responsabilidades: lista,
  requisitos: lista,
  estado: z.enum(estadosVacante, { message: "Elige un estado." }),
});

export type DatosVacante = z.infer<typeof esquemaVacante>;

export const esquemaLogin = z.object({
  correo: z.string().trim().toLowerCase().pipe(z.email("Escribe un correo válido.")),
  contrasena: z.string().min(1, "Escribe tu contraseña.").max(200),
});
