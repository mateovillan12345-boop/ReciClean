"use client";

import { BotonWhatsApp } from "@/components/BotonWhatsApp";
import { mensajePostulacion } from "@/lib/site";

/** Si Supabase no responde, se muestra esto en vez de una página rota. */
export default function ErrorEmpleos({ retry }: { error: Error; retry: () => void }) {
  return (
    <section className="seccion pt-36 md:pt-44">
      <div className="contenedor max-w-2xl">
        <h1>No pudimos cargar las vacantes</h1>
        <p className="mt-4 text-texto-suave">
          Es un problema temporal. Vuelve a intentarlo en unos minutos o escríbenos por WhatsApp.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={retry} className="btn btn-turquesa">
            Reintentar
          </button>
          <BotonWhatsApp variante="borde" mensaje={mensajePostulacion}>
            Escríbenos por WhatsApp
          </BotonWhatsApp>
        </div>
      </div>
    </section>
  );
}
