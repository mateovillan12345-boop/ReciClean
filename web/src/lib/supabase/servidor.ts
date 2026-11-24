import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { clavePublicaSupabase, urlSupabase } from "./entorno";

/**
 * Cliente con la sesión del usuario (cookies), para el panel /admin.
 * Actúa como el rol `authenticated` si hay sesión, o `anon` si no.
 * Crea uno nuevo en cada petición: nunca lo guardes en una variable global.
 *
 * Con cacheComponents, lo que llame a esto lee la petición: debe ir dentro de <Suspense>.
 */
export async function clienteServidor() {
  const almacen = await cookies();
  return createServerClient(urlSupabase(), clavePublicaSupabase(), {
    cookies: {
      getAll() {
        return almacen.getAll();
      },
      setAll(cookiesNuevas) {
        // En un Server Component no se pueden escribir cookies; el proxy (src/proxy.ts)
        // es quien refresca la sesión. En Server Actions y Route Handlers sí funciona.
        try {
          cookiesNuevas.forEach(({ name, value, options }) => almacen.set(name, value, options));
        } catch {
          // Ignorado a propósito: llamado desde un Server Component.
        }
      },
    },
  });
}

/** Devuelve el usuario con sesión válida (verificada contra Supabase) o null. */
export async function usuarioActual() {
  const supabase = await clienteServidor();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}
