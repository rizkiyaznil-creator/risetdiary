"use client";

import { useActionState } from "react";
import { tambahLog } from "../../../actions";
import { STATUS } from "@/lib/constants";

const kelasInput =
  "rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-blue-500 dark:border-white/20";

export function FormLog({
  proyekId,
  milestones,
}: {
  proyekId: string;
  milestones: { id: string; nama: string }[];
}) {
  const [state, action, pending] = useActionState(tambahLog, undefined);
  const hariIni = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="proyekId" value={proyekId} />

      <label className="flex flex-col gap-1 text-sm">
        Tanggal
        <input
          name="tanggal"
          type="date"
          defaultValue={hariIni}
          required
          className={kelasInput}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Judul kegiatan
        <input name="judul" type="text" required className={kelasInput} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Deskripsi (opsional)
        <textarea name="deskripsi" rows={3} className={kelasInput} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Link bukti (opsional)
        <input
          name="linkBukti"
          type="url"
          placeholder="https://drive.google.com/..."
          className={kelasInput}
        />
      </label>

      {milestones.length > 0 && (
        <label className="flex flex-col gap-1 text-sm">
          Kaitkan ke milestone (opsional)
          <select name="milestoneId" defaultValue="" className={kelasInput}>
            <option value="">(tidak terkait)</option>
            {milestones.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nama}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="flex flex-col gap-1 text-sm">
        Status
        <select name="status" defaultValue="BERJALAN" className={kelasInput}>
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
        {pending ? "Menyimpan…" : "Simpan log"}
      </button>
    </form>
  );
}
