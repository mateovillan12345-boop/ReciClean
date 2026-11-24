import type { Metadata } from "next";
import { FormularioLogin } from "@/components/admin/FormularioLogin";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function Login() {
  return (
    <main id="contenido" className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-lg border border-linea bg-white p-8 shadow-sm">
        <p className="font-logo text-2xl font-medium">
          <span className="text-morado-oscuro">Reci</span>
          <span className="text-turquesa-oscuro">Clean</span>
        </p>
        <h1 className="mt-4 text-2xl font-normal">Panel de empleos</h1>
        <p className="mt-1 text-base text-texto-suave">Solo para el equipo de ReciClean.</p>
        <FormularioLogin />
      </div>
    </main>
  );
}
