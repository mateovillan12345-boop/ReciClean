import { createBrowserClient } from "@supabase/ssr";
import { clavePublicaSupabase, urlSupabase } from "./entorno";

/**
 * Cliente para el navegador. Solo tiene la clave pública: lo que puede hacer lo decide RLS.
 * Se usa para subir el CV con la URL firmada que entrega el servidor y para el login del panel.
 */
export function clienteNavegador() {
  return createBrowserClient(urlSupabase(), clavePublicaSupabase());
}
