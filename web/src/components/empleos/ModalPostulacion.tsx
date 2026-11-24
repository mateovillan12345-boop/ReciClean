"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { FormularioPostulacionCV } from "./FormularioPostulacionCV";

export type VacanteElegida = { id: string; titulo: string } | null;

/**
 * Ventana de postulación con <dialog> nativo:
 * - showModal() atrapa el foco dentro y oscurece el fondo,
 * - Escape la cierra (lo hace el navegador),
 * - al cerrarse, el foco vuelve al botón que la abrió.
 * Si se cierra a medio llenar, los datos se conservan; después de enviar, la próxima vez abre vacío.
 */
export function ModalPostulacion({
  abierto,
  onCerrar,
  vacante,
}: {
  abierto: boolean;
  onCerrar: () => void;
  /** null = postulación espontánea (sin vacante). */
  vacante: VacanteElegida;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const idTitulo = useId();
  const [version, setVersion] = useState(0);
  const terminado = useRef(false);

  function alCerrar() {
    if (terminado.current) {
      terminado.current = false;
      setVersion((v) => v + 1); // formulario nuevo para la próxima vez
    }
    onCerrar();
  }

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) dialogo.showModal();
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={idTitulo}
      onClose={alCerrar}
      // Clic en el fondo oscuro (fuera de la caja) = cerrar
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-xl rounded-lg bg-white p-0 text-texto shadow-2xl backdrop:bg-[#2a1630]/60"
    >
      <div className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-turquesa-oscuro">
              {vacante ? "Postulación" : "Postulación espontánea"}
            </p>
            <h2 id={idTitulo} className="mt-1 text-2xl">
              {vacante ? vacante.titulo : "Envíanos tu CV"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="-mr-2 -mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded text-texto-suave hover:bg-agua hover:text-morado"
            aria-label="Cerrar"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <FormularioPostulacionCV
          key={version}
          vacante={vacante}
          onCerrar={onCerrar}
          onTerminado={() => {
            terminado.current = true;
          }}
        />
      </div>
    </dialog>
  );
}
