import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import type { DatosPostulante } from "./esquemas";
import type { ExtensionCV } from "./tipos";

// Piezas de seguridad del envío de postulaciones. Solo servidor: usan secretos.

function secreto(): string {
  const valor = process.env.POSTULACION_SECRET;
  if (!valor || valor.length < 32) {
    throw new Error("Falta POSTULACION_SECRET (mínimo 32 caracteres). Revisa .env.local.");
  }
  return valor;
}

function firmar(proposito: string, texto: string): string {
  return createHmac("sha256", secreto()).update(`${proposito}:${texto}`).digest("base64url");
}

// ---------------------------------------------------------------- IP

/** IP del visitante. En Vercel la pone la plataforma en x-forwarded-for (el primer valor es el real). */
export async function ipVisitante(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "desconocida";
}

/** La IP nunca se guarda tal cual: solo un hash con sal secreta (no se puede revertir sin el secreto). */
export function hashIp(ip: string): string {
  return firmar("ip", ip);
}

// ---------------------------------------------------------------- Turnstile

/** Pregunta a Cloudflare si el token del widget es válido. Cada token sirve una sola vez. */
export async function verificarTurnstile(token: string, ip: string): Promise<boolean> {
  const clave = process.env.TURNSTILE_SECRET_KEY;
  if (!clave) throw new Error("Falta TURNSTILE_SECRET_KEY. Revisa .env.local.");

  const cuerpo = new URLSearchParams({ secret: clave, response: token });
  if (ip !== "desconocida") cuerpo.set("remoteip", ip);

  try {
    const respuesta = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: cuerpo,
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const datos = (await respuesta.json()) as { success?: boolean };
    return datos.success === true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------- Ticket

/**
 * Ticket firmado que une los dos pasos del envío (preparar → subir CV → confirmar).
 * Lleva los datos ya validados: confirmarPostulacion confía en ellos porque solo el servidor
 * sabe firmarlos, y no se pueden cambiar sin romper la firma. Caduca a los 10 minutos.
 */
export type ContenidoTicket = {
  datos: DatosPostulante;
  vacanteId: string | null;
  ruta: string;
  ipHash: string;
  vence: number; // milisegundos (Date.now())
};

export const DURACION_TICKET_MS = 10 * 60 * 1000;

export function crearTicket(contenido: ContenidoTicket): string {
  const cuerpo = Buffer.from(JSON.stringify(contenido)).toString("base64url");
  return `${cuerpo}.${firmar("ticket", cuerpo)}`;
}

/** Devuelve el contenido si la firma es correcta y no venció; si no, null. */
export function leerTicket(ticket: unknown): ContenidoTicket | null {
  if (typeof ticket !== "string" || ticket.length > 8000) return null;
  const [cuerpo, firma] = ticket.split(".");
  if (!cuerpo || !firma) return null;

  const esperada = Buffer.from(firmar("ticket", cuerpo));
  const recibida = Buffer.from(firma);
  // timingSafeEqual: compara sin filtrar por el tiempo cuántos caracteres coinciden.
  if (esperada.length !== recibida.length || !timingSafeEqual(esperada, recibida)) return null;

  try {
    const contenido = JSON.parse(Buffer.from(cuerpo, "base64url").toString("utf8")) as ContenidoTicket;
    return contenido.vence > Date.now() ? contenido : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------- Archivo

/** Primeros bytes ("magic bytes") de cada formato: delatan el tipo real aunque cambien la extensión. */
const firmasArchivo: Record<ExtensionCV, number[]> = {
  pdf: [0x25, 0x50, 0x44, 0x46, 0x2d], // %PDF-
  png: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  jpg: [0xff, 0xd8, 0xff],
};

export const BYTES_A_LEER = 8;

export function contenidoCoincide(bytes: Uint8Array, ext: ExtensionCV): boolean {
  const firma = firmasArchivo[ext];
  return bytes.length >= firma.length && firma.every((b, i) => bytes[i] === b);
}

/** Carpeta del mes en hora de Bolivia (UTC-4): "2026-11". */
export function carpetaDelMes(ahora: number): string {
  return new Date(ahora - 4 * 60 * 60 * 1000).toISOString().slice(0, 7);
}
