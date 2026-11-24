import { Suspense } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { MenuPanel, MenuPanelCargando } from "@/components/admin/MenuPanel";
import { requerirAdmin } from "@/lib/admin/sesion";
import { cerrarSesion } from "../acciones";

/** Correo del admin + botón de salir. Lee la sesión, por eso va dentro de <Suspense>. */
async function UsuarioPanel() {
  const { usuario } = await requerirAdmin();
  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-texto-suave md:inline">{usuario.correo}</span>
      <form action={cerrarSesion}>
        <button type="submit" className="btn btn-borde min-h-[2.75rem] px-4 text-base">
          <LogOut aria-hidden="true" className="h-4 w-4" />
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}

export default function LayoutPanel({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-linea bg-white">
        <div className="contenedor flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
          <Link href="/admin" className="font-logo text-xl font-medium">
            <span className="text-morado-oscuro">Reci</span>
            <span className="text-turquesa-oscuro">Clean</span>
            <span className="ml-2 font-texto text-sm font-normal text-texto-suave">Panel</span>
          </Link>
          <Suspense fallback={<MenuPanelCargando />}>
            <MenuPanel />
          </Suspense>
          <div className="ml-auto">
            <Suspense fallback={null}>
              <UsuarioPanel />
            </Suspense>
          </div>
        </div>
      </header>
      <main id="contenido" className="flex-1 py-8 md:py-10">
        <div className="contenedor">{children}</div>
      </main>
    </>
  );
}
