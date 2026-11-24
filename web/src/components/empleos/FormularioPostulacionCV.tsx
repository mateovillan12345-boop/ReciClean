"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CircleCheck, Loader2 } from "lucide-react";
import { confirmarPostulacion, prepararPostulacion } from "@/app/(sitio)/empleos/acciones";
import { Campo } from "@/components/Formularios";
import { erroresPorCampo } from "@/lib/formularios";
import { esquemaDatosPostulante, tipoDeArchivo } from "@/lib/empleos/esquemas";
import { BUCKET_CVS, experiencias, zonasPostulante } from "@/lib/empleos/tipos";
import { clienteNavegador } from "@/lib/supabase/navegador";
import type { VacanteElegida } from "./ModalPostulacion";
import { WidgetTurnstile } from "./WidgetTurnstile";
import { ZonaArchivo } from "./ZonaArchivo";

type Errores = Record<string, string>;
type Paso = 1 | 2 | "listo";

const camposPaso1 = ["nombre", "telefono", "celular", "correo", "zona", "experiencia"] as const;
type DatosFormulario = Record<(typeof camposPaso1)[number], string>;
const datosVacios: DatosFormulario = { nombre: "", telefono: "", celular: "", correo: "", zona: "", experiencia: "" };

/** Copia de los errores sin el de un campo. */
function sinError(errores: Errores, campo: string): Errores {
  const copia = { ...errores };
  delete copia[campo];
  return copia;
}

export const TEXTO_CONSENTIMIENTO =
  "Acepto que ReciClean use mis datos solo para este proceso de selección y los guarde por un máximo de 3 meses o hasta que el puesto sea cubierto.";

/**
 * Formulario de postulación en 2 pasos: 1) datos, 2) CV + verificación + consentimiento.
 * El envío: prepararPostulacion → subir CV directo a Supabase Storage → confirmarPostulacion.
 */
