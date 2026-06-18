"use client";

import { useActionState } from "react";
import { buatProyek } from "../actions";

export function FormBuat() {
  const [state, action, pending] = useActionState(buatProyek, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Judul proyek
        <input
          name="judul"
          type="text"
          required
          className="rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-blue-500 dark:border-white/20"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Deskripsi (opsional)
        <textarea
          name="deskripsi"
          rows={3}
          className="rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-blue-500 dark:border-white/20"
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
        {pending ? "Menyimpan…" : "Buat proyek"}
      </button>
    </form>
  );
}
