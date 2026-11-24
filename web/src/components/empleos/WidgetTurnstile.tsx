"use client";

import { useEffect, useRef } from "react";

// Verificación "no soy un robot" de Cloudflare Turnstile. Casi siempre pasa sola, sin acertijos.
// Para pedir un token nuevo (cada uno sirve una sola vez), el padre cambia la `key` del componente.

type OpcionesTurnstile = {
  sitekey: string;
  language?: string;
  size?: "normal" | "flexible" | "compact";
  theme?: "light" | "dark" | "auto";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (elemento: HTMLElement, opciones: OpcionesTurnstile) => string;
      remove: (id: string) => void;
    };
  }
}

const URL_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let cargaScript: Promise<void> | null = null;

/** Carga el script de Cloudflare una sola vez para toda la página. */
function cargarScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  cargaScript ??= new Promise<void>((resolver, rechazar) => {
    const script = document.createElement("script");
    script.src = URL_SCRIPT;
    script.async = true;
    script.onload = () => resolver();
    script.onerror = () => {
      cargaScript = null; // permite reintentar
      rechazar(new Error("No cargó Turnstile"));
    };
    document.head.appendChild(script);
  });
  return cargaScript;
}

export function WidgetTurnstile({
  onToken,
  onFallo,
  idError,
}: {
  /** Recibe el token cuando la verificación pasa, y null cuando vence. */
  onToken: (token: string | null) => void;
  /** Se llama si el widget no puede cargar (sin conexión, bloqueador...). */
  onFallo: () => void;
  /** id del mensaje de error asociado, para lectores de pantalla. */
  idError?: string;
}) {
  const contenedor = useRef<HTMLDivElement>(null);
  // Guardar los callbacks en una ref evita volver a dibujar el widget en cada render del padre.
  const callbacks = useRef({ onToken, onFallo });
  useEffect(() => {
    callbacks.current = { onToken, onFallo };
  });

  const claveSitio = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!claveSitio) return;
    let id: string | undefined;
    let cancelado = false;

    cargarScript()
      .then(() => {
        if (cancelado || !contenedor.current || !window.turnstile) return;
        id = window.turnstile.render(contenedor.current, {
          sitekey: claveSitio,
          language: "es",
          size: "flexible",
          theme: "light",
          callback: (token) => callbacks.current.onToken(token),
          "expired-callback": () => callbacks.current.onToken(null),
          "error-callback": () => callbacks.current.onFallo(),
        });
      })
      .catch(() => {
        if (!cancelado) callbacks.current.onFallo();
      });

    return () => {
      cancelado = true;
      if (id && window.turnstile) window.turnstile.remove(id);
    };
  }, [claveSitio]);

  if (!claveSitio) {
    return (
      <p className="rounded bg-[#fdecea] p-3 text-sm text-[#b3261e]">
        Falta NEXT_PUBLIC_TURNSTILE_SITE_KEY en .env.local.
      </p>
    );
  }

  return <div ref={contenedor} aria-describedby={idError} className="min-h-[65px]" />;
}
