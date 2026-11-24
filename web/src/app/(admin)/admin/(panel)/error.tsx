"use client";

/** Si Supabase falla dentro del panel, se muestra esto en vez de una página rota. */
export default function ErrorPanel({ retry }: { error: Error; retry: () => void }) {
  return (
    <div role="alert" className="rounded-lg border border-linea bg-white px-6 py-12 text-center">
      <h1 className="text-2xl font-normal">Algo salió mal</h1>
      <p className="mt-2 text-texto-suave">No pudimos completar la operación. Revisa tu conexión e inténtalo de nuevo.</p>
      <button type="button" onClick={retry} className="btn btn-turquesa mt-6">
        Reintentar
      </button>
    </div>
  );
}
