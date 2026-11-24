import { Briefcase, CalendarDays, Clock, MapPin, Wallet, type LucideIcon } from "lucide-react";
import type { Vacante } from "@/lib/empleos/tipos";
import { BotonPostular } from "./BotonPostular";

function Dato({ icono: Icono, etiqueta, valor }: { icono: LucideIcon; etiqueta: string; valor: string }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <Icono aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-turquesa-oscuro" strokeWidth={1.75} />
      <div>
        <dt className="text-sm text-texto-suave">{etiqueta}</dt>
        <dd className="font-medium">{valor}</dd>
      </div>
    </div>
  );
}

/** Tarjeta de resumen del detalle de vacante: fija al hacer scroll en escritorio, arriba en celular. */
export function ResumenVacante({ vacante: v }: { vacante: Vacante }) {
  return (
    <aside aria-label="Resumen de la vacante" className="rounded-lg border border-linea bg-white p-6 shadow-sm">
      <dl className="divide-y divide-linea">
        <Dato icono={Wallet} etiqueta="Salario" valor={v.salario ?? "A convenir"} />
        <Dato icono={Clock} etiqueta="Horario" valor={v.horario} />
        <Dato icono={CalendarDays} etiqueta="Jornada" valor={v.jornada} />
        <Dato icono={Briefcase} etiqueta="Contrato" valor={v.tipo_contrato} />
        <Dato icono={MapPin} etiqueta="Zona" valor={v.zona} />
      </dl>
      <BotonPostular vacante={{ id: v.id, titulo: v.titulo }} className="mt-5 w-full">
        Postular ahora
      </BotonPostular>
      <p className="mt-3 text-center text-sm text-texto-suave">Toma 2 minutos. Necesitas tu CV.</p>
    </aside>
  );
}
