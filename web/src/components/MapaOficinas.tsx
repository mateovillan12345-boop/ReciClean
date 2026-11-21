/** Sección "Nuestras oficinas": título, dirección y mapa de Google a todo el ancho. */
export function MapaOficinas() {
  return (
    <section aria-labelledby="titulo-oficinas" className="py-16 md:py-24">
      <div className="contenedor">
        <h2 id="titulo-oficinas">
          Nuestras oficinas <strong>La Paz</strong>
        </h2>
        {/* Texto provisional: reemplazar por la dirección exacta y el horario. */}
        <p className="mt-3 text-texto-suave">
          Av. Busch, La Paz, Bolivia. Visítanos de lunes a viernes, de 8:30 a 18:30.
        </p>

        {/* Dentro del contenedor: mismo ancho y alineación que el título */}
        <iframe
          title="Ubicación de las oficinas de ReciClean en La Paz"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3825.6620343584245!2d-68.12151121099225!3d-16.492642067068733!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915f206af6a752a5%3A0x5475cf50c0ab1c65!2sGV5H%2B2GF%2C%20Av.%20Busch%2C%20La%20Paz%2C%20Bolivia!5e0!3m2!1sen!2sca!4v1795289831087!5m2!1sen!2sca"
          className="mt-8 block h-[360px] w-full rounded border-0 md:h-[460px]"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </section>
  );
}
