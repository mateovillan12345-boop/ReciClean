import { PaginaServicio, metadataServicio } from "@/components/PaginaServicio";

const slug = "limpieza-post-obra";

export const metadata = metadataServicio(slug);

export default function Pagina() {
  return <PaginaServicio slug={slug} />;
}
