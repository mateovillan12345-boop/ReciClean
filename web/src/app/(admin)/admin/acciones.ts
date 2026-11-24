"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requerirAdmin, RUTA_LOGIN } from "@/lib/admin/sesion";
import type { EstadoFormulario } from "@/lib/admin/tipos";
import { ETIQUETA_VACANTES } from "@/lib/empleos/consultas";
import { esquemaLogin, esquemaVacante } from "@/lib/empleos/esquemas";
import { slugDesde } from "@/lib/empleos/texto";
import { BUCKET_CVS, estadosAplicacion, estadosVacante } from "@/lib/empleos/tipos";
import { erroresPorCampo } from "@/lib/formularios";
import { clienteServidor } from "@/lib/supabase/servidor";

// Acciones del panel. Cada una (menos el login) empieza con requerirAdmin(): una Server Action
// se puede llamar directamente por HTTP, así que no basta con que el botón esté en una página protegida.
// Todas usan la sesión del admin, así que además las limita RLS.

const id = z.uuid();
const ERROR_GENERAL = "No se pudo guardar. Inténtalo de nuevo.";

// ------------------------------------------------------------------ Sesión

export async function iniciarSesion(_previo: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  const datos = esquemaLogin.safeParse({ correo: formData.get("correo"), contrasena: formData.get("contrasena") });
  if (!datos.success) return { error: "Revisa los datos.", campos: erroresPorCampo(datos.error) };

  const supabase = await clienteServidor();
  const { error } = await supabase.auth.signInWithPassword({
    email: datos.data.correo,
    password: datos.data.contrasena,
  });
  // Mensaje genérico: no revela si el correo existe.
  if (error) return { error: "Correo o contraseña incorrectos.", correo: datos.data.correo };
  redirect("/admin");
}

export async function cerrarSesion() {
  const supabase = await clienteServidor();
  await supabase.auth.signOut();
  redirect(RUTA_LOGIN);
}

// ------------------------------------------------------------------ Aplicantes

export async function cambiarEstadoAplicacion(_previo: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  const { supabase } = await requerirAdmin();
  const datos = z
    .object({ id, estado: z.enum(estadosAplicacion) })
    .safeParse({ id: formData.get("id"), estado: formData.get("estado") });
  if (!datos.success) return { error: "Estado no válido." };

  const { error } = await supabase.from("aplicaciones").update({ estado: datos.data.estado }).eq("id", datos.data.id);
  if (error) return { error: ERROR_GENERAL };
  refresh(); // vuelve a dibujar la página con el estado nuevo
  return { ok: true, mensaje: "Estado guardado." };
}

export async function eliminarAplicacion(formData: FormData) {
  const { supabase } = await requerirAdmin();
  const idAplicacion = id.parse(formData.get("id"));

  const { data: fila } = await supabase.from("aplicaciones").select("cv_ruta").eq("id", idAplicacion).maybeSingle();
  if (fila) {
    // Primero el archivo y después la fila: si algo falla, no queda un CV sin dueño.
    await supabase.storage.from(BUCKET_CVS).remove([fila.cv_ruta]);
    const { error } = await supabase.from("aplicaciones").delete().eq("id", idAplicacion);
    if (error) throw new Error("No se pudo eliminar la postulación.");
  }
  redirect("/admin?aviso=eliminada");
}

export async function bloquearAplicante(_previo: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  const { supabase } = await requerirAdmin();
  const datos = z
    .object({ id, motivo: z.string().trim().max(300) })
    .safeParse({ id: formData.get("id"), motivo: formData.get("motivo") ?? "" });
  if (!datos.success) return { error: "El motivo puede tener hasta 300 caracteres." };

  const { data: a } = await supabase
    .from("aplicaciones")
    .select("telefono, celular, correo")
    .eq("id", datos.data.id)
    .maybeSingle();
  if (!a) return { error: "La postulación ya no existe." };

  // Una fila por número (y el correo en la primera), así se compara fácil al recibir postulaciones.
  const numeros = [a.telefono, a.celular].filter((n): n is string => Boolean(n));
  const filas = numeros.map((telefono, i) => ({
    telefono,
    correo: i === 0 ? a.correo : null,
    motivo: datos.data.motivo,
  }));
  const { error } = await supabase.from("bloqueados").insert(filas);
  if (error) return { error: ERROR_GENERAL };

  await supabase.from("aplicaciones").update({ estado: "descartado" }).eq("id", datos.data.id);
  refresh();
  return { ok: true, mensaje: "Bloqueado. Sus próximas postulaciones no llegarán al panel." };
}

export async function desbloquearAplicante(formData: FormData) {
  const { supabase } = await requerirAdmin();
  const idAplicacion = id.parse(formData.get("id"));
  const { data: a } = await supabase
    .from("aplicaciones")
    .select("telefono, celular")
    .eq("id", idAplicacion)
    .maybeSingle();
  if (a) {
    const numeros = [a.telefono, a.celular].filter((n): n is string => Boolean(n));
    await supabase.from("bloqueados").delete().in("telefono", numeros);
  }
  redirect(`/admin/aplicantes/${idAplicacion}`);
}

// ------------------------------------------------------------------ Vacantes

/** Slug libre a partir del título: "auxiliar-de-reciclaje", "auxiliar-de-reciclaje-2"... */
async function slugLibre(supabase: Awaited<ReturnType<typeof requerirAdmin>>["supabase"], titulo: string) {
  const base = slugDesde(titulo) || "vacante";
  const { data } = await supabase.from("vacantes").select("slug").like("slug", `${base}%`);
  const usados = new Set((data ?? []).map((v) => v.slug));
  if (!usados.has(base)) return base;
  let n = 2;
  while (usados.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

export async function guardarVacante(_previo: EstadoFormulario, formData: FormData): Promise<EstadoFormulario> {
  const { supabase } = await requerirAdmin();
  const idVacante = formData.get("id");
  const valores = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => typeof v === "string") as [string, string][],
  );
  const datos = esquemaVacante.safeParse(valores);
  // `valores` vuelve al formulario para no borrar lo escrito (React vacía el formulario tras enviarlo).
  if (!datos.success) return { error: "Revisa los campos marcados.", campos: erroresPorCampo(datos.error), valores };
  const fila = { ...datos.data, salario: datos.data.salario ?? null };

  if (idVacante) {
    // Al editar, el slug (la dirección de la página) no cambia, para no romper enlaces ya compartidos.
    const { error } = await supabase.from("vacantes").update(fila).eq("id", id.parse(idVacante));
    if (error) return { error: ERROR_GENERAL, valores };
  } else {
    const slug = await slugLibre(supabase, datos.data.titulo);
    const { error } = await supabase.from("vacantes").insert({ ...fila, slug });
    if (error) return { error: ERROR_GENERAL, valores };
  }

  updateTag(ETIQUETA_VACANTES); // la página pública /empleos se actualiza al instante
  redirect(`/admin/vacantes?aviso=${idVacante ? "editada" : "creada"}`);
}

export async function cambiarEstadoVacante(formData: FormData) {
  const { supabase } = await requerirAdmin();
  const datos = z
    .object({ id, estado: z.enum(estadosVacante) })
    .parse({ id: formData.get("id"), estado: formData.get("estado") });
  const { error } = await supabase.from("vacantes").update({ estado: datos.estado }).eq("id", datos.id);
  if (error) throw new Error("No se pudo cambiar el estado de la vacante.");
  updateTag(ETIQUETA_VACANTES);
  refresh();
}
