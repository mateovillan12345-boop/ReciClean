# ReciClean: stack tecnológico de la página web

Nov 11, 2026 · @Mateo

## Resumen

La web de ReciClean se construye con **Next.js + TypeScript + Tailwind CSS + Sanity + Supabase (Postgres, Storage y Auth) + Cloudflare**. Este stack cubre los tres objetivos del brief: mostrar servicios y la historia de la empresa, llevar al visitante a WhatsApp y recibir postulaciones con CV de forma segura.

Por qué encaja con ReciClean:

- **Meta de pasar de 5 a 50 solicitudes al mes:** Next.js genera páginas rápidas y bien posicionadas en Google para búsquedas como "empresa de limpieza La Paz".
- **Contenido que cambia seguido** (servicios, cifras de impacto, testimonios, logos de clientes, FAQ): Sanity permite que el equipo de ReciClean lo edite sin programar.
- **Postulaciones de personal**, que son el corazón de la parte humana de la marca: Supabase guarda los datos y los CV en privado, y solo el equipo autorizado puede verlos.
- **Costo bajo al inicio:** todo el stack funciona con planes gratuitos, así que cuesta US$0 al mes y solo se paga el dominio. Escala cuando el negocio crece.

## Arquitectura

&#91;embedded content: arquitectura de la web de ReciClean\]

Todo pasa por la app de Next.js en Cloudflare. Lee los textos de Sanity, guarda postulaciones y CVs en Supabase, avisa a RR. HH. por correo y envía a los clientes a WhatsApp.

## Detalle por tecnología

### Next.js: el sitio y su servidor

Es el framework principal, basado en React. Arma todas las páginas y también hace de backend, así que no hace falta un servidor aparte.

- **Páginas:** Inicio, `/servicios` con una subpágina por servicio, `/sostenibilidad`, `/nosotros`, `/trabaja-con-nosotros` y `/contacto`.
- **SEO:** genera páginas listas para Google con título, descripción y datos de negocio local (La Paz y El Alto). También crea el sitemap.
- **Imágenes:** las fotos reales del equipo y del antes y después se sirven desde el CDN de imágenes de Sanity, en WebP o AVIF y en el tamaño justo para cada pantalla (ver Rendimiento).
- **Backend:** los formularios se procesan en el servidor (Server Actions o rutas `/api`). Ahí se valida la postulación, se sube el CV y se guardan los datos.
- **Actualización de contenido:** cuando alguien publica un cambio en Sanity, un webhook reconstruye el sitio automáticamente en uno o dos minutos.

### TypeScript: código sin errores tontos

Es JavaScript con tipos. Se usa en **todo el código** del proyecto.

- Define la forma exacta de cada dato: un servicio, una postulación, una vacante. Si falta un campo, el error aparece al programar y no en producción.
- Junto con **Zod**, valida los formularios: teléfono boliviano, correo, que el CV sea PDF y no pase de 5 MB.
- Hace que el proyecto sea fácil de mantener por otro programador en el futuro.

### Tailwind CSS: el diseño

Es la herramienta de estilos. Se usa en **todas las secciones visuales**.

- Define los colores de marca (verde para reciclaje y azul para limpieza y confianza), tipografías y espaciados en un solo lugar.
- Hace el sitio responsive: la mayoría de visitas llegará desde el celular.
- Con **shadcn/ui** se obtienen componentes listos y accesibles: tarjetas de servicios, acordeón de preguntas frecuentes, formularios y botón flotante de WhatsApp.

### Sanity: el contenido editable (CMS)

Es un panel web donde ReciClean edita el contenido sin tocar código. Next.js lo lee y lo muestra.

| Qué se edita en Sanity | Dónde aparece |
| --- | --- |
| Servicios (institucional, post obra, domicilio, flash) | Inicio y `/servicios` |
| Frase del hero, subtítulo y barra de confianza | Inicio |
| Cifras de impacto (kg reciclados, instituciones, equipo) | Sostenibilidad y Trabaja con nosotros |
| Testimonios de clientes y de empleados | Inicio y Trabaja con nosotros |
| Logos de clientes autorizados | Inicio |
| Preguntas frecuentes | Inicio y Contacto |
| Historia, misión, visión, valores y mensaje de la fundadora | Nosotros |
| Vacantes abiertas | Trabaja con nosotros |
| Número de WhatsApp, horario, redes y datos del footer | Todo el sitio |
| Fotos del equipo y de trabajos | Todo el sitio |

