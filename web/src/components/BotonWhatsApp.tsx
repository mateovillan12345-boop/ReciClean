import { enlaceWhatsApp, mensajeCotizacion } from "@/lib/site";

type Props = {
  children?: React.ReactNode;
  mensaje?: string;
  variante?: "principal" | "claro" | "borde" | "turquesa";
  className?: string;
};

/** Botón de contacto: siempre abre WhatsApp con el mensaje prellenado. */
export function BotonWhatsApp({
  children = "Cotiza por WhatsApp",
  mensaje = mensajeCotizacion(),
  variante = "turquesa", // los botones de cotizar/contactar por WhatsApp son turquesa

  className = "",
}: Props) {
  return (
    <a
      href={enlaceWhatsApp(mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-${variante} ${className}`}
    >
      {children}
    </a>
  );
}
