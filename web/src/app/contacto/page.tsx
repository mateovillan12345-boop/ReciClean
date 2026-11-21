import type { Metadata } from "next";
import { BotonWhatsApp } from "@/components/BotonWhatsApp";
import { FormularioContacto } from "@/components/Formularios";
import { MapaOficinas } from "@/components/MapaOficinas";
import { site } from "@/lib/site";
import { CabeceraPagina, SeccionPreguntas } from "@/components/Secciones";

export const metadata: Metadata = {
  title: "Contacto y cotizaciones",
  description:
    "Cotiza tu servicio de limpieza en La Paz y El Alto por WhatsApp. Respondemos en menos de 24 horas.",
  alternates: { canonical: "/contacto" },
};

export default function Contacto() {
  return (
    <>
      <CabeceraPagina
        etiqueta="Contacto"
        titulo="Cotiza tu servicio de limpieza"
        texto="Escríbenos por WhatsApp o llena el formulario. Te enviamos una cotización sin compromiso."
      />

      <SeccionPreguntas />

      <section className="seccion">
        <div className="contenedor grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
          <div>
            <h2>Hablemos</h2>
            <ul className="mt-7 space-y-6">
              <li>
                <span>
                  <strong className="block font-bold">WhatsApp {site.telefono}</strong>
                  <span className="text-base text-texto-suave">
                    Es nuestro canal principal de atención.
                  </span>
                </span>
              </li>
              <li>
                <span>
                  <strong className="block font-bold">Correo</strong>
                  <a href={`mailto:${site.correo}`} className="enlace break-all text-base">
                    {site.correo}
                  </a>
                </span>
              </li>
              <li>
                <span>
                  <strong className="block font-bold">Facebook</strong>
                  <a
                    href={site.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="enlace text-base"
                  >
                    ReciClean en Facebook
                  </a>
                </span>
              </li>
              <li>
                <span>
                  <strong className="block font-bold">Respuesta en menos de 24 horas</strong>
                  <span className="text-base text-texto-suave">
                    Cuéntanos qué necesitas y coordinamos la evaluación.
                  </span>
                </span>
              </li>
              <li>
                <span>
                  <strong className="block font-bold">Zona de cobertura</strong>
                  <span className="text-base text-texto-suave">La Paz y El Alto, Bolivia.</span>
                </span>
              </li>
            </ul>
            <BotonWhatsApp className="mt-8" />
          </div>

          <div className="rounded bg-agua p-6 md:p-8">
            <h2 className="text-2xl md:text-[1.75rem]">Formulario de cotización</h2>
            <p className="mb-6 mt-2 text-base text-texto-suave">
              Al enviar se abre WhatsApp con tu mensaje ya escrito.
            </p>
            <FormularioContacto />
          </div>
        </div>
      </section>

      <MapaOficinas />

    </>
  );
}
