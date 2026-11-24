"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { iniciarSesion } from "@/app/(admin)/admin/acciones";
import { Campo } from "@/components/Formularios";

export function FormularioLogin() {
  const [estado, accion, enviando] = useActionState(iniciarSesion, null);
  const campos = estado?.campos ?? {};

  return (
    <form action={accion} noValidate className="mt-6 space-y-5">
      {estado?.error && !estado.campos && (
        <p role="alert" className="rounded bg-[#fdecea] p-3 text-base text-[#b3261e]">
          {estado.error}
        </p>
      )}
      <Campo id="login-correo" etiqueta="Correo" error={campos.correo}>
        <input
          id="login-correo"
          name="correo"
          type="email"
          autoComplete="username"
          defaultValue={estado?.correo}
          required
          className="campo"
          aria-invalid={campos.correo ? true : undefined}
          aria-describedby={campos.correo ? "login-correo-error" : undefined}
        />
      </Campo>
      <Campo id="login-contrasena" etiqueta="Contraseña" error={campos.contrasena}>
        <input
          id="login-contrasena"
          name="contrasena"
          type="password"
          autoComplete="current-password"
          required
          className="campo"
          aria-invalid={campos.contrasena ? true : undefined}
          aria-describedby={campos.contrasena ? "login-contrasena-error" : undefined}
        />
      </Campo>
      <button type="submit" disabled={enviando} className="btn btn-turquesa w-full disabled:opacity-80">
        {enviando && <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />}
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
