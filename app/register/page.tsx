"use client";

import { useActionState } from "react";
import { registerUser } from "../actions/auth";
import Button from "../components/ui/Button";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUser, {
    success: false,
    error: null,
  });

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-stone-200 border border-blue-200 rounded-lg shadow-sm text-black">
      <h2 className="text-xl font-semibold mb-4">Neuen Account anlegen</h2>

      {state?.error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm font-medium text-center">
          {state.error}
        </div>
      )}

      <form
        action={formAction}
        autoComplete="off"
        className="flex flex-col gap-[15px]"
      >
        <input
          name="username"
          type="text"
          placeholder="Benutzername"
          required
          className="p-2 bg-white text-black rounded-lg border border-stone-300"
        />
        <input
          name="email"
          type="email"
          placeholder="E-Mail-Adresse"
          autoComplete="off"
          required
          className="p-2 bg-white text-black rounded-lg border border-stone-300"
        />
        <input
          name="password"
          type="password"
          placeholder="Passwort"
          required
          className="p-2 bg-white text-black rounded-lg border border-stone-300"
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Wird registriert..." : "Registrieren"}
        </Button>
      </form>
    </div>
  );
}
