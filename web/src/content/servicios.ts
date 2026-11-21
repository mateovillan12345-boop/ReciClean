import type { NombreImagen } from "./imagenes";

export type Servicio = {
  slug: string;
  numero: string;
  nombre: string;
  /** Texto que completa "quiero cotizar un servicio de ..." */
  paraMensaje: string;
  resumen: string;
  descripcion: string;
  imagen: NombreImagen;
  altImagen: string;
  destacado?: boolean;
  incluye: { titulo: string; detalle?: string }[];
  idealPara: string[];
  /** Máximo 3 preguntas frecuentes relevantes (claves de `preguntas` en content/empresa.ts). */
  preguntas: string[];
  galeria: { imagen: NombreImagen; alt: string; titulo: string }[];
};

export const servicios: Servicio[] = [
  {
    slug: "limpieza-institucional",
    numero: "01",
    nombre: "Limpieza institucional y empresarial",
    paraMensaje: "limpieza institucional y empresarial",
    resumen:
      "Servicio integral para instituciones públicas y privadas, oficinas y empresas, diseñado según tus requerimientos y tu presupuesto.",
    descripcion:
      "Un solo proveedor serio, asegurado y flexible para tu institución: personal fijo que conoce tus instalaciones, contrato anual y supervisión constante.",
    imagen: "oficinas",
    altImagen: "Oficina amplia con estaciones de trabajo ordenadas",
    destacado: true,
    incluye: [
      {
        titulo: "Limpieza de mantenimiento",
        detalle:
          "Diaria o periódica de oficinas, baños, áreas comunes, pasillos y recepción.",
      },
      {
        titulo: "Limpieza profunda",
        detalle: "Pisos, vidrios, mobiliario, alfombras y tapices.",
      },
      {
        titulo: "Limpieza especializada",
        detalle: "Desinfección, cocinas y comedores, áreas de alto tránsito.",
      },
      {
        titulo: "Gestión de residuos y reciclaje",
        detalle: "Separación de residuos en origen.",
      },
      {
        titulo: "Supervisión y reportes periódicos",
        detalle: "Seguimiento constante del servicio que recibes.",
      },
      {
        titulo: "Contrato mínimo de un año",
        detalle:
          "Un servicio estable, con personal fijo que conoce tus instalaciones.",
      },
    ],
    preguntas: ["contrato", "anticipacion", "personal"],
    idealPara: [
      "Instituciones públicas: ministerios, alcaldías y entidades estatales",
      "Bancos, colegios, universidades, clínicas y ONG",
      "Oficinas corporativas",
      "Comercios y edificios",
    ],
    galeria: [
      {
        imagen: "oficina-moderna",
        alt: "Oficina moderna con escritorios y sillas",
        titulo: "Oficinas y estaciones de trabajo",
      },
      {
        imagen: "aula",
        alt: "Aula con pupitres ordenados",
        titulo: "Colegios y universidades",
      },
      {
        imagen: "piso",
        alt: "Persona pasando una mopa sobre un piso claro",
        titulo: "Pasillos y áreas comunes",
      },
    ],
  },
  {
    slug: "limpieza-post-obra",
    numero: "02",
    nombre: "Limpieza post obra",
    paraMensaje: "limpieza post obra",
    resumen: "Dejamos listo para usar un espacio recién construido o remodelado.",
    descripcion:
      "Después de una obra quedan polvo fino, pintura y restos de material. Nos encargamos de dejar el espacio limpio y listo para entregar u ocupar.",
    imagen: "post-obra",
    altImagen: "Trabajador limpiando un piso con una máquina de lavado",
    incluye: [
      { titulo: "Retiro de polvo fino" },
      { titulo: "Retiro de restos de pintura, cemento y yeso" },
      { titulo: "Limpieza de vidrios y marcos" },
      { titulo: "Limpieza de pisos" },
      { titulo: "Limpieza de baños" },
    ],
    preguntas: ["precio", "danos", "garantia"],
    idealPara: [
      "Constructoras",
      "Inmobiliarias",
      "Oficinas nuevas",
      "Viviendas remodeladas",
    ],
    galeria: [
      {
        imagen: "vidrios-exterior",
        alt: "Persona limpiando una fachada de vidrio",
        titulo: "Vidrios y marcos",
      },
      {
        imagen: "piso",
        alt: "Persona pasando una mopa sobre un piso claro",
        titulo: "Pisos listos para usar",
      },
    ],
  },
  {
    slug: "limpieza-a-domicilio",
    numero: "03",
    nombre: "Limpieza a domicilio",
    paraMensaje: "limpieza a domicilio",
    resumen:
      "Limpieza profunda de casas y departamentos: alfombras, sillones, cortinas, pisos, vidrios y cocinas.",
    descripcion:
      "Tu casa en manos de personal confiable, asegurado y con garantía. Tú nos dices qué necesitas y lo dejamos impecable.",
    imagen: "alfombra",
    altImagen: "Aspiradora limpiando una alfombra",
    incluye: [
      { titulo: "Lavado de alfombras" },
      { titulo: "Lavado de sillones y sillas tapizadas" },
      { titulo: "Lavado de cortinas" },
      { titulo: "Lustrado de pisos de madera" },
      { titulo: "Lavado de pisos de cerámica" },
      { titulo: "Limpieza de vidrios" },
      { titulo: "Limpieza y desinfección de cocinas y campanas" },
    ],
    preguntas: ["personal", "danos", "precio"],
    idealPara: [
      "Familias",
      "Personas que trabajan todo el día",
      "Adultos mayores",
      "Quienes se mudan o terminan una remodelación",
    ],
    galeria: [
      {
        imagen: "cocina",
        alt: "Cocina blanca limpia y ordenada",
        titulo: "Cocinas y campanas",
      },
      {
        imagen: "vidrios",
        alt: "Persona limpiando un ventanal",
        titulo: "Vidrios",
      },
      {
        imagen: "alfombra-vapor",
        alt: "Limpieza de alfombra con equipo de vapor",
        titulo: "Alfombras y tapices",
      },
    ],
  },
  {
    slug: "limpieza-flash",
    numero: "04",
    nombre: "Limpieza flash",
    paraMensaje: "limpieza flash",
    resumen: "Limpieza de mantenimiento rápida y general. Tú eliges las áreas.",
    descripcion:
      "Para cuando necesitas tu espacio en orden sin complicarte: una limpieza general y rápida en las áreas que tú elijas.",
    imagen: "superficies",
    altImagen: "Manos con guantes limpiando una superficie con paño y atomizador",
    incluye: [
      { titulo: "Cocina" },
      { titulo: "Dormitorios" },
      { titulo: "Baños" },
      { titulo: "Sala" },
      { titulo: "Patio" },
      { titulo: "Y las demás áreas que necesites" },
    ],
    preguntas: ["anticipacion", "precio", "garantia"],
    idealPara: [
      "Mantenimiento general del hogar",
      "Quienes necesitan una ayuda puntual",
      "Personas con poco tiempo",
    ],
    galeria: [
      {
        imagen: "hogar",
        alt: "Dos personas de limpieza trabajando en una sala",
        titulo: "Sala y áreas comunes",
      },
      {
        imagen: "cocina",
        alt: "Cocina blanca limpia y ordenada",
        titulo: "Cocina",
      },
    ],
  },
];

export function servicioPorSlug(slug: string): Servicio {
  const servicio = servicios.find((s) => s.slug === slug);
  if (!servicio) throw new Error(`Servicio no encontrado: ${slug}`);
  return servicio;
}
