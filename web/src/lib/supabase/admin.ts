import "server-only";
import { createClient } from "@supabase/supabase-js";
import { urlSupabase } from "./entorno";

/**
 * Cliente con la clave SECRETA (service_role): se salta RLS.
 * `import "server-only"` hace fallar el build si algún componente de cliente lo importa.
 *
 * Úsalo SOLO después de validar todo en el servidor:
 * - insertar aplicaciones e intentos (envío público, fase 3),
 * - crear URLs firmadas de subida y revisar archivos,
 * - la limpieza diaria (/api/limpieza).
 * El panel /admin NO lo usa: trabaja con la sesión del usuario (lib/supabase/servidor.ts) y RLS.
 */
export function clienteAdmin() {
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!clave) {
    throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY. Revisa .env.local (ver .env.example).");
  }
  return createClient(urlSupabase(), clave, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
