"use client";

import { useActionState } from "react";
import { Ban, Trash2 } from "lucide-react";
import { bloquearAplicante, cambiarEstadoAplicacion, eliminarAplicacion } from "@/app/(admin)/admin/acciones";
import { estadosAplicacion, type EstadoAplicacion } from "@/lib/empleos/tipos";
import { DialogoConfirmar } from "./DialogoConfirmar";
import { Aviso, nombreEstadoAplicacion } from "./Piezas";

/** Selector del estado de la postulación (Nuevo, Revisado, Entrevista, Descartado). */
export function FormularioEstado({ id, estado }: { id: string; estado: EstadoAplicacion }) {
  const [resultado, accion, guardando] = useActionState(cambiarEstadoAplicacion, null);
  return (
    <form action={accion} className="space-y-3">
      <input type="hidden" name="id" value={id} />
      <label htmlFor="estado-aplicacion" className="block text-sm font-medium">
        Estado de la postulación
      </label>
      <div className="flex gap-2">
        {/* key: si el estado cambia en el servidor, el select se vuelve a crear con el valor nuevo */}
        <select key={estado} id="estado-aplicacion" name="estado" defaultValue={estado} className="campo">
          {estadosAplicacion.map((e) => (
            <option key={e} value={e}>
              {nombreEstadoAplicacion[e]}
            </option>
          ))}
        </select>
        <button type="submit" disabled={guardando} className="btn btn-turquesa min-h-[3rem] shrink-0 px-5 disabled:opacity-80">
          {guardando ? "Guardando…" : "Guardar"}
        </button>
      </div>
      {resultado?.error && <Aviso tipo="error">{resultado.error}</Aviso>}
      {resultado?.ok && <Aviso>{resultado.mensaje}</Aviso>}
    </form>
  );
}

/** Bloquear (con motivo) y eliminar, cada uno con su ventana de confirmación. */
export function ZonaCuidado({ id, nombre, bloqueado }: { id: string; nombre: string; bloqueado: boolean }) {
  const [resultado, accionBloquear] = useActionState(bloquearAplicante, null);

  return (
    <div className="space-y-3">
      {resultado?.error && <Aviso tipo="error">{resultado.error}</Aviso>}
      {resultado?.ok && <Aviso>{resultado.mensaje}</Aviso>}
      <div className="flex flex-wrap gap-3">
        {!bloqueado && (
          <DialogoConfirmar
            textoBoton={
              <>
                <Ban aria-hidden="true" className="h-4 w-4" />
                Bloquear
              </>
            }
            titulo={`¿Bloquear a ${nombre}?`}
            descripcion="Sus próximas postulaciones (con este teléfono, celular o correo) no llegarán al panel. La persona no verá ningún aviso. Esta postulación pasa a “Descartado”."
            textoConfirmar="Bloquear"
            peligro
            accion={accionBloquear}
            ocultos={{ id }}
            cerrarAlTerminar={resultado}
          >
            <label htmlFor="motivo-bloqueo" className="mb-1.5 block text-base font-medium">
              Motivo <span className="font-normal text-texto-suave">(opcional, solo lo ve el equipo)</span>
            </label>
            <textarea id="motivo-bloqueo" name="motivo" rows={3} maxLength={300} className="campo" />
          </DialogoConfirmar>
        )}
        <DialogoConfirmar
          textoBoton={
            <>
              <Trash2 aria-hidden="true" className="h-4 w-4" />
              Eliminar
            </>
          }
          claseBoton="btn border-[#b3261e] text-[#b3261e] hover:bg-[#b3261e] hover:text-white"
          titulo={`¿Eliminar la postulación de ${nombre}?`}
          descripcion="Se borran sus datos y su CV. No se puede deshacer."
          textoConfirmar="Eliminar"
          peligro
          accion={eliminarAplicacion}
          ocultos={{ id }}
        />
      </div>
    </div>
  );
}
