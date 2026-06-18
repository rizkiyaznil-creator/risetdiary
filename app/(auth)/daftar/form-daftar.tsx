"use client";

import { useActionState } from "react";
import { daftar } from "../actions";
import { InputPassword } from "../input-password";

export function FormDaftar() {
  const [state, action, pending] = useActionState(daftar, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Nama
        <input
          name="nama"
          type="text"
          required
          autoComplete="name"
          className="rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-blue-500 dark:border-white/20"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-blue-500 dark:border-white/20"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Password
        <InputPassword
          name="password"
          required
          minLength={6}
          autoComplete="new-password"
        />
      </label>

      {state?.error && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-foreground px-4 py-2 font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Memproses…" : "Daftar"}
      </button>
    </form>
  );
}
