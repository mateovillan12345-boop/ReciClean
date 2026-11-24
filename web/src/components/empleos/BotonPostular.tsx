"use client";

import { useState } from "react";
import { ModalPostulacion, type VacanteElegida } from "./ModalPostulacion";

/**
 * Botón que abre la ventana de postulación.
 * Sin `vacante` es una postulación espontánea ("Enviar mi CV").
 * `variante` usa los mismos estilos .btn-* del resto del sitio.
 */
export function BotonPostular({
  vacante = null,
  children = "Enviar mi CV",
  variante = "turquesa",
  className = "",
}: {
  vacante?: VacanteElegida;
  children?: React.ReactNode;
  variante?: "principal" | "turquesa" | "borde" | "claro" | "borde-claro";
  className?: string;
}) {
  const [abierto, setAbierto] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setAbierto(true)}
        className={`btn btn-${variante} ${className}`}
      >
        {children}
      </button>
      <ModalPostulacion abierto={abierto} onCerrar={() => setAbierto(false)} vacante={vacante} />
    </>
  );
}
