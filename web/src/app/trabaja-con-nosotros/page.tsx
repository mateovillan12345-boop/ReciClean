import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { BotonWhatsApp } from "@/components/BotonWhatsApp";
import { FormularioPostulacion } from "@/components/Formularios";
import { Foto } from "@/components/Foto";
import { CabeceraPagina, TituloSeccion } from "@/components/Secciones";
import { trabajo } from "@/content/empresa";
import { funciones, mensajePostulacion } from "@/lib/site";

export const metadata: Metadata = {
  title: "Trabaja con nosotros",
  description:
    "Postula para trabajar en ReciClean: seguro contra accidentes, pago justo y puntual, capacitación y un ambiente de respeto e inclusión en La Paz y El Alto.",
  alternates: { canonical: "/trabaja-con-nosotros" },
};

export default function TrabajaConNosotros() {
  // Página oculta por ahora (ver funciones en lib/site.ts).
  if (!funciones.trabajaConNosotros) notFound();

  return (
    <>
      <CabeceraPagina
        etiqueta="Trabaja con ReciClean"
        titulo={trabajo.titulo}
        texto="Desde 2020 generando empleo en La Paz y El Alto."
      >
        <a href="#postular" className="btn btn-principal">
          Postula aquí
        </a>
        <BotonWhatsApp variante="borde" mensaje={mensajePostulacion}>
          Postula por WhatsApp
        </BotonWhatsApp>
      </CabeceraPagina>

      <section className="seccion">
        <div className="contenedor grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <TituloSeccion etiqueta="Nuestra gente" titulo="El trabajo de limpieza merece respeto" />
            {trabajo.texto.map((p) => (
              <p key={p.slice(0, 24)} className="mt-5 text-texto-suave">
                {p}
              </p>
            ))}
          </div>
          <figure>
            <Foto
              nombre="equipo-reconocimiento"
              alt="Integrantes de ReciClean recibiendo un certificado de reconocimiento"
              className="aspect-[4/3] w-full rounded object-cover"
              principal
            />
            <figcaption className="mt-3 text-sm text-texto-suave">
              Entrega de reconocimientos al equipo de ReciClean.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="seccion bg-agua">
        <div className="contenedor">
          <TituloSeccion etiqueta="Beneficios" titulo="Lo que ofrecemos" />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trabajo.ofrecemos.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded bg-white p-5 font-medium"
              >
                <Check
                  aria-hidden="true"
                  className="mt-0.5 h-6 w-6 shrink-0 text-turquesa"
                  strokeWidth={2.5}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="postular" className="seccion scroll-mt-24">
        <div className="contenedor grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
          <div>
            <TituloSeccion
              etiqueta="Postulación"
              titulo="Postula en un minuto"
              texto="Llena tus datos y se abrirá WhatsApp con tu postulación lista para enviar. No necesitas currículum."
            />
            <p className="mt-6 text-texto-suave">
              ¿Prefieres escribirnos directamente?
            </p>
            <BotonWhatsApp variante="borde" mensaje={mensajePostulacion} className="mt-3">
              Postula por WhatsApp
            </BotonWhatsApp>
            <Foto
              nombre="equipo-celebracion"
              alt="Integrantes del equipo de ReciClean durante una celebración interna"
              className="mt-10 hidden aspect-[2/1] w-full rounded object-cover lg:block"
            />
          </div>
          <div className="rounded bg-agua p-6 md:p-8">
            <FormularioPostulacion />
          </div>
        </div>
      </section>
    </>
  );
}