export function FormularioPostulacionCV({
  vacante,
  onCerrar,
  onTerminado,
}: {
  vacante: VacanteElegida;
  onCerrar: () => void;
  /** Avisa al modal que el envío terminó, para que la próxima vez se abra vacío. */
  onTerminado: () => void;
}) {
  const id = useId();
  const [paso, setPaso] = useState<Paso>(1);
  const [datos, setDatos] = useState<DatosFormulario>(datosVacios);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [consentimiento, setConsentimiento] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [versionTurnstile, setVersionTurnstile] = useState(0);
  const [sitioWeb, setSitioWeb] = useState(""); // honeypot
  const [errores, setErrores] = useState<Errores>({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);
  const titulo = useRef<HTMLHeadingElement>(null);
  const primerRender = useRef(true);

  // Al cambiar de paso, el foco va al título del paso (los lectores de pantalla anuncian el cambio).
  useEffect(() => {
    if (primerRender.current) {
      primerRender.current = false;
      return;
    }
    titulo.current?.focus();
  }, [paso]);

  const idCampo = (campo: string) => `${id}-${campo}`;

  /** Lleva el foco al primer campo con error. */
  function enfocarPrimerError(errs: Errores, orden: readonly string[]) {
    const primero = orden.find((c) => errs[c]);
    if (primero) requestAnimationFrame(() => document.getElementById(idCampo(primero))?.focus());
  }

  function atributos(campo: (typeof camposPaso1)[number]) {
    return {
      id: idCampo(campo),
      name: campo,
      value: datos[campo],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setDatos((d) => ({ ...d, [campo]: e.target.value })),
      className: "campo",
      "aria-invalid": errores[campo] ? true : undefined,
      "aria-describedby": errores[campo] ? `${idCampo(campo)}-error` : undefined,
    } as const;
  }

  function nuevoTurnstile() {
    setToken(null);
    setVersionTurnstile((v) => v + 1);
  }

  function siguiente(e: React.FormEvent) {
    e.preventDefault();
    const resultado = esquemaDatosPostulante.safeParse(datos);
    if (!resultado.success) {
      const errs = erroresPorCampo(resultado.error);
      setErrores(errs);
      enfocarPrimerError(errs, camposPaso1);
      return;
    }
    setErrores({});
    setPaso(2);
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (enviando) return;
    setErrorGeneral("");

    const errs: Errores = {};
    if (!archivo) errs.archivo = errores.archivo ?? "Adjunta tu CV.";
    if (!token) errs.turnstile = "Completa la verificación.";
    if (!consentimiento) errs.consentimiento = "Necesitamos tu autorización para continuar.";
    if (Object.keys(errs).length > 0 || !archivo || !token) {
      setErrores(errs);
      enfocarPrimerError(errs, ["archivo", "turnstile", "consentimiento"]);
      return;
    }
    setErrores({});
    setEnviando(true);

    try {
      const preparada = await prepararPostulacion({
        ...datos,
        vacanteId: vacante?.id ?? null,
        archivo: { tipo: tipoDeArchivo(archivo) ?? "", tamano: archivo.size },
        consentimiento: true,
        turnstile: token,
        sitioWeb,
      });

      if (!preparada.ok) {
        nuevoTurnstile();
        const campos = preparada.campos ?? {};
        setErrores(campos);
        setErrorGeneral(preparada.error);
        // Si el error es de un dato del paso 1, se vuelve a ese paso para corregirlo.
        if (camposPaso1.some((c) => campos[c])) {
          setPaso(1);
          enfocarPrimerError(campos, camposPaso1);
        }
        return;
      }

      if (!preparada.simulada) {
        const { error: errorSubida } = await clienteNavegador()
          .storage.from(BUCKET_CVS)
          .uploadToSignedUrl(preparada.ruta, preparada.tokenSubida, archivo, {
            contentType: tipoDeArchivo(archivo),
          });
        if (errorSubida) {
          nuevoTurnstile();
          setErrorGeneral("No pudimos subir tu CV. Revisa tu conexión y vuelve a intentarlo.");
          return;
        }

        const confirmada = await confirmarPostulacion(preparada.ticket);
        if (!confirmada.ok) {
          nuevoTurnstile();
          if (confirmada.campos?.archivo) setArchivo(null);
          setErrores(confirmada.campos ?? {});
          setErrorGeneral(confirmada.error);
          return;
        }
      }

      setPaso("listo");
      onTerminado();
    } catch {
      nuevoTurnstile();
      setErrorGeneral("Se perdió la conexión. Revisa tu internet y vuelve a intentarlo.");
    } finally {
      setEnviando(false);
    }
  }

  // ------------------------------------------------------------------ Éxito
  if (paso === "listo") {
    const primerNombre = datos.nombre.trim().split(/\s+/)[0];
    return (
      <div className="mt-6 text-center" role="status">
        <CircleCheck aria-hidden="true" className="mx-auto h-14 w-14 text-turquesa-oscuro" strokeWidth={1.5} />
        <h3 ref={titulo} tabIndex={-1} className="mt-4 text-2xl outline-none">
          ¡Postulación enviada!
        </h3>
        <p className="mt-3 text-texto-suave">
          Gracias, {primerNombre}. Recibimos tu CV{vacante ? ` para ${vacante.titulo}` : ""}. Si tu perfil
          encaja, te llamaremos o escribiremos por WhatsApp.
        </p>
        <button type="button" onClick={onCerrar} className="btn btn-turquesa mt-6">
          Cerrar
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Progreso */}
      <div className="flex gap-2" aria-hidden="true">
        <span className="h-1.5 flex-1 rounded-full bg-[#067d98]" />
        <span className={`h-1.5 flex-1 rounded-full ${paso === 2 ? "bg-[#067d98]" : "bg-linea"}`} />
      </div>
      <h3 ref={titulo} tabIndex={-1} className="mt-4 text-lg outline-none">
        <span className="font-normal text-texto-suave">Paso {paso} de 2: </span>
        {paso === 1 ? "Tus datos" : "Tu CV"}
      </h3>

      {errorGeneral && (
        <p role="alert" className="mt-4 rounded bg-[#fdecea] p-3 text-base text-[#b3261e]">
          {errorGeneral}
        </p>
      )}

      {paso === 1 ? (
        <form onSubmit={siguiente} noValidate className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Campo id={idCampo("nombre")} etiqueta="Nombre completo" error={errores.nombre}>
              <input type="text" autoComplete="name" {...atributos("nombre")} />
            </Campo>
          </div>
          <Campo id={idCampo("telefono")} etiqueta="Teléfono / WhatsApp" error={errores.telefono}>
            <input type="tel" inputMode="tel" autoComplete="tel" placeholder="Ej. 7XXXXXXX" {...atributos("telefono")} />
          </Campo>
          <Campo id={idCampo("celular")} etiqueta="Celular" opcional error={errores.celular}>
            <input type="tel" inputMode="tel" placeholder="Otro número" {...atributos("celular")} />
          </Campo>
          <div className="sm:col-span-2">
            <Campo id={idCampo("correo")} etiqueta="Correo" opcional error={errores.correo}>
              <input type="email" inputMode="email" autoComplete="email" {...atributos("correo")} />
            </Campo>
          </div>
          <Campo id={idCampo("zona")} etiqueta="¿Dónde vives?" error={errores.zona}>
            <select {...atributos("zona")}>
              <option value="" disabled>
                Elige una opción
              </option>
              {zonasPostulante.map((z) => (
                <option key={z}>{z}</option>
              ))}
            </select>
          </Campo>
          <Campo id={idCampo("experiencia")} etiqueta="Experiencia" error={errores.experiencia}>
            <select {...atributos("experiencia")}>
              <option value="" disabled>
                Elige una opción
              </option>
              {experiencias.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Campo>
          <div className="sm:col-span-2">
            <button type="submit" className="btn btn-turquesa w-full sm:w-auto">
              Siguiente
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={enviar} noValidate aria-busy={enviando} className="mt-5 space-y-5">
          <ZonaArchivo
            id={idCampo("archivo")}
            archivo={archivo}
            error={errores.archivo}
            onCambio={(nuevo, problema) => {
              setArchivo(nuevo);
              setErrores((e) => (problema ? { ...e, archivo: problema } : sinError(e, "archivo")));
            }}
          />

          <div>
            <WidgetTurnstile
              key={versionTurnstile}
              idError={errores.turnstile ? idCampo("turnstile") : undefined}
              onToken={(t) => {
                setToken(t);
                if (t) setErrores((e) => sinError(e, "turnstile"));
              }}
              onFallo={() =>
                setErrores((e) => ({
                  ...e,
                  turnstile: "No cargó la verificación. Revisa tu conexión o desactiva el bloqueador y recarga la página.",
                }))
              }
            />
            {/* El widget vive en un iframe: si falta la verificación, el foco va a este mensaje. */}
            {errores.turnstile && (
              <p id={idCampo("turnstile")} tabIndex={-1} className="mt-1.5 text-sm font-bold text-[#b3261e] outline-none">
                {errores.turnstile}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-start gap-3 text-base">
              <input
                id={idCampo("consentimiento")}
                type="checkbox"
                checked={consentimiento}
                onChange={(e) => {
                  setConsentimiento(e.target.checked);
                  if (e.target.checked) setErrores((errs) => sinError(errs, "consentimiento"));
                }}
                aria-invalid={errores.consentimiento ? true : undefined}
                aria-describedby={errores.consentimiento ? `${idCampo("consentimiento")}-error` : undefined}
                className="mt-1 h-5 w-5 shrink-0 accent-[#067d98]"
              />
              <span>{TEXTO_CONSENTIMIENTO}</span>
            </label>
            {errores.consentimiento && (
              <p id={`${idCampo("consentimiento")}-error`} className="mt-1.5 text-sm font-bold text-[#b3261e]">
                {errores.consentimiento}
              </p>
            )}
          </div>

          {/* Honeypot: invisible para personas (y para lectores de pantalla). Si llega lleno, es un bot. */}
          <div aria-hidden="true" className="sr-only">
            <label>
              Sitio web
              <input
                type="text"
                name="sitio_web"
                tabIndex={-1}
                autoComplete="off"
                value={sitioWeb}
                onChange={(e) => setSitioWeb(e.target.value)}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setErrorGeneral("");
                setPaso(1);
              }}
              disabled={enviando}
              className="btn btn-borde disabled:cursor-not-allowed disabled:opacity-60"
            >
              Atrás
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="btn btn-turquesa flex-1 disabled:cursor-wait disabled:opacity-80 sm:flex-none"
            >
              {enviando && <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />}
              {enviando ? "Enviando…" : "Enviar postulación"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
