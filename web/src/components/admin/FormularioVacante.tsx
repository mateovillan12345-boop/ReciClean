"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { guardarVacante } from "@/app/(admin)/admin/acciones";
import { Campo } from "@/components/Formularios";
import { areas, estadosVacante, zonasVacante, type Vacante } from "@/lib/empleos/tipos";
import { Aviso, nombreEstadoVacante } from "./Piezas";

const jornadasSugeridas = ["Tiempo completo", "Medio tiempo", "Por turnos", "Fines de semana"];

/** Crear (sin `vacante`) o editar una vacante. */
export function FormularioVacante({ vacante }: { vacante?: Vacante }) {
  const [estado, accion, guardando] = useActionState(guardarVacante, null);
  const errores = estado?.campos ?? {};

  // Valor inicial de cada campo: lo último que se escribió (si hubo error) o lo guardado.
  const inicial: Record<string, string> = estado?.valores ?? {
    titulo: vacante?.titulo ?? "",
    area: vacante?.area ?? "",
    zona: vacante?.zona ?? "",
    jornada: vacante?.jornada ?? "",
    horario: vacante?.horario ?? "",
    tipo_contrato: vacante?.tipo_contrato ?? "",
    salario: vacante?.salario ?? "",
    resumen: vacante?.resumen ?? "",
    descripcion: vacante?.descripcion ?? "",
    responsabilidades: vacante?.responsabilidades.join("\n") ?? "",
    requisitos: vacante?.requisitos.join("\n") ?? "",
    estado: vacante?.estado ?? "activa",
  };

  function attrs(campo: string) {
    const id = `v-${campo}`;
    return {
      id,
      name: campo,
      defaultValue: inicial[campo],
      className: "campo",
      "aria-invalid": errores[campo] ? true : undefined,
      "aria-describedby": [errores[campo] && `${id}-error`, `${id}-ayuda`].filter(Boolean).join(" ") || undefined,
    } as const;
  }

  const ayuda = (campo: string, texto: string) => (
    <p id={`v-${campo}-ayuda`} className="mt-1.5 text-sm text-texto-suave">
      {texto}
    </p>
  );

  return (
    <form action={accion} noValidate className="space-y-6">
      {vacante && <input type="hidden" name="id" value={vacante.id} />}
      {estado?.error && <Aviso tipo="error">{estado.error}</Aviso>}

      <section className="grid gap-5 rounded-lg border border-linea bg-white p-5 md:grid-cols-2 md:p-6">
        <h2 className="text-lg font-semibold md:col-span-2">El puesto</h2>
        <div className="md:col-span-2">
          <Campo id="v-titulo" etiqueta="Título del puesto" error={errores.titulo}>
            <input type="text" maxLength={120} {...attrs("titulo")} />
          </Campo>
          {ayuda(
            "titulo",
            vacante
              ? `Dirección de la página: /empleos/${vacante.slug} (no cambia al editar el título, para no romper enlaces compartidos).`
              : "La dirección de la página se crea sola a partir del título.",
          )}
        </div>
        <Campo id="v-area" etiqueta="Área" error={errores.area}>
          <select {...attrs("area")}>
            <option value="" disabled>
              Elige una opción
            </option>
            {areas.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </Campo>
        <Campo id="v-zona" etiqueta="Zona" error={errores.zona}>
          <select {...attrs("zona")}>
            <option value="" disabled>
              Elige una opción
            </option>
            {zonasVacante.map((z) => (
              <option key={z}>{z}</option>
            ))}
          </select>
        </Campo>
        <Campo id="v-jornada" etiqueta="Jornada" error={errores.jornada}>
          <input type="text" list="jornadas" maxLength={60} {...attrs("jornada")} />
        </Campo>
        <datalist id="jornadas">
          {jornadasSugeridas.map((j) => (
            <option key={j} value={j} />
          ))}
        </datalist>
        <Campo id="v-horario" etiqueta="Horario" error={errores.horario}>
          <input type="text" maxLength={120} placeholder="Ej. Lunes a viernes, 7:00 a 15:00" {...attrs("horario")} />
        </Campo>
        <Campo id="v-tipo_contrato" etiqueta="Tipo de contrato" error={errores.tipo_contrato}>
          <input type="text" maxLength={60} placeholder="Ej. Plazo fijo (1 año)" {...attrs("tipo_contrato")} />
        </Campo>
        <div>
          <Campo id="v-salario" etiqueta="Salario" opcional error={errores.salario}>
            <input type="text" maxLength={60} placeholder="Ej. Bs 3.000 mensuales" {...attrs("salario")} />
          </Campo>
          {ayuda("salario", "Si lo dejas vacío, se muestra “A convenir”.")}
        </div>
      </section>

      <section className="grid gap-5 rounded-lg border border-linea bg-white p-5 md:p-6">
        <h2 className="text-lg font-semibold">Descripción</h2>
        <div>
          <Campo id="v-resumen" etiqueta="Resumen" error={errores.resumen}>
            <textarea rows={2} maxLength={280} {...attrs("resumen")} />
          </Campo>
          {ayuda("resumen", "Una o dos frases. Se ve en la tarjeta de la lista de empleos (máximo 280 caracteres).")}
        </div>
        <Campo id="v-descripcion" etiqueta="Sobre el puesto" error={errores.descripcion}>
          <textarea rows={6} maxLength={4000} {...attrs("descripcion")} />
        </Campo>
        <div>
          <Campo id="v-responsabilidades" etiqueta="Qué harás" opcional error={errores.responsabilidades}>
            <textarea rows={5} {...attrs("responsabilidades")} />
          </Campo>
          {ayuda("responsabilidades", "Una tarea por línea. Cada línea será un punto de la lista.")}
        </div>
        <div>
          <Campo id="v-requisitos" etiqueta="Qué buscamos" opcional error={errores.requisitos}>
            <textarea rows={5} {...attrs("requisitos")} />
          </Campo>
          {ayuda("requisitos", "Un requisito por línea.")}
        </div>
      </section>

      <section className="grid gap-5 rounded-lg border border-linea bg-white p-5 md:grid-cols-2 md:p-6">
        <h2 className="text-lg font-semibold md:col-span-2">Publicación</h2>
        <div>
          <Campo id="v-estado" etiqueta="Estado" error={errores.estado}>
            <select {...attrs("estado")}>
              {estadosVacante.map((e) => (
                <option key={e} value={e}>
                  {nombreEstadoVacante[e]}
                </option>
              ))}
            </select>
          </Campo>
          {ayuda("estado", "Solo las vacantes activas se ven en la página de empleos.")}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={guardando} className="btn btn-turquesa disabled:opacity-80">
          {guardando && <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />}
          {guardando ? "Guardando…" : vacante ? "Guardar cambios" : "Publicar vacante"}
        </button>
        <Link href="/admin/vacantes" className="btn btn-borde">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
