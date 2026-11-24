import Link from "next/link";
import { BotonPostular } from "@/components/empleos/BotonPostular";

/** 404 amable cuando la vacante no existe, está pausada o ya se cubrió. */
export default function VacanteNoEncontrada() {
  return (
    <section className="seccion pt-36 md:pt-44">
      <div className="contenedor max-w-2xl">
        <h1>Esta vacante ya no está disponible</h1>
        <p className="mt-4 text-texto-suave">
          Puede que ya se haya cubierto o que el enlace haya cambiado. Mira las vacantes abiertas o
          envíanos tu CV para futuras oportunidades.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/empleos" className="btn btn-turquesa">
            Ver vacantes abiertas
          </Link>
          <BotonPostular variante="borde" />
        </div>
      </div>
    </section>
  );
}
