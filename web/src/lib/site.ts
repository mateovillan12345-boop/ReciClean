// Datos generales del sitio. Cuando el contenido pase a Sanity, este archivo
// es lo primero que se reemplaza (número de WhatsApp, dominio, etc.).

export const site = {
  nombre: "ReciClean",
  descripcion:
    "Servicios de limpieza institucional, empresarial y a domicilio en La Paz y El Alto, con personal asegurado, garantía de satisfacción y un enfoque real en el reciclaje.",
  // PENDIENTE: dominio definitivo (reciclean.com.bo o reciclean.bo).
  url: "https://reciclean.com.bo",
  // Solo dígitos, con código de país (591).
  whatsapp: "59176227202",
  telefono: "+591 76227202",
  correo: "reciclean2019@gmail.com",
  facebook: "https://www.facebook.com/ReciCleanBolivia",
  zona: "La Paz y El Alto, Bolivia",
  respuesta: "Respondemos en menos de 24 horas",
} as const;

// Funciones que se pueden ocultar sin borrar su código.
export const funciones = {
  // Página y sección "Trabaja con nosotros": oculta por ahora. Poner en true para reactivarla.
  trabajaConNosotros: false,
};

const menuCompleto = [
  { href: "/", texto: "Inicio" },
  { href: "/servicios", texto: "Servicios" },
  { href: "/sostenibilidad", texto: "Sostenibilidad" },
  { href: "/nosotros", texto: "Nosotros" },
  { href: "/trabaja-con-nosotros", texto: "Trabaja con nosotros" },
  { href: "/contacto", texto: "Contacto" },
];

export const menu = menuCompleto.filter(
  (item) => item.href !== "/trabaja-con-nosotros" || funciones.trabajaConNosotros,
);

/** Arma el enlace wa.me con un mensaje prellenado. */
export function enlaceWhatsApp(mensaje: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

export function mensajeCotizacion(servicio?: string): string {
  return servicio
    ? `Hola ReciClean, vengo de la página web y quiero cotizar un servicio de ${servicio}.`
    : "Hola ReciClean, vengo de la página web y quiero cotizar un servicio de limpieza.";
}

export const mensajeVisitaTecnica =
  "Hola ReciClean, vengo de la página web y quiero solicitar una visita técnica para limpieza institucional.";

export const mensajePostulacion =
  "Hola ReciClean, vengo de la página web y quiero postular para trabajar con ustedes.";
