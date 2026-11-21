import Link from "next/link";

export default function NoEncontrada() {
  return (
    <section className="seccion">
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
  );
}
