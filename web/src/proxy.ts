import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Proxy (antes "middleware") del panel /admin. Hace dos cosas:
//  1. Refresca la sesión de Supabase (renueva las cookies antes de que venzan).
//  2. Revisión RÁPIDA: sin sesión → al login; con sesión en el login → al panel.
// No es la protección real: cada página y acción vuelve a verificar con requerirAdmin().

export async function proxy(request: NextRequest) {
  let respuesta = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesNuevas) {
          cookiesNuevas.forEach(({ name, value }) => request.cookies.set(name, value));
          respuesta = NextResponse.next({ request });
          cookiesNuevas.forEach(({ name, value, options }) => respuesta.cookies.set(name, value, options));
        },
      },
    },
  );

  // getClaims() valida la firma del token de sesión.
  const { data } = await supabase.auth.getClaims();
  const conSesion = Boolean(data?.claims);
  const enLogin = request.nextUrl.pathname === "/admin/login";

  let final = respuesta;
  if (!conSesion && !enLogin) {
    final = NextResponse.redirect(new URL("/admin/login", request.url));
  } else if (conSesion && enLogin) {
    final = NextResponse.redirect(new URL("/admin", request.url));
  }
  if (final !== respuesta) {
    // Conservar las cookies de sesión renovadas también en la redirección.
    respuesta.cookies.getAll().forEach((c) => final.cookies.set(c));
  }

  // Que ningún buscador indexe el panel (además del <meta robots> y de robots.txt).
  final.headers.set("X-Robots-Tag", "noindex, nofollow");
  return final;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
