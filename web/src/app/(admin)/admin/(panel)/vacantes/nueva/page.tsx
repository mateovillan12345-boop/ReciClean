import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { FormularioVacante } from "@/components/admin/FormularioVacante";
import { Cargando } from "@/components/admin/Piezas";
import { requerirAdmin } from "@/lib/admin/sesion";

export const metadata: Metadata = { title: "Nueva vacante" };

async function Contenido() {
  await requerirAdmin();
  return <FormularioVacante />;
}

export default function NuevaVacante() {
  return (
    <div className="max-w-3xl">
      <Link href="/admin/vacantes" className="enlace inline-flex items-center gap-1.5 text-base">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Vacantes
      </Link>
      <h1 className="mb-6 mt-4 text-3xl font-normal">Nueva vacante</h1>
      <Suspense fallback={<Cargando />}>
        <Contenido />
      </Suspense>
    </div>
  );
}
