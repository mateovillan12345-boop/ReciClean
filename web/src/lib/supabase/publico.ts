import "server-only";
import { createClient } from "@supabase/supabase-js";
import { clavePublicaSupabase, urlSupabase } from "./entorno";

/**
 * Cliente anónimo SIN cookies, para lecturas públicas (vacantes activas).
 * Al no leer la petición, se puede usar dentro de funciones con 'use cache'.
 * Solo ve lo que RLS permite al rol `anon`.
 */
export function clientePublico() {
  return createClient(urlSupabase(), clavePublicaSupabase(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
