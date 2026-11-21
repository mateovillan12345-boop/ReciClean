import { enlaceWhatsApp, mensajeCotizacion } from "@/lib/site";
import { IconoWhatsApp } from "./Iconos";

/** Botón flotante visible en todas las páginas. */
export function WhatsAppFlotante() {
  return (
    <a
      href={enlaceWhatsApp(mensajeCotizacion())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-verde text-white shadow-[0_4px_14px_rgba(43,26,51,0.25)] transition-colors hover:bg-verde-oscuro md:bottom-6 md:right-6"
    >
      <IconoWhatsApp className="h-7 w-7" />
    </a>
  );
}
