"use server";

import { randomUUID } from "node:crypto";
import { erroresPorCampo } from "@/lib/formularios";
import {
  esquemaDatosPostulante,
  esquemaPreparar,
  extensionDeTipo,
  type EntradaPreparar,
  type Preparada,
  type Resultado,
} from "@/lib/empleos/esquemas";
import {
  BYTES_A_LEER,
  carpetaDelMes,
  contenidoCoincide,
  crearTicket,
  DURACION_TICKET_MS,
  hashIp,
  ipVisitante,
  leerTicket,
  verificarTurnstile,
} from "@/lib/empleos/seguridad";
import { BUCKET_CVS, TAMANO_MAXIMO_CV, type ExtensionCV } from "@/lib/empleos/tipos";
import { clienteAdmin } from "@/lib/supabase/admin";

// Envío de una postulación en dos llamadas:
//   1. prepararPostulacion: valida todo y entrega una URL firmada para subir el CV + un ticket.
//   2. El navegador sube el CV directo a Supabase Storage (no pasa por este servidor).
//   3. confirmarPostulacion: revisa que el archivo sea de verdad PDF/PNG/JPG y guarda la fila.
// Estas funciones se pueden llamar desde fuera del formulario: por eso validan TODO de nuevo.

const LIMITE_POR_HORA = 3;
const ERROR_GENERAL = "No pudimos enviar tu postulación. Inténtalo de nuevo en unos minutos.";

