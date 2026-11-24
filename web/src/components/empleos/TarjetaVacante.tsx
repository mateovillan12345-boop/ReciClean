import Link from "next/link";
import { ArrowRight, CalendarDays, ImageIcon, MapPin } from "lucide-react";
import { esNueva, fechaCorta, fechaISO } from "@/lib/empleos/texto";
import type { Vacante } from "@/lib/empleos/tipos";

/** Etiqueta pequeña redondeada (área, jornada, "Nueva"). */
export function Etiqueta({ children, destacada }: { children: React.ReactNode; destacada?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium ${
        destacada ? "bg-turquesa-oscuro text-white" : "bg-agua text-texto"
      }`}
    >
      {children}
    </span>
  );
}

/**
 * Tarjeta grande de una vacante. Toda la tarjeta es un enlace a su página.
 * `ahora` llega solo en el navegador (null al prerenderizar), así "Nueva" nunca queda congelada en la caché.
 */
export function TarjetaVacante({ vacante: v, ahora }: { vacante: Vacante; ahora: number | null }) {
  return (
    <Link
      href={`/empleos/${v.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-linea bg-white transition duration-200 hover:-translate-y-1 hover:border-morado/30 hover:shadow-lg focus-visible:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      {/* ESPACIO PARA FOTO: cuando haya fotos, reemplaza este div por <Foto> (ver components/Foto.tsx). */}
      <div aria-hidden="true" className="flex aspect-[16/9] items-center justify-center bg-agua text-turquesa-oscuro/40">
        <ImageIcon className="h-10 w-10" strokeWidth={1.25} />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl group-hover:text-morado">{v.titulo}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-base text-texto-suave">
          <CalendarDays aria-hidden="true" className="h-4 w-4" />
          <time dateTime={fechaISO(v.creada_en)}>{fechaCorta(v.creada_en)}</time>
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-base text-texto-suave">
          <MapPin aria-hidden="true" className="h-4 w-4" />
          {v.zona}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Etiqueta>{v.area}</Etiqueta>
          <Etiqueta>{v.jornada}</Etiqueta>
          {ahora !== null && esNueva(v.creada_en, ahora) && <Etiqueta destacada>Nueva</Etiqueta>}
        </div>

        <p className="mt-4 flex-1 text-base text-texto-suave">{v.resumen}</p>

        <span className="mt-6 inline-flex items-center gap-1.5 border-t border-linea pt-4 font-medium text-morado">
          Ver vacante
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </span>
      </div>
    </Link>
  );
}
