import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { clienteServidor } from "@/lib/supabase/servidor";

// Capa de acceso del panel: TODA página, acción y ruta de /admin empieza llamando a requerirAdmin().
// El proxy (src/proxy.ts) solo hace una revisión rápida; esta es la que cuenta.
//
// "Admin" = cualquier usuario con sesión en Supabase Auth. Por eso el registro público
// debe estar DESACTIVADO (Authentication → Sign In / Providers → "Allow new users to sign up").

export const RUTA_LOGIN = "/admin/login";

/** Cliente de Supabase con la sesión del admin. Sin sesión válida, redirige al login. */
export async function requerirAdmin() {
  // El panel nunca se prerenderiza: siempre se arma en el momento de la petición.
  // Sin esto, Next intenta prerenderizarlo y Supabase llama a Date.now() al revisar la sesión.
  await connection();
  const supabase = await clienteServidor();
  // getUser() pregunta a Supabase si la sesión sigue viva (no confía solo en la cookie).
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect(RUTA_LOGIN);
  return { supabase, usuario: { id: data.user.id, correo: data.user.email ?? "" } };
}
