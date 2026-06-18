"use client";

import { useActionState } from "react";
import { tambahMilestone } from "../../../actions";
import { STATUS } from "@/lib/constants";

const kelasInput =
  "rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-blue-500 dark:border-white/20";

export function FormMilestone({ proyekId }: { proyekId: string }) {
  const [state, action, pending] = useActionState(tambahMilestone, undefined);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="proyekId" value={proyekId} />

      <label className="flex flex-col gap-1 text-sm">
        Nama milestone
        <input name="nama" type="text" required className={kelasInput} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Deskripsi (opsional)
        <textarea name="deskripsi" rows={2} className={kelasInput} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Tenggat (opsional)
        <input name="tenggat" type="date" className={kelasInput} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Status
        <select name="status" defaultValue="BELUM" className={kelasInput}>
          {Object.entries(STATUS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
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
        {pending ? "Menyimpan…" : "Simpan milestone"}
      </button>
    </form>
  );
}
