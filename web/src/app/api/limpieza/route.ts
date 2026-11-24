import { timingSafeEqual } from "node:crypto";
import { NextResponse, connection, type NextRequest } from "next/server";
import { BUCKET_CVS } from "@/lib/empleos/tipos";
import { clienteAdmin } from "@/lib/supabase/admin";

// Limpieza diaria (la llama Vercel Cron, ver vercel.json). Cumple lo que promete el formulario:
// "guardamos tus datos por un máximo de 3 meses o hasta que el puesto sea cubierto".
//  1. Postulaciones de más de 90 días → fila + CV.
//  2. Postulaciones de vacantes cubiertas hace más de 7 días → fila + CV.
//  3. CVs huérfanos (subidos hace más de 24 h y nunca confirmados) → archivo.
//  4. Registros del límite de envíos de más de 1 día.
// Vercel envía "Authorization: Bearer <CRON_SECRET>"; sin eso responde 401.

const DIA = 24 * 60 * 60 * 1000;
const LOTE = 500;

function autorizado(request: NextRequest): boolean {
  const secreto = process.env.CRON_SECRET;
  if (!secreto) return false;
  const esperado = Buffer.from(`Bearer ${secreto}`);
  const recibido = Buffer.from(request.headers.get("authorization") ?? "");
  return esperado.length === recibido.length && timingSafeEqual(esperado, recibido);
}

type Supabase = ReturnType<typeof clienteAdmin>;

/** Qué postulaciones borrar: las recibidas antes de una fecha, o las de ciertas vacantes. */
type Criterio = { antesDe: string } | { vacantes: string[] };

/** Borra postulaciones (primero sus CV, después las filas) por lotes. Devuelve cuántas borró. */
async function borrarAplicaciones(supabase: Supabase, criterio: Criterio) {
  let total = 0;
  for (;;) {
    const consulta = supabase.from("aplicaciones").select("id, cv_ruta").limit(LOTE);
    const { data, error } = await ("antesDe" in criterio
      ? consulta.lt("creada_en", criterio.antesDe)
      : consulta.in("vacante_id", criterio.vacantes));
    if (error) throw error;
    if (!data || data.length === 0) return total;
    const { error: errorArchivos } = await supabase.storage.from(BUCKET_CVS).remove(data.map((a) => a.cv_ruta));
    if (errorArchivos) throw errorArchivos;
    const { error: errorFilas } = await supabase.from("aplicaciones").delete().in("id", data.map((a) => a.id));
    if (errorFilas) throw errorFilas;
    total += data.length;
    if (data.length < LOTE) return total;
  }
}

/** Todos los archivos del bucket: [{ ruta, creado }]. Las carpetas son los meses ("2026-11"). */
async function archivosDelBucket(supabase: Supabase) {
  const almacen = supabase.storage.from(BUCKET_CVS);
  const archivos: { ruta: string; creado: number }[] = [];
  const { data: carpetas, error } = await almacen.list("", { limit: 1000 });
  if (error) throw error;
  for (const carpeta of carpetas ?? []) {
    if (carpeta.id) continue; // un archivo suelto en la raíz, no una carpeta
    for (let desde = 0; ; desde += 1000) {
      const { data, error: e } = await almacen.list(carpeta.name, { limit: 1000, offset: desde });
      if (e) throw e;
      for (const a of data ?? []) {
        if (a.id && !a.name.startsWith(".")) {
          archivos.push({ ruta: `${carpeta.name}/${a.name}`, creado: new Date(a.created_at ?? 0).getTime() });
        }
      }
      if (!data || data.length < 1000) break;
    }
  }
  return archivos;
}

export async function GET(request: NextRequest) {
  await connection(); // nunca se prerenderiza ni se guarda en caché
  if (!autorizado(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const supabase = clienteAdmin();
    const ahora = Date.now();

    // 1. Más de 90 días
    const antiguas = await borrarAplicaciones(supabase, { antesDe: new Date(ahora - 90 * DIA).toISOString() });

    // 2. Vacantes cubiertas hace más de 7 días
    const { data: cubiertas, error: errorCubiertas } = await supabase
      .from("vacantes")
      .select("id")
      .eq("estado", "cubierta")
      .lt("cubierta_en", new Date(ahora - 7 * DIA).toISOString());
    if (errorCubiertas) throw errorCubiertas;
    const idsCubiertas = (cubiertas ?? []).map((v) => v.id);
    const deCubiertas =
      idsCubiertas.length > 0 ? await borrarAplicaciones(supabase, { vacantes: idsCubiertas }) : 0;

    // 3. Huérfanos: archivos de más de 24 h sin postulación confirmada
    const archivos = (await archivosDelBucket(supabase)).filter((a) => a.creado < ahora - DIA);
    const huerfanos: string[] = [];
    for (let i = 0; i < archivos.length; i += LOTE) {
      const rutas = archivos.slice(i, i + LOTE).map((a) => a.ruta);
      const { data: usadas, error: e } = await supabase.from("aplicaciones").select("cv_ruta").in("cv_ruta", rutas);
      if (e) throw e;
      const conDueno = new Set((usadas ?? []).map((u) => u.cv_ruta));
      huerfanos.push(...rutas.filter((r) => !conDueno.has(r)));
    }
    for (let i = 0; i < huerfanos.length; i += LOTE) {
      const { error: e } = await supabase.storage.from(BUCKET_CVS).remove(huerfanos.slice(i, i + LOTE));
      if (e) throw e;
    }

    // 4. Registros del límite de envíos
    const { count: intentos, error: errorIntentos } = await supabase
      .from("intentos_postulacion")
      .delete({ count: "exact" })
      .lt("creado_en", new Date(ahora - DIA).toISOString());
    if (errorIntentos) throw errorIntentos;

    const resumen = { antiguas, deCubiertas, huerfanos: huerfanos.length, intentos: intentos ?? 0 };
    console.log("limpieza:", resumen);
    return NextResponse.json({ ok: true, ...resumen });
  } catch (error) {
    console.error("limpieza:", error);
    return NextResponse.json({ ok: false, error: "Falló la limpieza. Revisa los logs." }, { status: 500 });
  }
}
