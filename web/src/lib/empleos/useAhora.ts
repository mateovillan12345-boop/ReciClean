import { useSyncExternalStore } from "react";

// Hora de carga de la página en el navegador. Se fija una vez para que no cambie entre renders.
let momentoCarga: number | undefined;
const suscribir = () => () => {};
const enNavegador = () => (momentoCarga ??= Date.now());
const enServidor = () => null;

/**
 * La hora actual, pero solo en el navegador: devuelve null al prerenderizar en el servidor.
 * Así lo que depende de la fecha ("Nueva") no queda congelado en el HTML en caché
 * y no hay diferencias de hidratación.
 */
export function useAhora(): number | null {
  return useSyncExternalStore(suscribir, enNavegador, enServidor);
}
