import Link from "next/link";
import { Encabezado } from "@/components/Encabezado";
import { PiePagina } from "@/components/PiePagina";

/**
 * 404 general. Vive en la raíz (fuera de (sitio)), así que no hereda el header ni el footer:
 * los pone él mismo para que la página no quede "desnuda".
 */
export default function NoEncontrada() {
  return (
    <>
      <Encabezado />
      <main id="contenido" className="flex-1">
        <section className="seccion pt-36 md:pt-44">
          <div className="contenedor max-w-2xl">
            <h1>No encontramos esta página</h1>
            <p className="mt-4 text-texto-suave">
              Puede que el enlace haya cambiado. Vuelve al inicio o revisa nuestros servicios.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className="btn btn-principal">
                Ir al inicio
              </Link>
              <Link href="/servicios" className="btn btn-borde">
                Ver servicios
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PiePagina />
    </>
  );
}
