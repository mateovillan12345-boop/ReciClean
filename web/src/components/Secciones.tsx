import Link from "next/link";
import {
  BadgeCheck,
  ChevronDown,
  ClipboardList,
  FileText,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { garantias, pasos, preguntas } from "@/content/empresa";
import type { Servicio } from "@/content/servicios";
import { BotonWhatsApp } from "./BotonWhatsApp";
import { Foto } from "./Foto";

/** Cabecera de las páginas internas. */
export function CabeceraPagina({
  titulo,
  texto,
  children,
}: {
  /** Ya no se muestra (diseño minimalista); se conserva para no tocar las páginas. */
  etiqueta?: string;
  titulo: string;
  texto?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-agua">
      <div className="contenedor py-14 md:py-20">
        <h1 className="max-w-3xl">{titulo}</h1>
        {texto && <p className="mt-5 max-w-2xl text-texto-suave">{texto}</p>}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}

export function TituloSeccion({
  titulo,
  texto,
  centrado,
  morado,
}: {
  /** Ya no se muestra (diseño minimalista); se conserva para no tocar las páginas. */
  etiqueta?: string;
  titulo: React.ReactNode;
  texto?: string;
  centrado?: boolean;
  /** Título en color morado en vez del gris oscuro. */
  morado?: boolean;
}) {
  return (
    <div className={centrado ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <h2 className={morado ? "text-morado" : undefined}>{titulo}</h2>
      {texto && <p className="mt-4 text-texto-suave">{texto}</p>}
    </div>
  );
}

export function ListaCheck({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-2.5 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span aria-hidden="true" className="icono-check mt-1 h-5 w-5 text-turquesa-oscuro" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Servicio como foto grande con el nombre adentro.
 * Al pasar el cursor (o al enfocar con teclado) el velo se vuelve morado y aparece el resumen.
 */
export function TarjetaServicio({ servicio, alta }: { servicio: Servicio; alta?: boolean }) {
  return (
    <Link
      href={`/servicios/${servicio.slug}`}
      className={`group relative block overflow-hidden rounded bg-[#2a1630] ${
        alta ? "aspect-[4/3] sm:aspect-[3/4]" : "aspect-[4/3]"
      }`}
    >
      <Foto
        nombre={servicio.imagen}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105"
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[#2a1630]/50 transition-colors duration-300 group-hover:bg-morado/90 group-focus-visible:bg-morado/90"
      />
      <span className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
        <span className="text-sm font-light tracking-widest text-white/80" aria-hidden="true">
          {servicio.numero}
        </span>
        <span className="mt-2 block font-titulos text-xl font-bold leading-snug">
          {servicio.nombre}
        </span>
        <span className="block max-h-0 overflow-hidden text-sm leading-relaxed text-white/90 opacity-0 transition-all duration-300 group-hover:mt-3 group-hover:max-h-48 group-hover:opacity-100 group-focus-visible:mt-3 group-focus-visible:max-h-48 group-focus-visible:opacity-100">
          {servicio.resumen}
          <span className="mt-3 block font-medium text-white">Ver servicio →</span>
        </span>
      </span>
    </Link>
  );
}

const iconosPasos: LucideIcon[] = [MessageCircle, ClipboardList, FileText, BadgeCheck];

/** Proceso en 4 pasos, unidos por una línea. */
export function Pasos() {
  return (
    <ol className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {pasos.map((paso, i) => {
        const IconoPaso = iconosPasos[i] ?? BadgeCheck;
        return (
          <li key={paso.titulo} className="relative text-center">
            {/* Línea que une este paso con el siguiente (solo cuando están en una fila) */}
            {i < pasos.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute left-[calc(50%+2.5rem)] top-[26px] hidden h-0.5 w-[calc(100%-3rem)] bg-morado/25 lg:block"
              />
            )}
            {/* Círculo, línea e ícono en morado a media intensidad; el texto queda normal */}
            <span className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-full border border-morado/30 bg-morado/10 text-xl font-medium text-morado">
              {i + 1}
            </span>
            <h3 className="mt-5">
              <IconoPaso
                aria-hidden="true"
                className="mr-2 inline-block h-5 w-5 align-[-4px] text-morado/70"
                strokeWidth={1.75}
              />
              {paso.titulo}
            </h3>
            <p className="mx-auto mt-2 max-w-[17rem] text-base text-texto-suave">{paso.texto}</p>
          </li>
        );
      })}
    </ol>
  );
}

export function Garantias() {
  return (
    <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
      {garantias.map((g) => (
        <li key={g.titulo}>
          <h3>{g.titulo}</h3>
          <p className="mt-2 text-base text-texto-suave">{g.texto}</p>
        </li>
      ))}
    </ul>
  );
}

/**
 * Preguntas frecuentes: acordeón nativo, sin JavaScript.
 * `claves` elige cuáles mostrar (ver `clave` en content/empresa.ts); sin `claves` salen todas.
 */
export function Preguntas({ claves }: { claves?: string[] }) {
  const lista = claves
    ? claves.flatMap((c) => preguntas.filter((p) => p.clave === c))
    : preguntas;
  return (
    <div className="divide-y divide-linea border-y border-linea">
      {lista.map((p) => (
        <details key={p.pregunta} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium text-texto hover:text-morado [&::-webkit-details-marker]:hidden">
            {p.pregunta}
            <ChevronDown
              aria-hidden="true"
              className="h-5 w-5 shrink-0 text-turquesa-oscuro transition-transform group-open:rotate-180"
            />
          </summary>
          <p className="pb-6 text-texto-suave">{p.respuesta}</p>
        </details>
      ))}
    </div>
  );
}

/** Sección completa de preguntas: título arriba y las preguntas debajo, a todo el ancho. */
export function SeccionPreguntas({
  claves,
  fondo = "",
}: {
  claves?: string[];
  /** Clase de fondo opcional, por ejemplo "bg-agua". */
  fondo?: string;
}) {
  return (
    <section aria-labelledby="titulo-preguntas" className={`seccion ${fondo}`}>
      <div className="contenedor">
        <div className="max-w-2xl">
          <h2 id="titulo-preguntas">
            Antes de <strong>escribirnos</strong>
          </h2>
          <p className="mt-4 text-texto-suave">Las dudas más comunes sobre nuestros servicios.</p>
        </div>
        <div className="mt-10">
          <Preguntas claves={claves} />
        </div>
      </div>
    </section>
  );
}

/** Banda final de llamada a la acción. */
export function BandaContacto({
  titulo = "¿Listo para cotizar tu servicio?",
  texto = "Cuéntanos qué necesitas y te enviamos una cotización sin compromiso. Respondemos en menos de 24 horas.",
  mensaje,
}: {
  titulo?: string;
  texto?: string;
  mensaje?: string;
}) {
  return (
    <section className="bg-morado text-white">
      <div className="contenedor flex flex-col items-start gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-20">
        <div className="max-w-2xl">
          <h2 className="text-white">{titulo}</h2>
          <p className="mt-3 text-white/90">{texto}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <BotonWhatsApp mensaje={mensaje} />
          <Link href="/contacto" className="btn btn-borde-claro">
            Ir al formulario
          </Link>
        </div>
      </div>
    </section>
  );
}
