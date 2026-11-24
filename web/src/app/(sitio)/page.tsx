import Link from "next/link";
import { Carrusel } from "@/components/Carrusel";
import { FormularioContacto } from "@/components/Formularios";
import { Foto } from "@/components/Foto";
import { MapaOficinas } from "@/components/MapaOficinas";
import { Pasos, SeccionPreguntas, TarjetaServicio, TituloSeccion } from "@/components/Secciones";
import { beneficios, clientes, historia, sostenibilidad } from "@/content/empresa";
import { servicios } from "@/content/servicios";

export default function Inicio() {
  return (
    <>
      {/* Animaciones al hacer scroll: las activa AnimacionesScroll (en el layout). Aquí las marcas son
          manuales (data-aparecer / data-aparecer-grupo) para controlar el orden exacto. */}
      {/* Carrusel principal, como en la referencia de Lava Tap */}
      <Carrusel />

      {/* Servicios: fotos grandes con el nombre adentro */}
      <section className="seccion">
        <div className="contenedor" data-aparecer-grupo=":scope > :first-child, :scope > .grid > *">
          <TituloSeccion
            titulo={
              <>
                Conoce nuestros <strong>servicios</strong>
              </>
            }
            texto="Soluciones integrales de limpieza para tu hogar y tu empresa en toda Bolivia. Todos nuestros servicios cuentan el mismo respaldo de garantía de satisfacción."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {servicios.map((s) => (
              <TarjetaServicio key={s.slug} servicio={s} alta />
            ))}
          </div>
        </div>
      </section>

      {/* Por qué ReciClean */}
      <section className="seccion bg-agua">
        <div
          className="contenedor grid items-start gap-12 lg:grid-cols-2 lg:gap-20"
          data-aparecer-grupo=":scope > div > :first-child, :scope li, :scope > img"
        >
          <div>
            <TituloSeccion
              titulo={
                <>
                  ¿Por qué elegir <strong>ReciClean</strong>?
                </>
              }
            />
            <ul className="mt-10 space-y-7">
              {beneficios.slice(0, 4).map((b) => (
                <li key={b.titulo} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-[0.6rem] h-2 w-2 shrink-0 rounded-full bg-turquesa"
                  />
                  <div>
                    <h3>{b.titulo}</h3>
                    <p className="mt-1 text-base text-texto-suave">{b.texto}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <Foto
            nombre="piso"
            alt="Persona de limpieza pasando una mopa sobre un piso reluciente"
            className="aspect-[4/5] w-full rounded object-cover max-lg:aspect-[3/2]"
          />
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section className="seccion">
        <div className="contenedor" data-aparecer-grupo=":scope > :first-child, :scope li">
          <TituloSeccion
            centrado
            morado
            titulo={
              <>
                Contrata en <strong>cuatro pasos</strong>
              </>
            }
          />
          <div className="mt-14">
            <Pasos />
          </div>
        </div>
      </section>

      {/* Limpieza sostenible */}
      <section className="seccion bg-agua">
        <div
          className="contenedor grid items-start gap-12 lg:grid-cols-2 lg:gap-20"
          data-aparecer-grupo=":scope > img, :scope > div > *"
        >
          <Foto
            nombre="superficies"
            alt="Manos con guantes limpiando una superficie con paño y atomizador"
            className="aspect-[3/2] w-full rounded object-cover"
          />
          <div>
            <TituloSeccion
              titulo={
                <>
                  Limpiamos tus espacios <strong>sin ensuciar el planeta</strong>
                </>
              }
            />
            <p className="mt-5 text-texto-suave">{sostenibilidad.texto}</p>
            <p className="mt-7">
              <Link href="/sostenibilidad" className="enlace">
                Conoce nuestro enfoque →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Clientes */}
      <section className="seccion">
        <div
          className="contenedor grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20"
          data-aparecer-grupo=":scope > div > *"
        >
          <div>
            <p className="font-titulos text-6xl font-light leading-none text-morado md:text-7xl">
              {clientes.cifra}
            </p>
            <h2 className="mt-4">
              clientes institucionales <strong>confían en ReciClean</strong>
            </h2>
            <p className="mt-4 text-texto-suave text-justify">{clientes.texto}</p>
            {clientes.nombres.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-base font-medium">
                {clientes.nombres.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="space-y-9 lg:pt-3">
            {clientes.compromisos.map((c) => (
              <div key={c.titulo} className="border-l-2 border-turquesa pl-6">
                <h3>{c.titulo}</h3>
                <p className="mt-2 text-texto-suave text-justify">{c.texto}</p>
                {"enlace" in c && c.enlace && (
                  <Link href={c.enlace.href} className="enlace mt-3 inline-flex items-center gap-1.5">
                    {c.enlace.texto} <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            ))}
            {clientes.testimonios.map((t) => (
              <figure key={t.nombre} className="border-l-2 border-turquesa pl-6">
                <blockquote className="text-lg font-light">“{t.cita}”</blockquote>
                <figcaption className="mt-3 text-base text-texto-suave">
                  <strong className="font-bold text-texto">{t.nombre}</strong> · {t.cargo}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Banda con foto del equipo */}
      <section aria-label="Trayectoria" className="relative bg-[#2a1630] text-center text-white">
        <Foto
          nombre="equipo-celebracion"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-morado/75" />
        <div className="contenedor relative py-24 md:py-32" data-aparecer-grupo=":scope > *">
          <p className="font-titulos text-5xl font-bold leading-none md:text-7xl">Desde 2018</p>
          <p className="mt-4 text-xl font-light md:text-2xl">cuidando espacios en La Paz y El Alto</p>
        </div>
      </section>

      {/* Nosotros */}
      <section className="seccion">
        <div
          className="contenedor grid items-start  gap-12 lg:grid-cols-[1fr_0.8fr] lg:gap-20"
          data-aparecer-grupo=":scope > div > *, :scope > img"
        >
          <div>
            <TituloSeccion
              titulo={
                <>
                  Una empresa hecha por gente que <strong>conoce el oficio</strong>
                </>
              }
            />
            <blockquote className="mt-7">
              <p className="text-xl font-light text-justify leading-relaxed">“{historia.mensajeFundadora}”</p>
              <footer className="mt-4 text-base text-texto-suave">
                <strong className="font-bold text-texto">Vivian Carlo</strong> · Fundadora
              </footer>
            </blockquote>
            <Link href="/nosotros" className="btn btn-borde mt-8">
              Sobre nosotros
            </Link>
          </div>
          <Foto
            nombre="fundadora"
            alt="Vivian Carlo, fundadora de ReciClean"
            className="aspect-[4/5] w-full max-w-md rounded object-cover lg:justify-self-end"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        </div>
      </section>

      {/* Preguntas frecuentes: todas */}
      <div data-aparecer>
        <SeccionPreguntas />
      </div>

      {/* Contacto */}
      <section id="contacto" className="seccion bg-agua">
        <div className="contenedor" data-aparecer-grupo=":scope > *">
          <TituloSeccion
            centrado
            titulo={
              <>
                ¿Listo para <strong>cotizar</strong>?
              </>
            }
            texto="Llena el formulario y se abrirá WhatsApp con tu mensaje listo para enviar. Respondemos en menos de 24 horas."
          />
          <div className="mx-auto mt-12 max-w-2xl">
            <FormularioContacto />
          </div>
        </div>
      </section>

      <div data-aparecer>
        <MapaOficinas />
      </div>
    </>
  );
}
