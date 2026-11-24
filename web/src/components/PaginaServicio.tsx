import type { Metadata } from "next";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  Clock,
  GraduationCap,
  HardHat,
  HeartHandshake,
  House,
  Landmark,
  Sparkles,
  Store,
  Timer,
  Truck,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  servicioPorSlug,
  servicios,
  type IconoIdealPara,
  type Servicio,
} from "@/content/servicios";
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

      <section className="seccion">
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
      </section>

      <SeccionResultados servicio={s} />

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

const iconosIdealPara: Record<IconoIdealPara, LucideIcon> = {
  edificio: Landmark,
  birrete: GraduationCap,
  maletin: Briefcase,
  tienda: Store,
  casco: HardHat,
  edificios: Building2,
  casa: House,
  familia: Users,
  reloj: Clock,
  cuidado: HeartHandshake,
  mudanza: Truck,
  brillo: Sparkles,
  rayo: Zap,
  cronometro: Timer,
};

/**
 * Diseño nuevo que une "Ideal para" y "Espacios que dejamos impecables":
 * titular centrado, galería de 3 fotos y una tarjeta blanca con los tipos de cliente.
 * El morado es el acento; el turquesa queda solo para los botones.
 */
function SeccionResultados({ servicio }: { servicio: Servicio }) {
  const items = servicio.idealParaIconos;
  return (
    <section aria-labelledby="titulo-resultados" className="bg-gris-claro py-16 md:py-[100px]">
      <div className="contenedor">
        <div className="text-text">
          <p className="text-[1.0625rem] font-semibold text-morado">Pruebas de nuestro trabajo</p>
          <h2
            id="titulo-resultados"
            className="mt-3 text-[2.25rem] leading-[1.15] md:text-[3.5rem]"
          >
            Resultados que se ven.
            <span className="block text-morado">Espacios que hablan por nosotros.</span>
          </h2>
        </div>

        {/* Galería: 1 columna en celular, 2 en tablet, 3 en escritorio */}
        {/* Con 2 fotos (post obra, flash) quedan 2 columnas, sin un hueco a la derecha */}
        <ul
          className={`mt-14 grid gap-6 sm:grid-cols-2 ${
            servicio.galeria.length === 3 ? "lg:grid-cols-3" : ""
          }`}
        >
          {servicio.galeria.map((g) => (
            <li key={g.titulo}>
              <Foto
                nombre={g.imagen}
                alt={g.alt}
                className="h-[300px] w-full rounded-[24px] object-cover"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              <p className="mt-[18px] flex items-start gap-2.5 text-[1.3125rem] font-semibold leading-snug">
                {/* El punto queda a la altura de la primera línea aunque el nombre ocupe dos */}
                <span aria-hidden="true" className="mt-[0.5em] h-2 w-2 shrink-0 rounded-full bg-morado" />
                {g.titulo}
              </p>
            </li>
          ))}
        </ul>

        {/* Tarjeta "Ideal para": en escritorio el título va a la izquierda; en tablet y celular, arriba */}
        <div className="mt-10 grid gap-8 rounded-[28px] bg-white p-6 md:px-11 md:py-10 lg:grid-cols-[200px_1fr]">
          <h3 className="text-[1.75rem] font-bold text-morado">Ideal para: </h3>
          <ul
            className={`grid gap-8 sm:grid-cols-2 ${
              items.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
            }`}
          >
            {items.map((item) => {
              const Icono = iconosIdealPara[item.icono];
              return (
                <li key={item.titulo}>
                  <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-lila text-morado">
                    <Icono aria-hidden="true" className="h-6 w-6" strokeWidth={1.6} />
                  </span>
                  {/* text-left: textos cortos en columna angosta, no se justifican */}
                  <p className="mt-4 text-left text-[1.0625rem] leading-[1.45]">
                    <span className="font-semibold text-texto">{item.titulo}</span>
                    {item.detalle && (
                      <span className="mt-1 block text-texto-suave">{item.detalle}</span>
                    )}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
