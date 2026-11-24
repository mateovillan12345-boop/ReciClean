import Link from "next/link";

export default function NoEncontradoPanel() {
  return (
    <div className="rounded-lg border border-linea bg-white px-6 py-12 text-center">
      <h1 className="text-2xl font-normal">No encontramos esa página</h1>
      <p className="mt-2 text-texto-suave">Puede que la postulación o la vacante ya se haya eliminado.</p>
      <Link href="/admin" className="btn btn-turquesa mt-6">
        Volver a aplicantes
      </Link>
    </div>
  );
}
