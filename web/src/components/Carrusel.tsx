"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { NombreImagen } from "@/content/imagenes";
import { mensajeCotizacion, mensajeVisitaTecnica } from "@/lib/site";
import { BotonWhatsApp } from "./BotonWhatsApp";
import { Foto } from "./Foto";

type Diapositiva = {
  imagen: NombreImagen;
  alt: string;
  titulo: string;
  texto: string;
  botonTexto: string;
  botonMensaje: string;
  enlace: { href: string; texto: string };
};

const diapositivas: Diapositiva[] = [
  {
    imagen: "equipo",
    alt: "Equipo de ReciClean reunido, con uniformes morados y turquesa",
    titulo: "Limpieza profesional para instituciones y empresas",
    texto: "En La Paz y El Alto, con personal asegurado y compromiso ambiental.",
    botonTexto: "Cotiza por WhatsApp",
    botonMensaje: mensajeCotizacion(),
    enlace: { href: "/servicios", texto: "Ver servicios" },
  },
  {
    imagen: "oficinas",
    alt: "Oficina amplia con estaciones de trabajo ordenadas",
    titulo: "Limpieza institucional y empresarial",
    texto: "Un proveedor serio y flexible, con contrato anual y supervisión constante.",
    botonTexto: "Cotiza por WhatsApp",
    botonMensaje: mensajeVisitaTecnica,
    enlace: { href: "/servicios/limpieza-institucional", texto: "Ver detalle" },
  },
  {
    imagen: "piso",
    alt: "Persona de limpieza pasando una mopa sobre un piso reluciente",
    titulo: "Limpiamos tus espacios sin ensuciar el planeta",
    texto: "El reciclaje está en nuestro nombre y en nuestra forma de trabajar.",
    botonTexto: "Cotiza por WhatsApp",
    botonMensaje: mensajeCotizacion(),
    enlace: { href: "/sostenibilidad", texto: "Conoce nuestro enfoque" },
  },
];

const INTERVALO = 6500;

/** Carrusel principal bajo el encabezado: foto a todo el ancho con velo de color plano. */
export function Carrusel() {
  const [activa, setActiva] = useState(0);
  const [pausado, setPausado] = useState(false);
  const total = diapositivas.length;

  const ir = useCallback((i: number) => setActiva((i + total) % total), [total]);

  useEffect(() => {
    if (pausado) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => ir(activa + 1), INTERVALO);
    return () => window.clearTimeout(id);
  }, [activa, pausado, ir]);

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Destacados de ReciClean"
      className="relative overflow-hidden bg-[#2a1630]"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocusCapture={() => setPausado(true)}
      onBlurCapture={() => setPausado(false)}
    >
      <div className="relative min-h-[520px] md:min-h-[560px]">
        {diapositivas.map((d, i) => {
          const visible = i === activa;
          const Titulo = i === 0 ? "h1" : "h2";
          return (
            <div
              key={d.titulo}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${i + 1} de ${total}`}
              aria-hidden={!visible}
              inert={!visible}
              className={`absolute inset-0 transition-opacity duration-700 ${
                visible ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <Foto
                nombre={d.imagen}
                alt={d.alt}
                className="absolute inset-0 h-full w-full object-cover"
                sizes="100vw"
                principal={i === 0}
              />
              {/* Velo plano (sin degradado) para que el texto se lea sobre la foto */}
              <div className="absolute inset-0 bg-[#34133c]/65" />
              <div className="contenedor relative flex min-h-[520px] items-center pb-16 pt-10 md:min-h-[560px]">
                <div className="max-w-3xl text-white">
                  <Titulo className="text-[2.1rem] font-small leading-tight text-white md:text-[3.25rem]">
                    {d.titulo}
                  </Titulo>
                  <p className="mt-5 max-w-xl text-lg font-small text-white/80">{d.texto}</p>
                  <div className="mt-9 flex flex-wrap gap-3.5">
                    <BotonWhatsApp mensaje={d.botonMensaje}>
                      {d.botonTexto}
                    </BotonWhatsApp>
                    <Link href={d.enlace.href} className="btn btn-borde-claro">
                      {d.enlace.texto}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicadores */}
      <div className="absolute inset-x-0 bottom-5">
        <div className="contenedor flex gap-2.5" role="tablist" aria-label="Elegir diapositiva">
          {diapositivas.map((d, i) => (
            <button
              key={d.titulo}
              type="button"
              role="tab"
              aria-selected={i === activa}
              aria-label={`Diapositiva ${i + 1}: ${d.titulo}`}
              onClick={() => ir(i)}
              className="flex h-8 items-center"
            >
              <span
                className={`block h-[3px] w-9 rounded-full transition-colors ${
                  i === activa ? "bg-white" : "bg-white/40 hover:bg-white/70"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
