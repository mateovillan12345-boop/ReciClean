"use client";

import { useState } from "react";
import { servicios } from "@/content/servicios";
import { erroresPorCampo, esquemaContacto, mensajeContacto, zonas } from "@/lib/formularios";
import { enlaceWhatsApp } from "@/lib/site";
import { IconoWhatsApp } from "./Iconos";

type Errores = Record<string, string>;

export function Campo({
  id,
  etiqueta,
  opcional,
  error,
  children,
}: {
  id: string;
  etiqueta: string;
  opcional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-base font-medium">
        {etiqueta}
        {opcional && <span className="font-normal text-texto-suave"> (opcional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-bold text-[#b3261e]">
          {error}
        </p>
      )}
    </div>
  );
}

function attrs(id: string, errores: Errores) {
  return {
    id,
    name: id.split("-").pop(),
    className: "campo",
    "aria-invalid": errores[id.split("-").pop()!] ? true : undefined,
    "aria-describedby": errores[id.split("-").pop()!] ? `${id}-error` : undefined,
  } as const;
}

function abrirWhatsApp(mensaje: string) {
  window.open(enlaceWhatsApp(mensaje), "_blank", "noopener,noreferrer");
}

/** Formulario corto de cotización: valida y abre WhatsApp con el mensaje armado. */
export function FormularioContacto({ servicioInicial }: { servicioInicial?: string }) {
  const [errores, setErrores] = useState<Errores>({});
  const [enviado, setEnviado] = useState(false);

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.currentTarget));
    const resultado = esquemaContacto.safeParse(datos);
    if (!resultado.success) {
      setErrores(erroresPorCampo(resultado.error));
      setEnviado(false);
      return;
    }
    setErrores({});
    setEnviado(true);
    abrirWhatsApp(mensajeContacto(resultado.data));
  }

  return (
    <form onSubmit={enviar} noValidate className="grid gap-5 sm:grid-cols-2">
      <Campo id="c-nombre" etiqueta="Nombre" error={errores.nombre}>
        <input type="text" autoComplete="name" {...attrs("c-nombre", errores)} />
      </Campo>
      <Campo id="c-telefono" etiqueta="Teléfono" error={errores.telefono}>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Ej. 7XXXXXXX"
          {...attrs("c-telefono", errores)}
        />
      </Campo>
      <div className="sm:col-span-2">
        <Campo id="c-empresa" etiqueta="Institución o empresa" opcional error={errores.empresa}>
          <input type="text" autoComplete="organization" {...attrs("c-empresa", errores)} />
        </Campo>
      </div>
      <Campo id="c-servicio" etiqueta="Tipo de servicio" error={errores.servicio}>
        <select defaultValue={servicioInicial ?? ""} {...attrs("c-servicio", errores)}>
          <option value="" disabled>
            Elige una opción
          </option>
          {servicios.map((s) => (
            <option key={s.slug} value={s.paraMensaje}>
              {s.nombre}
            </option>
          ))}
        </select>
      </Campo>
      <Campo id="c-zona" etiqueta="Zona" error={errores.zona}>
        <select defaultValue="" {...attrs("c-zona", errores)}>
          <option value="" disabled>
            Elige una opción
          </option>
          {zonas.map((z) => (
            <option key={z}>{z}</option>
          ))}
        </select>
      </Campo>
      <div className="sm:col-span-2">
        <Campo id="c-mensaje" etiqueta="Mensaje" opcional error={errores.mensaje}>
          <textarea
            rows={4}
            placeholder="Cuéntanos qué necesitas: tipo de espacio, tamaño aproximado, frecuencia."
            {...attrs("c-mensaje", errores)}
          />
        </Campo>
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className="btn btn-turquesa w-full sm:w-auto">
          <IconoWhatsApp className="h-5 w-5" />
          Enviar por WhatsApp
        </button>
        <p className="mt-3 text-sm text-texto-suave" role="status">
          {enviado
            ? "Se abrió WhatsApp con tu mensaje listo. Solo presiona enviar."
            : "Al enviar se abre WhatsApp con tu mensaje listo. Solo presiona enviar."}
        </p>
      </div>
    </form>
  );
}
