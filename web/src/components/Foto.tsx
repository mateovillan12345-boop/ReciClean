import Image from "next/image";
import { imagenes, type NombreImagen } from "@/content/imagenes";

type Props = {
  nombre: NombreImagen;
  alt: string;
  className?: string;
  sizes?: string;
  /** Solo para la foto principal de la página (carga con prioridad). */
  principal?: boolean;
};

/** Foto optimizada (WebP generado por scripts/build-images.mjs) con tamaño fijo para evitar saltos. */
export function Foto({ nombre, alt, className, sizes, principal }: Props) {
  const img = imagenes[nombre];
  return (
    <Image
      src={img.src}
      width={img.width}
      height={img.height}
      alt={alt}
      className={className}
      sizes={sizes ?? "(min-width: 1024px) 50vw, 100vw"}
      loading={principal ? "eager" : "lazy"}
      fetchPriority={principal ? "high" : "auto"}
    />
  );
}
