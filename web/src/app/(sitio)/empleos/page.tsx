import type { Metadata } from "next";
import { BadgeCheck, FileText, PhoneCall, Search } from "lucide-react";
import { BotonPostular } from "@/components/empleos/BotonPostular";
import { ExploradorVacantes } from "@/components/empleos/ExploradorVacantes";
import { BandaContacto, Garantias, Pasos, TituloSeccion } from "@/components/Secciones";
import { beneficiosTrabajo, pasosPostulacion } from "@/content/empresa";
import { vacantesActivas } from "@/lib/empleos/consultas";

export const metadata: Metadata = {
  title: "Empleos: trabaja con nosotros",
  description:
    "Vacantes de limpieza, reciclaje, logística y supervisión en La Paz y El Alto. Personal asegurado, capacitación y pago puntual. Postula en 2 minutos.",
  alternates: { canonical: "/empleos" },
};

const iconosPostulacion = [Search, FileText, PhoneCall, BadgeCheck];

export default async function Empleos() {
  const vacantes = await vacantesActivas();

  return (
    <>
      <ExploradorVacantes vacantes={vacantes}>
        <p className="text-sm font-medium uppercase tracking-wider text-morado">
          Trabaja con nosotros
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl">
          Encuentra tu lugar en <strong className="text">ReciClean</strong>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-texto-suave">
        </p>
      </ExploradorVacantes>

      <section className="seccion bg-agua">
        <div className="contenedor">
          <TituloSeccion
            titulo={
              <>
                ¿Por qué trabajar en <strong>ReciClean</strong>?
              </>
            }
          />
          <div className="mt-10">
            <Garantias items={beneficiosTrabajo} />
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor">
          <TituloSeccion centrado morado titulo="Postula en cuatro pasos" />
          <div className="mt-14">
            <Pasos lista={pasosPostulacion} iconos={iconosPostulacion} />
          </div>
        </div>
      </section>

      <BandaContacto
        titulo="¿No encuentras tu puesto?"
        texto="Envíanos tu CV igual. Lo guardamos y te contactamos cuando se abra una vacante que encaje contigo."
        acciones={<BotonPostular />}
      />
    </>
  );
}
