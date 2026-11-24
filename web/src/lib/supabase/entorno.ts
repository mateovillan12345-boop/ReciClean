// Variables públicas de Supabase (existen en servidor y navegador).
// Next solo incrusta NEXT_PUBLIC_* en el navegador si se leen con el nombre literal, por eso no se usa process.env[nombre].

function requerida(nombre: string, valor: string | undefined): string {
  if (!valor) {
    throw new Error(`Falta la variable de entorno ${nombre}. Revisa .env.local (ver .env.example).`);
  }
  return valor;
}

export function urlSupabase(): string {
  return requerida("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function clavePublicaSupabase(): string {
  return requerida("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