Así, cuando se confirmen los datos marcados como **\[POR CONFIRMAR\]** en el brief, se cargan directamente en Sanity.

### Supabase: datos, archivos y acceso

Es la plataforma de backend. Se usan tres de sus partes:

- **Postgres (base de datos):** guarda las postulaciones (nombre, teléfono, zona, puesto, experiencia, disponibilidad, consentimiento y fecha) y, si se quiere, los mensajes del formulario de contacto para medir cuántas solicitudes llegan desde la web.
- **Storage (archivos):** guarda los CV en PDF en un bucket **privado**. Nadie puede abrirlos con un enlace público.
- **Auth (acceso):** login para el panel interno `/admin`, donde Vivian o RR. HH. revisan postulaciones, descargan CVs y cambian su estado (nueva, revisada, entrevista, contratada, descartada).

Las reglas de seguridad de la base (Row Level Security) garantizan que solo los usuarios autorizados lean esos datos.

### Cloudflare: hosting, red y protección

Es donde vive el sitio en internet. Next.js se publica en **Cloudflare Workers** con el adaptador **OpenNext**, en el plan gratis, que permite uso comercial.

- Publica automáticamente cada cambio que se sube a GitHub y crea una versión de prueba antes de publicarlo.
- Sirve las páginas desde su red global (CDN), con HTTPS gratis y protección contra ataques.
- Maneja el dominio y el DNS, por ejemplo `reciclean.com.bo` o `reciclean.bo`.
- **Turnstile:** el antispam de los formularios.
- **Web Analytics:** mide visitas y velocidad real sin cookies.
- **Cron Triggers:** una tarea programada consulta Supabase cada 3 días para que el plan gratis no se pause por inactividad.
- **R2 (opcional):** 10 GB gratis para archivos, por si algún día los CV no caben en Supabase.
- Guarda las claves secretas (de Supabase, Sanity y correo) fuera del código.

## Mapa del sitio: qué tecnología usa cada parte

Todas las páginas usan Next.js, TypeScript y Tailwind, y todas se publican en Cloudflare. La tabla muestra qué se suma en cada parte.

| Parte del sitio | Contenido (del brief) | Tecnologías clave |
| --- | --- | --- |
| Hero de inicio | Frase principal, subtítulo, "Cotiza por WhatsApp" y foto del equipo | Sanity (textos y foto), enlace `wa.me` |
| Barra de confianza | Desde 2020, personal asegurado, garantía, La Paz y El Alto | Sanity |
| Servicios y subpáginas | Institucional (destacado), post obra, domicilio y flash | Sanity, páginas por servicio para SEO |
| ¿Por qué ReciClean? | 6 tarjetas de beneficios | Sanity, shadcn/ui |
| Limpieza sostenible | Prácticas de reciclaje y cifras de impacto | Sanity |
| Cómo trabajamos | Proceso en 4 pasos | Sanity |
| Clientes y testimonios | Logos autorizados y reseñas | Sanity |
| Nosotros | Historia de Vivian Carlo, misión, visión y valores | Sanity |
| Trabaja con nosotros | Lo que ofrecemos, estadísticas del equipo, vacantes y formulario de postulación | Sanity, Supabase Postgres y Storage, Server Action, Turnstile |
| Preguntas frecuentes | 11 preguntas del brief | Sanity, acordeón de shadcn/ui |
| Contacto | Formulario corto que abre WhatsApp, zona de cobertura y redes | Formulario con Zod, enlace `wa.me`, opcional guardado en Supabase |
| Botón flotante de WhatsApp | Visible en todas las páginas | Componente de React, número desde Sanity |
| Panel `/admin` (interno) | Lista de postulaciones, descarga de CV y estados | Supabase Auth, Postgres y Storage (enlaces firmados) |
| Panel de contenido (interno) | Edición de textos, fotos y vacantes | Sanity Studio |

## Flujos clave

### Cotización por WhatsApp (clientes)

Es la acción principal de la web, y no necesita base de datos para funcionar.

1. El visitante llena el formulario corto: nombre, teléfono, institución o empresa, tipo de servicio, zona y mensaje.
2. Zod valida los campos en el navegador.
3. Next.js arma el mensaje prellenado: *"Hola ReciClean, vengo de la página web y quiero cotizar un servicio de \[tipo\]..."*.
4. Se abre WhatsApp con `https://wa.me/591XXXXXXXX?text=...` y el cliente solo presiona enviar.
5. Opcional: antes de abrir WhatsApp, se guarda una copia en Supabase para contar cuántas solicitudes llegan desde la web y medir la meta de 50 al mes.

