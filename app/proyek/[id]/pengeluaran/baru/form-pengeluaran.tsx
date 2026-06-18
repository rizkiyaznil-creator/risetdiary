"use client";

import { useActionState } from "react";
import { tambahPengeluaran } from "../../../actions";

const kelasInput =
  "rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-blue-500 dark:border-white/20";

export function FormPengeluaran({
  proyekId,
  kategoris,
}: {
  proyekId: string;
  kategoris: string[];
}) {
  const [state, action, pending] = useActionState(tambahPengeluaran, undefined);
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
        Keterangan
        <input name="keterangan" type="text" required className={kelasInput} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Kategori
        <input
          name="kategori"
          type="text"
          list="daftar-kategori"
          required
          placeholder="pilih atau ketik baru"
          className={kelasInput}
        />
        <datalist id="daftar-kategori">
          {kategoris.map((k) => (
            <option key={k} value={k} />
          ))}
        </datalist>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Jumlah (Rp)
        <input
          name="jumlah"
          type="text"
          inputMode="numeric"
          required
          placeholder="mis. 50000"
          className={kelasInput}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Link nota/bukti (opsional)
        <input
          name="linkNota"
          type="url"
          placeholder="https://drive.google.com/..."
          className={kelasInput}
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
        {pending ? "Menyimpan…" : "Simpan pengeluaran"}
      </button>
    </form>
  );
}
