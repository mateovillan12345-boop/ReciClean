import manifest from "./images.json";

export type Imagen = { src: string; width: number; height: number };
export type NombreImagen = keyof typeof manifest;

export const imagenes: Record<NombreImagen, Imagen> = manifest;