Los botones "Cotiza por WhatsApp" del hero y el botón flotante usan el mismo enlace sin formulario.

### Postulación con CV (personal)

1. La persona entra a `/trabaja-con-nosotros` y llena el formulario: nombre, teléfono, zona, puesto, experiencia y disponibilidad.
2. Puede adjuntar un CV en PDF. Es **opcional**, porque muchas postulantes no tienen CV formal y el formulario ya recoge lo necesario.
3. Marca la casilla de consentimiento para el uso de sus datos.
4. Cloudflare Turnstile verifica que no sea un bot.
5. Una Server Action de Next.js valida todo de nuevo en el servidor, sube el PDF a Supabase Storage (bucket privado) y guarda los datos en Postgres.
6. Se envía un aviso por correo a RR. HH. con **Resend**, y la persona ve un mensaje de confirmación.
7. RR. HH. entra a `/admin`, revisa la postulación, abre el CV con un enlace temporal y cambia su estado.

Como alternativa para quien prefiere no llenar formularios, la sección también puede ofrecer "Postula por WhatsApp", tal como sugiere el brief.

## Rendimiento: cómo se construye para que sea fluido

La meta es una nota de **90 o más en Google PageSpeed Insights desde el celular**. La mayoría de clientes y postulantes entrará desde el teléfono, a veces con datos móviles. La velocidad depende sobre todo de estas decisiones de construcción, no del hosting.

### Metas medibles (Core Web Vitals de Google)

| Métrica | Qué mide | Meta |
| --- | --- | --- |
| LCP | Cuánto tarda en verse el contenido principal (foto y frase del hero) | Menos de 2,5 s |
| INP | Qué tan rápido responde al tocar un botón o campo | Menos de 200 ms |
| CLS | Si el contenido "salta" mientras carga | Menos de 0,1 |

### Decisiones de construcción

| Área | Decisión | Efecto |
| --- | --- | --- |
| Páginas | Todas las páginas públicas se generan como **estáticas** al construir el sitio. Solo los formularios y `/admin` usan el servidor | Cloudflare entrega HTML ya armado desde el nodo más cercano, sin esperar a la base de datos |
| Actualización | Un webhook de Sanity dispara la reconstrucción al publicar contenido | El contenido se mantiene al día sin perder la velocidad de lo estático |
| Imágenes | `next/image` con un loader que pide la foto al CDN de Sanity con formato automático (WebP o AVIF) y el ancho exacto para cada pantalla | Fotos nítidas que pesan una fracción del original. No se necesita el servicio de imágenes de pago de Cloudflare |
| Imágenes | Siempre con ancho y alto o proporción definidos, y con un difuminado de vista previa (LQIP de Sanity) | Nada salta al cargar y la página se siente instantánea |
| Imágenes | Solo la foto del hero carga con prioridad. El resto carga al acercarse con el scroll | El hero aparece primero |
| Hero | Foto en lugar de video. Si se usa video, que sea corto, comprimido, sin sonido y con imagen de portada | Evita el elemento más pesado de una home |
| Tipografías | `next/font` con 1 o 2 familias, solo caracteres latinos y alojadas en el propio sitio | Sin parpadeo de letras ni pedidos a Google Fonts |
| JavaScript | React Server Components por defecto. Solo son interactivos los formularios, el acordeón de FAQ y el menú móvil | Se envía muy poco código al celular |
| JavaScript | Los formularios y Turnstile se cargan solo en Contacto y Trabaja con nosotros | La home no carga código que no usa |
| Animaciones | Transiciones sobrias con CSS o Motion (versión liviana), solo con `transform` y `opacity`, respetando la opción de reducir movimiento del teléfono | Movimiento suave sin trabar el scroll |
| Estilos | Tailwind elimina las clases que no se usan. Sin librerías de UI extra además de shadcn/ui | CSS de pocos KB |
| Scripts externos | Cloudflare Web Analytics en lugar de Google Analytics. Botón de WhatsApp propio, no un widget de terceros | Menos scripts que bloquean la carga |
| Mapa de cobertura | Imagen estática de La Paz y El Alto en lugar de un mapa de Google incrustado | Ahorra cientos de KB en Contacto |
| Caché | Archivos estáticos (CSS, JS, fuentes) con caché de larga duración en Cloudflare | Las visitas repetidas cargan casi al instante |

