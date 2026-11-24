// Tipos de la bolsa de trabajo. Reflejan las tablas de supabase/migraciones/0001_bolsa_de_trabajo.sql:
// si cambias un CHECK allí, cámbialo también aquí.

export const areas = ["Limpieza", "Reciclaje", "Logística", "Supervisión"] as const;
export const zonasVacante = ["La Paz", "El Alto"] as const;
export const zonasPostulante = ["La Paz", "El Alto", "Otra"] as const;
export const estadosVacante = ["activa", "pausada", "cubierta"] as const;
export const estadosAplicacion = ["nuevo", "revisado", "entrevista", "descartado"] as const;
export const experiencias = ["Sin experiencia", "Menos de 1 año", "1 a 3 años", "Más de 3 años"] as const;

export type Area = (typeof areas)[number];
export type ZonaVacante = (typeof zonasVacante)[number];
export type ZonaPostulante = (typeof zonasPostulante)[number];
export type EstadoVacante = (typeof estadosVacante)[number];
export type EstadoAplicacion = (typeof estadosAplicacion)[number];
export type Experiencia = (typeof experiencias)[number];

export type Vacante = {
  id: string;
  titulo: string;
  slug: string;
  area: Area;
  zona: ZonaVacante;
  jornada: string;
  horario: string;
  tipo_contrato: string;
  salario: string | null;
  resumen: string;
  descripcion: string;
  responsabilidades: string[];
  requisitos: string[];
  estado: EstadoVacante;
  creada_en: string;
  cubierta_en: string | null;
};

export type Aplicacion = {
  id: string;
  vacante_id: string | null;
  nombre: string;
  telefono: string;
  /** Opcional, además del teléfono/WhatsApp. */
  celular: string | null;
  correo: string | null;
  zona: ZonaPostulante;
  experiencia: Experiencia;
  cv_ruta: string;
  estado: EstadoAplicacion;
  ip_hash: string;
  creada_en: string;
};

export type Bloqueado = {
  id: string;
  telefono: string | null;
  correo: string | null;
  motivo: string;
  creado_en: string;
};

export type IntentoPostulacion = {
  id: number;
  ip_hash: string;
  telefono: string;
  creado_en: string;
};

/** Formatos de CV aceptados: extensión ↔ tipo MIME. */
export const formatosCV = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
} as const;
export type ExtensionCV = keyof typeof formatosCV;
export const TAMANO_MAXIMO_CV = 5 * 1024 * 1024; // 5 MB, igual que el límite del bucket

export const BUCKET_CVS = "cvs";
