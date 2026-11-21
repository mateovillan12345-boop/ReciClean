import { PaginaServicio, metadataServicio } from "@/components/PaginaServicio";

const slug = "limpieza-a-domicilio";

export const metadata = metadataServicio(slug);

export default function Pagina() {
  return <PaginaServicio slug={slug} />;
}
