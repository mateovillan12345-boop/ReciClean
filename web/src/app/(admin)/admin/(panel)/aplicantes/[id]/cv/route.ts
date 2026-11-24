import { NextResponse, type NextRequest } from "next/server";
import { requerirAdmin } from "@/lib/admin/sesion";
import { slugDesde } from "@/lib/empleos/texto";
import { BUCKET_CVS } from "@/lib/empleos/tipos";

/**
 * Abre o descarga el CV de una postulación.
 * Verifica la sesión y redirige a una URL firmada que caduca en 60 segundos:
 * el enlace real al archivo nunca queda guardado en la página.
 */
export async function GET(request: NextRequest, { params }: RouteContext<"/admin/aplicantes/[id]/cv">) {
  const { supabase } = await requerirAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return new NextResponse("No encontrado", { status: 404 });

  const { data: a } = await supabase.from("aplicaciones").select("nombre, cv_ruta").eq("id", id).maybeSingle();
  if (!a) return new NextResponse("No encontrado", { status: 404 });

  const descargar = request.nextUrl.searchParams.get("descargar") === "1";
  const extension = a.cv_ruta.split(".").pop();
  const { data, error } = await supabase.storage
    .from(BUCKET_CVS)
    .createSignedUrl(a.cv_ruta, 60, descargar ? { download: `CV-${slugDesde(a.nombre)}.${extension}` } : undefined);
  if (error || !data) return new NextResponse("No se encontró el archivo del CV.", { status: 404 });

  const respuesta = NextResponse.redirect(data.signedUrl);
  respuesta.headers.set("Cache-Control", "no-store");
  return respuesta;
}
