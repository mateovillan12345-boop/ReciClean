/** Estado que devuelven las acciones de formulario del panel (para useActionState). */
export type EstadoFormulario = {
  ok?: boolean;
  mensaje?: string;
  error?: string;
  /** Errores por campo, para mostrarlos junto a cada uno. */
  campos?: Record<string, string>;
  /** Lo que se había escrito, para volver a mostrarlo si hubo un error. */
  valores?: Record<string, string>;
  /** Para no borrar el correo escrito si falla el login. */
  correo?: string;
} | null;
