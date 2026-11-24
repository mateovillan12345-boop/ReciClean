"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Upload } from "lucide-react";
import { tipoDeArchivo } from "@/lib/empleos/esquemas";
import { TAMANO_MAXIMO_CV } from "@/lib/empleos/tipos";

function tamanoLegible(bytes: number): string {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Revisa formato y tamaño en el navegador. El servidor lo vuelve a revisar con los primeros bytes. */
export function errorDeArchivo(archivo: File): string | undefined {
  if (!tipoDeArchivo(archivo)) return "El CV debe ser PDF, PNG o JPG.";
  if (archivo.size === 0) return "El archivo está vacío.";
  if (archivo.size > TAMANO_MAXIMO_CV) return "El archivo pesa más de 5 MB. Prueba con uno más liviano.";
  return undefined;
}

/**
 * Zona para elegir o arrastrar el CV. El <input type="file"> real sigue ahí (oculto a la vista),
 * así funciona con teclado (Tab + Enter) y con lectores de pantalla.
 */
export function ZonaArchivo({
  id,
  archivo,
  error,
  onCambio,
}: {
  id: string;
  archivo: File | null;
  error?: string;
  /** Archivo elegido (o null al quitarlo) y su error, si no es válido. */
  onCambio: (archivo: File | null, error?: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [arrastrando, setArrastrando] = useState(false);
  // Al quitar el archivo, el foco pasa a la zona para elegir otro (que aparece en el siguiente render).
  const enfocarAlVolver = useRef(false);
  useEffect(() => {
    if (!archivo && enfocarAlVolver.current) {
      enfocarAlVolver.current = false;
      input.current?.focus();
    }
  }, [archivo]);
  const idError = `${id}-error`;
  const idAyuda = `${id}-ayuda`;

  function elegir(nuevo: File | undefined) {
    if (!nuevo) return;
    const problema = errorDeArchivo(nuevo);
    onCambio(problema ? null : nuevo, problema);
    if (problema && input.current) input.current.value = "";
  }

  function quitar() {
    enfocarAlVolver.current = true;
    onCambio(null);
  }

  return (
    <div>
      <p className="mb-1.5 block text-base font-medium" id={`${id}-titulo`}>
        Tu CV
      </p>

      {archivo ? (
        <div className="flex items-center gap-3 rounded border border-linea bg-agua p-4">
          <FileText aria-hidden="true" className="h-8 w-8 shrink-0 text-turquesa-oscuro" strokeWidth={1.5} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{archivo.name}</p>
            <p className="text-sm text-texto-suave">{tamanoLegible(archivo.size)}</p>
          </div>
          <button type="button" onClick={quitar} className="enlace shrink-0 px-2 py-2" aria-label={`Quitar ${archivo.name}`}>
            Quitar
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(e) => {
            e.preventDefault();
            setArrastrando(true);
          }}
          onDragLeave={() => setArrastrando(false)}
          onDrop={(e) => {
            e.preventDefault();
            setArrastrando(false);
            elegir(e.dataTransfer.files[0]);
          }}
          className={`flex cursor-pointer flex-col items-center gap-2 rounded border-2 border-dashed px-4 py-8 text-center transition-colors has-[input:focus-visible]:outline-[3px] has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-turquesa has-[input:focus-visible]:outline ${
            error
              ? "border-[#b3261e] bg-[#fdecea]"
              : arrastrando
                ? "border-turquesa bg-agua"
                : "border-[#cfd6dc] hover:border-turquesa hover:bg-agua"
          }`}
        >
          <Upload aria-hidden="true" className="h-8 w-8 text-turquesa-oscuro" strokeWidth={1.5} />
          <span className="font-medium">
            Arrastra tu CV aquí o <span className="text-turquesa-oscuro underline underline-offset-4">elige un archivo</span>
          </span>
          <span id={idAyuda} className="text-sm text-texto-suave">
            PDF, PNG o JPG. Máximo 5 MB.
          </span>
          <input
            ref={input}
            id={id}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
            className="sr-only"
            aria-labelledby={`${id}-titulo`}
            aria-describedby={error ? `${idError} ${idAyuda}` : idAyuda}
            aria-invalid={error ? true : undefined}
            onChange={(e) => elegir(e.target.files?.[0])}
          />
        </label>
      )}

      {error && (
        <p id={idError} className="mt-1.5 text-sm font-bold text-[#b3261e]">
          {error}
        </p>
      )}
    </div>
  );
}
