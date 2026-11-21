import type { Metadata } from "next";
import Link from "next/link";
import { servicioPorSlug, servicios } from "@/content/servicios";
import { mensajeCotizacion, mensajeVisitaTecnica } from "@/lib/site";
import { BotonWhatsApp } from "./BotonWhatsApp";
import { Foto } from "./Foto";
import {
  BandaContacto,
  CabeceraPagina,
  Garantias,
  Pasos,
  SeccionPreguntas,
  TarjetaServicio,
  TituloSeccion,
} from "./Secciones";

export function metadataServicio(slug: string): Metadata {
  const s = servicioPorSlug(slug);
  return {
    title: `${s.nombre} en La Paz y El Alto`,
    description: `${s.resumen} Personal asegurado y garantía de satisfacción. Cotiza por WhatsApp.`,
    alternates: { canonical: `/servicios/${s.slug}` },
  };
}

/** Plantilla común de las páginas de servicio (una ruta por servicio, para SEO). */
export function PaginaServicio({ slug }: { slug: string }) {
  const s = servicioPorSlug(slug);
  const mensaje = mensajeCotizacion(s.paraMensaje);
  const otros = servicios.filter((o) => o.slug !== s.slug);

  return (
    <>
      <CabeceraPagina
        etiqueta={`Servicio ${s.numero}`}
        titulo={s.nombre}
        texto={`${s.resumen} Disponible en La Paz y El Alto.`}
      >
        {s.destacado ? (
          <BotonWhatsApp mensaje={mensajeVisitaTecnica}>
            Solicita una visita técnica sin costo
          </BotonWhatsApp>
        ) : (
          <BotonWhatsApp mensaje={mensaje} />
        )}
        <Link href="/contacto" className="btn btn-borde">
          Ir al formulario
        </Link>
      </CabeceraPagina>

      {/* pb-0: la franja "Ideal para" cierra la sección y toca la sección celeste de abajo */}
      <section className="seccion pb-0 md:pb-0">
        <div className="contenedor grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <TituloSeccion etiqueta="Qué incluye" titulo={`¿Qué incluye la ${s.nombre.toLowerCase()}?`} />
            <p className="mt-5 text-texto-suave">{s.descripcion}</p>
            <ul className="mt-7 divide-y divide-linea border-y border-linea">
              {s.incluye.map((item) => (
                <li key={item.titulo} className="flex items-start gap-3 py-4">
                  <span aria-hidden="true" className="icono-check mt-1 h-5 w-5 text-turquesa-oscuro" />
                  <div>
                    <p className="font-medium">{item.titulo}</p>
                    {item.detalle && (
                      <p className="mt-0.5 text-base text-texto-suave">{item.detalle}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* La foto se estira hasta la altura de la columna de texto */}
          <Foto
            nombre={s.imagen}
            alt={s.altImagen}
            className="aspect-[4/3] w-full rounded object-cover lg:aspect-auto lg:h-full"
            principal
          />
        </div>

        {/* "Ideal para": franja morado suave de borde a borde, con las viñetas en 2 líneas */}
        <div className="mt-16 bg-lila py-10 md:mt-20 md:py-14">
          <div className="contenedor">
            <h3 className="text-morado">Ideal para</h3>
            <ul className="mt-5 grid gap-x-10 gap-y-3 text-base sm:grid-cols-2">
              {s.idealPara.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-[0.6rem] h-2 w-2 shrink-0 rounded-full bg-morado" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="seccion bg-agua">
        <div className="contenedor">
          <TituloSeccion etiqueta="Áreas" titulo="Espacios que dejamos impecables" />
          <ul
            className={`mt-10 grid gap-6 sm:grid-cols-2 ${
              s.galeria.length === 3 ? "lg:grid-cols-3" : ""
            }`}
          >
            {s.galeria.map((g) => (
              <li key={g.titulo}>
                <Foto
                  nombre={g.imagen}
                  alt={g.alt}
                  className="aspect-[3/2] w-full rounded object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <p className="mt-4 font-bold">{g.titulo}</p>
              </li>
            ))}
          </ul>
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

      <section className="seccion bg-agua">
        <div className="contenedor">
          <TituloSeccion
            etiqueta="Garantías y respaldo"
            titulo="Trabajamos con seguros y con garantía"
          />
          <div className="mt-10">
            <Garantias />
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor">
          <TituloSeccion etiqueta="Más servicios" titulo="Conoce nuestros otros servicios" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otros.map((o) => (
              <TarjetaServicio key={o.slug} servicio={o} />
            ))}
          </div>
        </div>
      </section>

      <SeccionPreguntas claves={s.preguntas} fondo="bg-agua" />

      <BandaContacto
        titulo={`Cotiza tu ${s.nombre.toLowerCase()}`}
        mensaje={mensaje}
      />
    </>
  );
}
