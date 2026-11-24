"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const enlaces = [
  { href: "/admin", texto: "Aplicantes" },
  { href: "/admin/vacantes", texto: "Vacantes" },
];

function activo(ruta: string, href: string) {
  return href === "/admin" ? ruta === "/admin" || ruta.startsWith("/admin/aplicantes") : ruta.startsWith(href);
}

/** Menú con el enlace actual marcado. Va dentro de <Suspense> (lee la URL). */
export function MenuPanel() {
  return <Enlaces ruta={usePathname()} />;
}

/** Mismo menú sin marcar el actual: se muestra mientras carga. */
export function MenuPanelCargando() {
  return <Enlaces ruta="" />;
}

function Enlaces({ ruta }: { ruta: string }) {
  return (
    <nav aria-label="Panel">
      <ul className="flex gap-1">
        {enlaces.map((e) => {
          const esActivo = activo(ruta, e.href);
          return (
            <li key={e.href}>
              <Link
                href={e.href}
                aria-current={esActivo ? "page" : undefined}
                className={`inline-flex min-h-[2.75rem] items-center rounded px-3 text-base ${
                  esActivo ? "bg-lila font-semibold text-morado" : "text-texto hover:bg-agua hover:text-morado"
                }`}
              >
                {e.texto}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
