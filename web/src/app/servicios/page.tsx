import type { Metadata } from "next";
import Link from "next/link";
import { BotonWhatsApp } from "@/components/BotonWhatsApp";
import { Foto } from "@/components/Foto";
import {
  BandaContacto,
  CabeceraPagina,
  Garantias,
  ListaCheck,
  Pasos,
  TituloSeccion,
} from "@/components/Secciones";
import { servicios } from "@/content/servicios";
import { mensajeCotizacion, mensajeVisitaTecnica } from "@/lib/site";

export const metadata: Metadata = {
  title: "Servicios de limpieza en La Paz y El Alto",
  description:
    "Limpieza institucional y empresarial, post obra, a domicilio y flash. Personal asegurado y garantía de satisfacción en La Paz y El Alto.",
  alternates: { canonical: "/servicios" },
};

export default function Servicios() {
  return (
    <>
      <CabeceraPagina
        etiqueta="Servicios"
        titulo="Servicios de limpieza para instituciones, empresas y hogares"
        texto="Cada servicio se cotiza según la superficie, los metros cuadrados y la dificultad. Escríbenos y te enviamos una cotización sin compromiso."
      >
        <BotonWhatsApp />
      </CabeceraPagina>

      <section className="seccion">
        <div className="contenedor space-y-14 md:space-y-20">
          {servicios.map((s, i) => (
            <article
              key={s.slug}
              id={s.slug}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
            >
              <Foto
                nombre={s.imagen}
                alt={s.altImagen}
                className={`aspect-[4/3] w-full rounded object-cover ${
                  i % 2 === 1 ? "lg:order-2" : ""
                }`}
                principal={i === 0}
              />
              <div>
                <p className="flex items-center gap-3">
                  <span
                    className="text-3xl font-light text-[#b9b3bd]"
                    aria-hidden="true"
                  >
                    {s.numero}
                  </span>
                </p>
                <h2 className="mt-2">{s.nombre}</h2>
                <p className="mt-4 text-texto-suave">{s.resumen}</p>
                <ListaCheck
                  className="mt-5 text-base"
                  items={s.incluye.slice(0, 5).map((x) => x.titulo)}
                />
                <div className="mt-7 flex flex-wrap gap-3">
                  {s.destacado ? (
                    <BotonWhatsApp mensaje={mensajeVisitaTecnica}>
                      Solicita una visita técnica
                    </BotonWhatsApp>
                  ) : (
                    <BotonWhatsApp mensaje={mensajeCotizacion(s.paraMensaje)}>Cotizar</BotonWhatsApp>
                  )}
                  <Link href={`/servicios/${s.slug}`} className="btn btn-borde">
                    Ver detalle
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="seccion bg-agua">
        <div className="contenedor">
          <TituloSeccion
            etiqueta="Garantías y respaldo"
            titulo="Trabajamos con seguros y con garantía"
            texto="El mismo respaldo en todos nuestros servicios."
          />
          <div className="mt-10">
            <Garantias />
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor">
          <TituloSeccion morado etiqueta="Cómo trabajamos" titulo="Contrata en cuatro pasos" />
          <div className="mt-10">
            <Pasos />
          </div>
        </div>
      </section>

      <BandaContacto />
    </>
  );
}