### Cómo se controla

- [ ] Revisar cada cambio importante con **Lighthouse** antes de publicarlo, en modo celular.
- [ ] Agregar **Lighthouse CI** en GitHub para que avise si una página baja de 90.
- [ ] Seguir la velocidad real de los visitantes en **Cloudflare Web Analytics**.
- [ ] Probar el sitio en un celular de gama media con datos móviles, no solo en la computadora.
- [ ] Subir a Sanity fotos originales de buena calidad: el CDN las optimiza, pero no mejora una foto mala.

## Seguridad y privacidad

Los CV y los datos de las postulantes son la información más sensible del sitio. Estas medidas la protegen:

| Riesgo | Medida | Dónde se aplica |
| --- | --- | --- |
| Que alguien vea CVs ajenos | Bucket privado y enlaces firmados que vencen en minutos | Supabase Storage |
| Acceso no autorizado a postulaciones | Login obligatorio y reglas Row Level Security | Supabase Auth y Postgres |
| Archivos maliciosos | Solo PDF, máximo 5 MB, revisando el tipo real del archivo en el servidor | Server Action con Zod |
| Spam y bots | Cloudflare Turnstile y límite de envíos por IP | Formularios |
| Datos interceptados | HTTPS en todo el sitio | Cloudflare |
| Claves expuestas | Variables de entorno, nunca en el código | Cloudflare |
| Ataques al navegador | Encabezados de seguridad (CSP, HSTS) | Configuración de Next.js |
| Errores sin detectar | Monitoreo de errores con Sentry | Todo el sitio |

**Privacidad de las postulantes:**

- Agregar una página de **política de privacidad** y una casilla de consentimiento en el formulario.
- Definir cuánto tiempo se guardan los CV (por ejemplo, 12 meses) y borrarlos después.
- Dar una forma de pedir que se borren sus datos, por ejemplo por WhatsApp o correo.
- Bolivia protege la privacidad en su Constitución. Conviene confirmar con un abogado si hay normas adicionales que apliquen.

## Costos estimados y fases de crecimiento

Todo el stack funciona en planes gratuitos que permiten uso comercial: **US$0 al mes**, más el dominio que se paga una vez al año. Está dentro del límite de US$20 al mes y deja margen para crecer.

| Servicio | Plan | Límites gratis que importan | Cuándo pagar y cuánto |
| --- | --- | --- | --- |
| Cloudflare Workers | Free | 100 mil solicitudes al día. Las páginas estáticas casi no las consumen | Con mucho tráfico: plan Workers Paid, unos US$5 al mes |
| Supabase | Free | 500 MB de base de datos, 1 GB de archivos (unos 200 a 300 CV de 5 MB) y pausa tras 1 semana sin uso, evitada con el Cron Trigger | Si se llena: mover CVs a Cloudflare R2 (10 GB gratis) o pasar a Pro, US$25 al mes |
| Sanity | Free | Suficiente para un equipo pequeño de editores y el CDN de imágenes | Si se necesitan más editores o tráfico |
| Resend (correos) | Free | Unos miles de correos al mes | Muy poco probable |
| Turnstile y Web Analytics | Gratis | Sin límite práctico para este sitio | No aplica |
| Sentry | Free | Suficiente para un sitio de este tamaño | Muy poco probable |
| Dominio `.com.bo` o `.bo` | Pago anual | No aplica | Por confirmar con NIC Bolivia |

Los límites y precios pueden cambiar, así que conviene revisarlos en la web de cada servicio al crear las cuentas. Si en el futuro se prefiere Vercel por comodidad, su plan Pro cuesta US$20 al mes y el código de Next.js no cambia.

### Fases

1. **Fase 1, lanzamiento:** todas las páginas del brief, contenido en Sanity, WhatsApp con mensaje prellenado, formulario de postulación con CV y aviso por correo.
2. **Fase 2, gestión:** panel `/admin` con filtros por puesto y estado, registro de solicitudes desde la web y un tablero simple para medir la meta de 50 solicitudes al mes.
3. **Fase 3, crecimiento:** blog de consejos de limpieza para SEO, WhatsApp Business API con respuestas automáticas, cotizador en línea y portal para clientes institucionales con reportes de servicio.

## Fuentes

- [Vercel: plan Hobby (uso no comercial)](https://vercel.com/docs/plans/hobby)
- [Supabase: precios y límites del plan gratis](https://supabase.com/pricing)
