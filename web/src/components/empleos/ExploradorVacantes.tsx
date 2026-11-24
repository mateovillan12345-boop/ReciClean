"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { normalizar } from "@/lib/empleos/texto";
import { zonasVacante, type Vacante } from "@/lib/empleos/tipos";
import { useAhora } from "@/lib/empleos/useAhora";
import { BotonPostular } from "./BotonPostular";
import { TarjetaVacante } from "./TarjetaVacante";

const ZONAS = ["Todas", ...zonasVacante] as const;
type FiltroZona = (typeof ZONAS)[number];

function textoBuscable(v: Vacante): string {
  return normalizar([v.titulo, v.area, v.zona, v.resumen, v.descripcion].join(" "));
}

/**
 * Hero con buscador + contador + cuadrícula de vacantes.
 * Van juntos porque comparten el estado de la búsqueda. El texto del hero llega como `children`
 * (se renderiza en el servidor).
 */
export function ExploradorVacantes({
  vacantes,
  children,
}: {
  vacantes: Vacante[];
  children: React.ReactNode;
}) {
  const [busqueda, setBusqueda] = useState("");
  const [zona, setZona] = useState<FiltroZona>("Todas");
  const ahora = useAhora();
  const resultadosRef = useRef<HTMLHeadingElement>(null);
  const idBuscador = useId();

  const indice = useMemo(() => vacantes.map((v) => ({ v, texto: textoBuscable(v) })), [vacantes]);

  const visibles = useMemo(() => {
    const palabras = normalizar(busqueda).split(/\s+/).filter(Boolean);
    return indice
      .filter(({ v }) => zona === "Todas" || v.zona === zona)
      .filter(({ texto }) => palabras.every((p) => texto.includes(p)))
      .map(({ v }) => v);
  }, [indice, busqueda, zona]);

  const contador =
    visibles.length === 1 ? "1 vacante disponible" : `${visibles.length} vacantes disponibles`;

  return (
    <>
      {/* Hero: pt grande porque el header es absoluto y va encima */}
      <section className="pb-16 pt-32 md:pb-20 md:pt-40">
        <div className="contenedor entrada-rapida text-center">
          {children}

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              resultadosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              resultadosRef.current?.focus({ preventScroll: true });
            }}
            className="mx-auto mt-10 flex max-w-2xl items-center gap-2 rounded-full border border-linea bg-white p-1.5 pl-5 shadow-sm focus-within:border-turquesa focus-within:ring-[3px] focus-within:ring-turquesa/20"
          >
            <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-texto-suave" />
            <label htmlFor={idBuscador} className="sr-only">
              Buscar vacantes por puesto, área o zona
            </label>
            <input
              id={idBuscador}
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Puesto, área o zona"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-texto-suave"
            />
            <button type="submit" className="btn btn-turquesa min-h-[2.75rem] rounded-full px-6">
              Buscar
            </button>
          </form>

          <div className="mt-5 flex flex-wrap justify-center gap-2" role="group" aria-label="Filtrar por zona">
            {ZONAS.map((z) => (
              <button
                key={z}
                type="button"
                aria-pressed={zona === z}
                onClick={() => setZona(z)}
                className={`min-h-[2.5rem] rounded-full border px-4 text-base transition-colors ${
                  zona === z
                    ? "border-[#067d98] bg-[#067d98] text-white"
                    : "border-linea bg-white text-texto hover:border-turquesa hover:text-turquesa-oscuro"
                }`}
              >
                {z}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="titulo-resultados" className="pb-16 pt-4 md:pb-24">
        <div className="contenedor">
          <h2
            id="titulo-resultados"
            ref={resultadosRef}
            tabIndex={-1}
            aria-live="polite"
            className="scroll-mt-28 text-center text-xl font-medium outline-none md:text-2xl"
          >
            {contador}
          </h2>

          {visibles.length > 0 ? (
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibles.map((v) => (
                <li key={v.id}>
                  <TarjetaVacante vacante={v} ahora={ahora} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mx-auto mt-10 max-w-lg rounded-lg bg-agua px-6 py-10 text-center">
              <p className="text-lg font-medium">
                {vacantes.length === 0
                  ? "Por ahora no tenemos vacantes abiertas."
                  : "No encontramos vacantes con esa búsqueda."}
              </p>
              <p className="mt-2 text-base text-texto-suave">
                Envíanos tu CV y te contactamos cuando se abra un puesto para ti.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <BotonPostular />
                {vacantes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setBusqueda("");
                      setZona("Todas");
                    }}
                    className="btn btn-borde"
                  >
                    Ver todas
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
