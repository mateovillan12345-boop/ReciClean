import Link from "next/link";
import { servicios } from "@/content/servicios";
import { enlaceWhatsApp, mensajeCotizacion, menu, site } from "@/lib/site";

export function PiePagina() {
  const enlace = "text-white/85 hover:text-white hover:underline hover:underline-offset-4";
  return (
    <footer className="bg-morado text-base text-white/85">
      <div className="contenedor grid gap-10 pb-8 pt-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.2fr]">
        <div>
          <p className="font-titulos text-lg font-bold text-white">ReciClean</p>
          <p className="mt-3 max-w-xs">
            Limpieza institucional, empresarial y a domicilio en La Paz y El Alto, Bolivia. Desde 2020.
          </p>
        </div>

        <nav aria-label="Enlaces">
          <p className="font-bold text-white">Enlaces</p>
          <ul className="mt-3 space-y-2">
            {menu.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={enlace}>
                  {item.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Servicios">
          <p className="font-bold text-white">Servicios</p>
          <ul className="mt-3 space-y-2">
            {servicios.map((s) => (
              <li key={s.slug}>
                <Link href={`/servicios/${s.slug}`} className={enlace}>
                  {s.nombre}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-bold text-white">Contacto</p>
          <ul className="mt-3 space-y-2">
            <li>
              <a
                href={enlaceWhatsApp(mensajeCotizacion())}
                target="_blank"
                rel="noopener noreferrer"
                className={enlace}
              >
                WhatsApp {site.telefono}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.correo}`} className={`${enlace} break-all`}>
                {site.correo}
              </a>
            </li>
            <li>
              <a href={site.facebook} target="_blank" rel="noopener noreferrer" className={enlace}>
                Facebook
              </a>
            </li>
            <li>{site.respuesta}</li>
          </ul>
        </div>
      </div>

      <p className="contenedor pb-8 text-sm text-white/70">© ReciClean · La Paz y El Alto, Bolivia</p>
    </footer>
  );
}
