import type { Metadata } from "next";

// Panel privado: sin header ni footer del sitio, y que ningún buscador lo indexe.
export const metadata: Metadata = {
  title: { default: "Panel", template: "%s | Panel ReciClean" },
  robots: { index: false, follow: false, nocache: true },
};

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-1 flex-col bg-[#f6f7f9]">{children}</div>;
}
