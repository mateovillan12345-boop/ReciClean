# ReciClean: sitio web

Sitio de ReciClean, empresa de limpieza (con enfoque en reciclaje) de La Paz y El Alto, Bolivia. Objetivo principal: llevar al visitante a cotizar por WhatsApp.

## Cómo trabajar con el usuario

- Responde siempre en **español**.
- El usuario está aprendiendo a modificar el sitio. Cuando pida "dime dónde" o "no lo cambies tú", **no edites**: indica archivo y línea (`ruta:línea`), muestra el fragmento y explica qué tocar. Ofrece variantes para practicar.
- Cuando sí pida cambios, explica brevemente qué tocaste y **cómo revertirlo**.
- El usuario edita archivos a mano entre turnos: vuelve a leer antes de editar y no deshagas sus cambios.

## Estructura

```
Reciclean/
├── web/                      App Next.js (todo el código vive aquí)
├── Images/                   Fotos originales (fuente de scripts/build-images.mjs)
├── ReciClean_*.md            Info de la empresa, colores/tipografía y stack planeado
└── *.html                    Previews de paletas (no forman parte del sitio)
```

Las fuentes e íconos originales (Fredoka, DM Sans, láminas de reciclaje y checks) están en la carpeta padre `../`.

## Stack real (web/)

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + Zod + lucide-react.
El doc de stack menciona Sanity, Supabase y Cloudflare: **aún no están instalados**; el contenido está en archivos TS.

**Next.js 16 tiene cambios incompatibles** con versiones anteriores: lee `web/AGENTS.md` y la guía en `web/node_modules/next/dist/docs/` antes de usar APIs de Next.

## Comandos (desde `web/`)

```bash
npm run dev                    # servidor local
npx tsc --noEmit -p .          # revisión de tipos
npx eslint src                 # lint
node scripts/build-images.mjs  # regenera public/images/*.webp desde ../Images
```

No hay tests ni repositorio git. Verifica cada cambio con `tsc` + `eslint`, y avisa que no se revisó en el navegador si no lo hiciste.

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Menú, teléfono, correo, WhatsApp, interruptores (`funciones`) | `web/src/lib/site.ts` |
| Servicios (incluye, ideal para, galería, `preguntas`) | `web/src/content/servicios.ts` |
| Textos de empresa, pasos, garantías, preguntas frecuentes (con `clave`) | `web/src/content/empresa.ts` |
| Colores, botones, títulos, utilidades propias | `web/src/app/globals.css` |
| Fuentes (DM Sans texto, Fredoka logo) | `web/src/app/layout.tsx` + `web/src/app/fonts/` |
| Header / pie | `web/src/components/Encabezado.tsx`, `PiePagina.tsx` |
| Bloques reutilizables (TituloSeccion, ListaCheck, Pasos, SeccionPreguntas, BandaContacto…) | `web/src/components/Secciones.tsx` |
| Plantilla de cada servicio | `web/src/components/PaginaServicio.tsx` |
| Carrusel de inicio | `web/src/components/Carrusel.tsx` |
| Mapa de oficinas | `web/src/components/MapaOficinas.tsx` |

## Convenciones de estilo

- **Tailwind 4 sin config JS:** los tokens van en `@theme` de `globals.css` (`--color-morado` → `bg-morado`, `text-morado`). Colores: `morado`, `morado-oscuro`, `turquesa`, `turquesa-oscuro`, `agua` (celeste), `lila` / `lila-borde` (morado suave), `linea`, `texto`, `texto-suave`.
- Para texto pequeño en turquesa usa `turquesa-oscuro`: `turquesa` no da contraste AA sobre blanco.
- Clases propias en `@layer components`: `.contenedor`, `.seccion`, `.btn` + `.btn-principal | -turquesa | -borde | -claro | -borde-claro`, `.campo`, `.enlace`. Las utilidades de Tailwind las sobrescriben (por ejemplo, `pb-0` sobre `.seccion`).
- **Botones de WhatsApp:** `BotonWhatsApp`, cuya variante por defecto es `turquesa` (con línea blanca fina). Todos los botones de cotizar/contactar usan turquesa.
- **Íconos de imagen** (`.icono-reciclaje`, `.icono-check`): son PNG usados como máscara CSS, así que toman el color de `text-*`. No uses `<img>` con ellos.
- **Header:** es `absolute` y transparente. La variable `sobreFoto` (`ruta === "/"`) pone el logo y los enlaces en blanco sobre el carrusel de Inicio, y en morado/turquesa en las demás páginas. Cualquier elemento nuevo del header debe respetar esa condición.
- Nombres de componentes, variables y comentarios en español.
