"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Animación de "descubrir el contenido" al hacer scroll: cada elemento aparece UNA sola vez
 * (subiendo y apareciendo). Si vuelves a subir y bajar, ya no se repite.
 *
 * Está en app/(sitio)/layout.tsx, así que actúa en TODAS las páginas públicas:
 *
 *  - AUTOMÁTICO: cada <section> de la página, menos la primera (el hero, que tiene su propia
 *    entrada rápida con la clase .entrada-rapida), se reparte en bloques que aparecen en cascada.
 *    Una lista o cuadrícula se reparte en sus ítems (tarjetas, pasos, preguntas...).
 *
 *  - MANUAL (para controlar el orden exacto, como en la landing):
 *      data-aparecer                  → ese elemento aparece solo.
 *      data-aparecer="foto"           → variante para fotos (leve zoom).
 *      data-aparecer-grupo="<selector>" → los elementos que coinciden aparecen uno tras otro.
 *        Ej.: ":scope > *" = cada hijo directo; ":scope li" = cada ítem de lista.
 *    Una sección con marcas manuales no recibe las automáticas.
 *
 *  - SIN ANIMACIÓN: pon data-sin-animacion en una <section>.
 *
 * Sin JavaScript, o con "reducir movimiento" activado en el sistema, todo se ve normal.
 * Los estilos están en globals.css (busca "Animaciones al hacer scroll").
 */

const RETRASO_ENTRE_ITEMS = 90; // ms entre un elemento y el siguiente de un grupo
const RETRASO_MAXIMO = 540; // para que un grupo largo no tarde demasiado
const MARCAS = "[data-aparecer], [data-aparecer-grupo]";

/** Una lista o cuadrícula se anima ítem por ítem; un envoltorio con un solo hijo se atraviesa. */
function bloquesDe(el: Element, nivel = 0): Element[] {
  if (nivel < 3 && el.matches("ul, ol, .grid") && el.children.length > 1)
    return [...el.children];
  if (
    nivel < 3 &&
    el.children.length === 1 &&
    el.firstElementChild!.matches("ul, ol, .grid, div")
  ) {
    return bloquesDe(el.firstElementChild!, nivel + 1);
  }
  return [el];
}

/** Marca automáticamente las secciones del cuerpo de la página (todas menos el hero). */
function marcarSecciones(main: HTMLElement) {
  // Solo secciones de primer nivel y visibles: Next 16 deja la página anterior oculta en el DOM
  // (para que "Atrás" sea instantáneo) y esa no cuenta.
  const secciones = [...main.querySelectorAll<HTMLElement>("section")].filter(
    (s) => !s.parentElement?.closest("section") && s.getClientRects().length > 0,
  );
  secciones.slice(1).forEach((seccion) => {
    if (seccion.hasAttribute("data-sin-animacion")) return;
    if (seccion.closest(MARCAS) || seccion.querySelector(MARCAS)) return; // tiene marcas manuales

    const raiz =
      seccion.querySelector<HTMLElement>(":scope > .contenedor") ?? seccion;
    const bloques = [...raiz.children].flatMap((hijo) => bloquesDe(hijo));
    bloques.forEach((el, i) => {
      el.setAttribute("data-aparecer", el.tagName === "IMG" ? "foto" : "");
      (el as HTMLElement).style.setProperty(
        "--retraso",
        `${Math.min(i * RETRASO_ENTRE_ITEMS, RETRASO_MAXIMO)}ms`,
      );
    });
  });
}

/**
 * ¿React ya "hidrató" este elemento (lo conectó con el HTML que vino del servidor)?
 * Hay que esperarlo: si se le añaden atributos antes, React ve que el HTML no coincide
 * con lo que esperaba y avisa con un error de hidratación.
 */
function hidratado(el: Element): boolean {
  return Object.keys(el).some((clave) => clave.startsWith("__reactFiber$"));
}

/** Prepara las animaciones de la página. Devuelve la función que las desactiva. */
function iniciar(main: HTMLElement): () => void {
  // 1. Marcas automáticas y grupos manuales (cada ítem recibe su retraso en cascada).
  marcarSecciones(main);
  main
    .querySelectorAll<HTMLElement>("[data-aparecer-grupo]")
    .forEach((grupo) => {
      const selector = grupo.dataset.aparecerGrupo || ":scope > *";
      grupo.querySelectorAll<HTMLElement>(selector).forEach((el, i) => {
        if (!el.hasAttribute("data-aparecer"))
          el.setAttribute("data-aparecer", el.tagName === "IMG" ? "foto" : "");
        el.style.setProperty(
          "--retraso",
          `${Math.min(i * RETRASO_ENTRE_ITEMS, RETRASO_MAXIMO)}ms`,
        );
      });
    });

  const elementos = [
    ...main.querySelectorAll<HTMLElement>(
      "[data-aparecer]:not([data-aparecido])",
    ),
  ];

  // 2. Lo que ya está en pantalla al cargar se deja quieto (ya se está viendo).
  for (const el of elementos) {
    if (el.getBoundingClientRect().top < window.innerHeight)
      el.setAttribute("data-aparecido", "");
  }

  // 3. Desde aquí el CSS oculta lo que aún no se vio.
  document.documentElement.classList.add("animaciones");

  // Al terminar queda "aparecido": sin animación ni estilos extra, así no interfiere
  // con los efectos al pasar el mouse (por ejemplo, las tarjetas que se elevan).
  const terminar = (e: AnimationEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.removeAttribute("data-visible");
    el.setAttribute("data-aparecido", "");
    el.style.removeProperty("--retraso");
  };

  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        const el = entrada.target as HTMLElement;
        el.addEventListener("animationend", terminar, { once: true });
        el.setAttribute("data-visible", "");
        observador.unobserve(el); // una sola vez
      }
    },
    // Se dispara cuando el elemento ya asomó un poco (10 % por encima del borde inferior).
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
  );

  for (const el of elementos) {
    if (!el.hasAttribute("data-aparecido")) observador.observe(el);
  }

  return () => {
    observador.disconnect();
    document.documentElement.classList.remove("animaciones");
  };
}

export function AnimacionesScroll() {
  // Al navegar a otra página el componente sigue montado (vive en el layout): la ruta vuelve a activarlo.
  const ruta = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    const main = document.getElementById("contenido");
    if (!main) return;

    // Este componente puede activarse antes que la página: se espera a que todas sus secciones
    // estén hidratadas (se revisa en cada cuadro, máximo unos 5 segundos).
    let detener: (() => void) | undefined;
    let cuadro = 0;
    const esperar = (intento: number) => {
      const secciones = [...main.querySelectorAll("section")];
      if (secciones.every(hidratado) || intento > 300) detener = iniciar(main);
      else cuadro = requestAnimationFrame(() => esperar(intento + 1));
    };
    esperar(0);

    return () => {
      cancelAnimationFrame(cuadro);
      detener?.();
    };
  }, [ruta]);

  return null;
}
