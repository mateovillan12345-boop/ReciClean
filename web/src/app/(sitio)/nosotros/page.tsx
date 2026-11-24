import type { Metadata } from "next";
import { Foto } from "@/components/Foto";
import { BandaContacto, CabeceraPagina, TituloSeccion } from "@/components/Secciones";
import { historia, mision, valores, vision } from "@/content/empresa";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "ReciClean fue fundada en 2020 por Vivian Carlo, con más de 10 años de experiencia en limpieza. Conoce nuestra historia, misión, visión y valores.",
  alternates: { canonical: "/nosotros" },
};

export default function Nosotros() {
  return (
    <>
      <CabeceraPagina
        etiqueta="Nosotros"
        titulo="Limpieza de excelencia, hecha por un equipo que trabaja con dignidad"
        texto="Cuidamos instituciones, empresas y hogares en La Paz y El Alto."
      />

      {/* Historia */}
      <section className="seccion">
        <div className="contenedor grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <TituloSeccion etiqueta="Nuestra historia" titulo="Cómo nació ReciClean" />
            {historia.parrafos.map((p) => (
              <p key={p.slice(0, 24)} className="mt-5 text-texto-suave">
                {p}
              </p>
            ))}
          </div>
          <figure>
            <Foto
              nombre="equipo"
              alt="Equipo de ReciClean reunido, con uniformes morados y turquesa"
              className="aspect-[4/3] w-full rounded object-cover"
              principal
            />
            <figcaption className="mt-3 text-sm text-texto-suave">
              Parte del equipo de ReciClean.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Mensaje de la fundadora */}
      <section className="seccion bg-agua">
        <div className="contenedor grid items-center gap-10 lg:grid-cols-[0.7fr_1fr] lg:gap-16">
          <Foto
            nombre="fundadora"
            alt="Vivian Carlo, fundadora de ReciClean"
            className="aspect-[4/5] w-full max-w-sm rounded object-cover"
            sizes="(min-width: 1024px) 35vw, 100vw"
          />
          <blockquote>
            <p className="text-xl font-light leading-relaxed md:text-2xl">
              “{historia.mensajeFundadora}”
            </p>
            <footer className="mt-6">
              <p className="font-bold">Vivian Carlo</p>
              <p className="text-base text-texto-suave">Fundadora de ReciClean</p>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Misión y visión */}
      <section className="seccion">
        <div className="contenedor">
          <TituloSeccion etiqueta="Hacia dónde vamos" titulo="Misión y visión" />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="rounded bg-agua p-7 md:p-9">
              <h3>Nuestra misión</h3>
              <p className="mt-3 text-texto-suave">{mision}</p>
            </article>
            <article className="rounded bg-agua p-7 md:p-9">
              <h3>Nuestra visión</h3>
              <p className="mt-3 text-texto-suave">{vision}</p>
            </article>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="seccion bg-agua">
        <div className="contenedor">
          <TituloSeccion etiqueta="Valores" titulo="Lo que nos guía todos los días" />
          <ul className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {valores.map((v) => (
              <li key={v.titulo}>
                <h3>{v.titulo}</h3>
                <p className="mt-2 text-base text-texto-suave">{v.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Equipo */}
      <section className="seccion">
        <div className="contenedor">
          <TituloSeccion
            etiqueta="Nuestro equipo"
            titulo="Las personas detrás de cada espacio limpio"
            texto="El equipo es parte de la marca: formado, asegurado y comprometido con cada lugar que cuida."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-[1.6fr_1fr]">
            <Foto
              nombre="equipo-celebracion"
              alt="Integrantes del equipo de ReciClean durante una celebración interna"
              className="h-full max-h-[420px] w-full rounded object-cover"
            />
            <Foto
              nombre="equipo-reconocimiento"
              alt="Integrantes de ReciClean recibiendo un certificado de reconocimiento"
              className="h-full max-h-[420px] w-full rounded object-cover"
              sizes="(min-width: 768px) 40vw, 100vw"
            />
          </div>
        </div>
      </section>

      <BandaContacto
        titulo="Trabajemos juntos"
        texto="Cuéntanos qué necesita tu institución, tu empresa o tu hogar. Respondemos en menos de 24 horas."
      />
    </>
  );
}