export async function prepararPostulacion(entrada: EntradaPreparar): Promise<Resultado<Preparada>> {
  try {
    // Honeypot lleno = bot. Se responde como si todo saliera bien para no darle pistas.
    if (typeof entrada?.sitioWeb !== "string" || entrada.sitioWeb !== "") {
      return { ok: true, simulada: true };
    }

    const validacion = esquemaPreparar.safeParse(entrada);
    if (!validacion.success) {
      return { ok: false, error: "Revisa los datos marcados.", campos: erroresPorCampo(validacion.error) };
    }
    const { archivo, turnstile, vacanteId, ...resto } = validacion.data;
    const datos = esquemaDatosPostulante.parse(resto); // solo los datos de la persona (sin consentimiento)

    const ip = await ipVisitante();
    if (!(await verificarTurnstile(turnstile, ip))) {
      return {
        ok: false,
        error: "No pudimos verificar que eres una persona. Vuelve a marcar la verificación.",
        campos: { turnstile: "Vuelve a completar la verificación." },
      };
    }

    const supabase = clienteAdmin();
    const ipHash = hashIp(ip);
    const telefonos = datos.celular ? [datos.telefono, datos.celular] : [datos.telefono];

    // Lista de bloqueados (por teléfono, celular o correo). Igual que el honeypot: respuesta "normal".
    const bloqueoTelefono = await supabase.from("bloqueados").select("id").in("telefono", telefonos).limit(1);
    const bloqueoCorreo = datos.correo
      ? await supabase.from("bloqueados").select("id").eq("correo", datos.correo).limit(1)
      : { data: [], error: null };
    if (bloqueoTelefono.error || bloqueoCorreo.error) throw bloqueoTelefono.error ?? bloqueoCorreo.error;
    if (bloqueoTelefono.data.length > 0 || bloqueoCorreo.data.length > 0) {
      return { ok: true, simulada: true };
    }

    // Límite: 3 intentos por hora por IP o por teléfono.
    const haceUnaHora = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const [porIp, porTelefono] = await Promise.all([
      supabase
        .from("intentos_postulacion")
        .select("id", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .gte("creado_en", haceUnaHora),
      supabase
        .from("intentos_postulacion")
        .select("id", { count: "exact", head: true })
        .in("telefono", telefonos)
        .gte("creado_en", haceUnaHora),
    ]);
    if (porIp.error || porTelefono.error) throw porIp.error ?? porTelefono.error;
    if ((porIp.count ?? 0) >= LIMITE_POR_HORA || (porTelefono.count ?? 0) >= LIMITE_POR_HORA) {
      return {
        ok: false,
        error: "Ya recibimos varios envíos desde este teléfono o conexión. Inténtalo de nuevo en una hora.",
      };
    }

    // La vacante tiene que seguir abierta.
    if (vacanteId) {
      const { data: vacante, error } = await supabase
        .from("vacantes")
        .select("id")
        .eq("id", vacanteId)
        .eq("estado", "activa")
        .maybeSingle();
      if (error) throw error;
      if (!vacante) {
        return {
          ok: false,
          error: "Esta vacante ya no recibe postulaciones. Puedes enviar tu CV como postulación espontánea.",
        };
      }
    }

    const { error: errorIntento } = await supabase
      .from("intentos_postulacion")
      .insert({ ip_hash: ipHash, telefono: datos.telefono });
    if (errorIntento) throw errorIntento;

    // Nombre del archivo: lo decide el servidor (nunca el nombre original del usuario).
    const ext = extensionDeTipo(archivo.tipo)!;
    const ahora = Date.now();
    const ruta = `${carpetaDelMes(ahora)}/${randomUUID()}.${ext}`;
    const { data: subida, error: errorSubida } = await supabase.storage
      .from(BUCKET_CVS)
      .createSignedUploadUrl(ruta);
    if (errorSubida) throw errorSubida;

    const ticket = crearTicket({ datos, vacanteId, ruta, ipHash, vence: ahora + DURACION_TICKET_MS });
    return { ok: true, simulada: false, ruta, tokenSubida: subida.token, ticket };
  } catch (error) {
    console.error("prepararPostulacion:", error);
    return { ok: false, error: ERROR_GENERAL };
  }
}

export async function confirmarPostulacion(ticket: string): Promise<Resultado> {
  const contenido = leerTicket(ticket);
  if (!contenido) {
    return { ok: false, error: "Pasó demasiado tiempo o el envío no es válido. Vuelve a enviar tu postulación." };
  }
  const { datos, vacanteId, ruta, ipHash } = contenido;
  const ext = ruta.split(".").pop() as ExtensionCV;

  try {
    const supabase = clienteAdmin();
    const almacen = supabase.storage.from(BUCKET_CVS);

    // Leer solo los primeros bytes del archivo subido (petición Range sobre una URL firmada de 60 s).
    const { data: firmada, error: errorFirma } = await almacen.createSignedUrl(ruta, 60);
    if (errorFirma) {
      return { ok: false, error: "No recibimos tu archivo. Vuelve a intentarlo." };
    }
    const respuesta = await fetch(firmada.signedUrl, {
      headers: { Range: `bytes=0-${BYTES_A_LEER - 1}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!respuesta.ok) {
      return { ok: false, error: "No recibimos tu archivo. Vuelve a intentarlo." };
    }
    const bytes = new Uint8Array(await respuesta.arrayBuffer()).slice(0, BYTES_A_LEER);
    // "Content-Range: bytes 0-7/123456" → tamaño total del archivo.
    const total = Number(respuesta.headers.get("content-range")?.split("/")[1] ?? bytes.length);

    if (!contenidoCoincide(bytes, ext) || total > TAMANO_MAXIMO_CV) {
      await almacen.remove([ruta]);
      return {
        ok: false,
        error: "El archivo no es un PDF, PNG o JPG válido. Elige otro archivo y vuelve a enviarlo.",
        campos: { archivo: "El archivo no es un PDF, PNG o JPG válido." },
      };
    }

    const { error } = await supabase.from("aplicaciones").insert({
      vacante_id: vacanteId,
      nombre: datos.nombre,
      telefono: datos.telefono,
      celular: datos.celular ?? null,
      correo: datos.correo ?? null,
      zona: datos.zona,
      experiencia: datos.experiencia,
      cv_ruta: ruta,
      ip_hash: ipHash,
    });
    // 23505 = ya existe una postulación con ese archivo: el mismo ticket se envió dos veces.
    if (error && error.code !== "23505") {
      await almacen.remove([ruta]);
      throw error;
    }
    return { ok: true };
  } catch (error) {
    console.error("confirmarPostulacion:", error);
    return { ok: false, error: ERROR_GENERAL };
  }
}
