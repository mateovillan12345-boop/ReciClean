import type { Metadata } from "next";
import { BotonWhatsApp } from "@/components/BotonWhatsApp";
import { Foto } from "@/components/Foto";
import { BandaContacto, CabeceraPagina, TituloSeccion } from "@/components/Secciones";
import { sostenibilidad } from "@/content/empresa";

export const metadata: Metadata = {
  title: "Limpieza sostenible",
  description:
    "En ReciClean el reciclaje está en nuestro nombre: separación de residuos, productos de bajo impacto y uso eficiente de agua en La Paz y El Alto.",
  alternates: { canonical: "/sostenibilidad" },
};

export default function Sostenibilidad() {
  return (
    <>
      <CabeceraPagina
        etiqueta="Limpieza sostenible"
        titulo={sostenibilidad.titulo}
        texto="El reciclaje está en nuestro nombre y en nuestra forma de trabajar."
      >
        <BotonWhatsApp />
      </CabeceraPagina>

      <section className="seccion">
        <div className="contenedor grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <TituloSeccion etiqueta="Nuestro enfoque" titulo="Limpieza con conciencia ambiental" />
            <p className="mt-5 text-texto-suave">{sostenibilidad.texto}</p>
            <p className="mt-5 text-texto-suave">
              Para las empresas e instituciones con políticas de sostenibilidad o
              responsabilidad social, trabajar con un proveedor responsable también
              cuenta.
            </p>
          </div>
          <Foto
            nombre="superficies"
            alt="Manos con guantes limpiando una superficie con paño y atomizador"
            className="aspect-[4/3] w-full rounded object-cover"
            principal
          />
        </div>
      </section>

      <section className="seccion bg-agua">
        <div className="contenedor">
          <TituloSeccion
            etiqueta="Prácticas"
            titulo="Cómo cuidamos el planeta mientras limpiamos"
          />
          <ul className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {sostenibilidad.practicas.map((p) => (
              <li key={p.titulo}>
                <h3>{p.titulo}</h3>
                <p className="mt-2 text-base text-texto-suave">{p.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <BandaContacto
        titulo="Limpieza de excelencia, con compromiso ambiental"
        texto="Cuéntanos qué necesita tu institución o tu hogar. Respondemos en menos de 24 horas."
      />
    </>
  );
}
