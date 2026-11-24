"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

function BotonConfirmar({ texto, peligro }: { texto: string; peligro?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`btn disabled:opacity-80 ${peligro ? "bg-[#b3261e] text-white hover:bg-[#8c1d17]" : "btn-turquesa"}`}
    >
      {pending && <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />}
      {pending ? "Un momento…" : texto}
    </button>
  );
}

/**
 * Botón que pide confirmación en una ventana antes de ejecutar una acción del servidor
 * (eliminar, bloquear, marcar como cubierta...). Escape o "Cancelar" cierran sin hacer nada.
 */
export function DialogoConfirmar({
  textoBoton,
  claseBoton = "btn btn-borde",
  titulo,
  descripcion,
  textoConfirmar,
  peligro,
  accion,
  ocultos,
  children,
  cerrarAlTerminar,
}: {
  textoBoton: React.ReactNode;
  claseBoton?: string;
  titulo: string;
  descripcion: React.ReactNode;
  textoConfirmar: string;
  peligro?: boolean;
  accion: (formData: FormData) => void | Promise<void>;
  /** Campos ocultos que viajan con la acción (por ejemplo, el id). */
  ocultos: Record<string, string>;
  /** Campos extra dentro de la ventana (por ejemplo, el motivo del bloqueo). */
  children?: React.ReactNode;
  /** Cerrar la ventana cuando cambie este valor (la acción terminó). */
  cerrarAlTerminar?: unknown;
}) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);
  const idTitulo = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  // Cuando la acción devuelve un resultado nuevo, se cierra la ventana (ajuste durante el render, sin efecto).
  const [ultimoResultado, setUltimoResultado] = useState(cerrarAlTerminar);
  if (ultimoResultado !== cerrarAlTerminar) {
    setUltimoResultado(cerrarAlTerminar);
    setAbierto(false);
  }

  return (
    <>
      <button type="button" aria-haspopup="dialog" onClick={() => setAbierto(true)} className={claseBoton}>
        {textoBoton}
      </button>
      <dialog
        ref={ref}
        aria-labelledby={idTitulo}
        onClose={() => setAbierto(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setAbierto(false);
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-lg bg-white p-0 text-texto shadow-2xl backdrop:bg-[#2a1630]/60"
      >
        <form action={accion} className="p-6">
          {Object.entries(ocultos).map(([nombre, valor]) => (
            <input key={nombre} type="hidden" name={nombre} value={valor} />
          ))}
          <h2 id={idTitulo} className="text-xl font-semibold">
            {titulo}
          </h2>
          <div className="mt-2 text-base text-texto-suave">{descripcion}</div>
          {children && <div className="mt-4">{children}</div>}
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button type="button" onClick={() => setAbierto(false)} className="btn btn-borde">
              Cancelar
            </button>
            <BotonConfirmar texto={textoConfirmar} peligro={peligro} />
          </div>
        </form>
      </dialog>
    </>
  );
}
