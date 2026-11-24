import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { FormularioVacante } from "@/components/admin/FormularioVacante";
import { Cargando } from "@/components/admin/Piezas";
import { requerirAdmin } from "@/lib/admin/sesion";
import type { Vacante } from "@/lib/empleos/tipos";

export const metadata: Metadata = { title: "Editar vacante" };

async function Contenido({ params }: { params: PageProps<"/admin/vacantes/[id]">["params"] }) {
  const { supabase } = await requerirAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { data } = await supabase.from("vacantes").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <FormularioVacante vacante={data as Vacante} />;
}

export default function EditarVacante({ params }: PageProps<"/admin/vacantes/[id]">) {
  return (
    <div className="max-w-3xl">
      <Link href="/admin/vacantes" className="enlace inline-flex items-center gap-1.5 text-base">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Vacantes
      </Link>
      <h1 className="mb-6 mt-4 text-3xl font-normal">Editar vacante</h1>
      <Suspense fallback={<Cargando />}>
        <Contenido params={params} />
      </Suspense>
    </div>
  );
}
