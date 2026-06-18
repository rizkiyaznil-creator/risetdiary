"use client";

import { useActionState } from "react";
import { gabungProyek } from "../actions";
import { PERAN } from "@/lib/constants";

export function FormGabung() {
  const [state, action, pending] = useActionState(gabungProyek, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Kode proyek
        <input
          name="kode"
          type="text"
          required
          placeholder="mis. RD-7K2P9"
          className="rounded-md border border-black/15 bg-transparent px-3 py-2 uppercase outline-none focus:border-blue-500 dark:border-white/20"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Saya ingin bergabung sebagai
        <select
          name="peran"
          defaultValue="PENELITI"
          className="rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-blue-500 dark:border-white/20"
        >
          <option value="PENELITI">{PERAN.PENELITI}</option>
          <option value="PEMBIMBING">{PERAN.PEMBIMBING}</option>
        </select>
      </label>

      {state?.error && (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-foreground px-4 py-2 font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Memproses…" : "Gabung"}
      </button>
    </form>
  );
}
