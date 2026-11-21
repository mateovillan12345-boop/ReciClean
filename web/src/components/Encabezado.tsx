"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { menu, site } from "@/lib/site";
import { BotonWhatsApp } from "./BotonWhatsApp";

function activo(ruta: string, href: string) {
  return href === "/" ? ruta === "/" : ruta.startsWith(href);
}

export function Encabezado() {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  // Solo Inicio tiene una foto oscura detrás del header; el resto de páginas tiene fondo claro.
  const sobreFoto = ruta === "/";

  return (
    <header className="absolute  w-full top-0 z-40  bg-white/0">
      <div className="contenedor flex h-[76px] items-center gap-10">
        <Link
          href="/"
          aria-label="ReciClean, inicio"
          className="flex shrink-0 items-center gap-2 font-logo text-[1.75rem] font-medium leading-none tracking-tight"
        >
          {/* En Inicio el header va sobre la foto oscura del carrusel: logo en blanco.
              En las demás páginas el fondo es claro: morado y turquesa oscuros. */}
          <span>
            <span className={sobreFoto ? "text-white" : "text-morado-oscuro"}>Reci</span>
            <span className={sobreFoto ? "text-white" : "text-turquesa-oscuro"}>Clean</span>
          </span>
          <span
            aria-hidden="true"
            className={`icono-reciclaje h-7 w-7 ${sobreFoto ? "text-white" : "text-turquesa-oscuro"}`}
          />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-base">
            {menu.map((item) => {
              const esActivo = activo(ruta, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={esActivo ? "page" : undefined}
                    className={`py-2 transition-colors ${
                      sobreFoto
                        ? "text-white hover:text-white/75"
                        : "text-morado hover:text-morado-oscuro"
                    } ${esActivo ? "font-semibold" : ""}`}
                  >
                    {item.texto}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-5">
          <span className="hidden text-base xl:inline">{}</span>
          <BotonWhatsApp variante="turquesa" className="hidden min-h-[42px] px-5 sm:inline-flex border-white/60">Contactanos</BotonWhatsApp>
          <button
            type="button"
            className={`inline-flex h-12 w-12 items-center justify-center rounded lg:hidden ${
              sobreFoto ? "text-white hover:bg-white/10" : "text-morado hover:bg-agua"
            }`}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setAbierto((v) => !v)}
          >
            {abierto ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {abierto && (
        <nav id="menu-movil" aria-label="Principal" className="border-t border-linea bg-white lg:hidden">
          <ul className="contenedor flex flex-col py-3">
            {menu.map((item) => {
              const esActivo = activo(ruta, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={esActivo ? "page" : undefined}
                    onClick={() => setAbierto(false)}
                    className={`block rounded px-3 py-3 ${
                      esActivo ? "bg-agua text-morado" : "text-texto"
                    }`}
                  >
                    {item.texto}
                  </Link>
                </li>
              );
            })}
            <li className="px-3 pb-2 pt-3 sm:hidden">
              <BotonWhatsApp variante="turquesa" className="w-full">Cotiza por WhatsApp</BotonWhatsApp>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
