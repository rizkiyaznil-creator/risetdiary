"use client";

import { useActionState, useState } from "react";
import { tambahPengeluaran } from "../../../actions";

const kelasInput =
  "rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-blue-500 dark:border-white/20";

// Format angka jadi ribuan ala Indonesia: "1000000" -> "1.000.000"
function formatRupiah(nilai: string): string {
  const digit = nilai.replace(/\D/g, "").replace(/^0+/, "");
  if (!digit) return "";
  return digit.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function FormPengeluaran({
  proyekId,
  kategoris,
}: {
  proyekId: string;
  kategoris: string[];
}) {
  const [state, action, pending] = useActionState(tambahPengeluaran, undefined);
  const [jumlah, setJumlah] = useState("");
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
        Jumlah
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
            Rp
          </span>
          <input
            name="jumlah"
            type="text"
            inputMode="numeric"
            required
            value={jumlah}
            onChange={(e) => setJumlah(formatRupiah(e.target.value))}
            placeholder="50.000"
            className={`${kelasInput} w-full pl-9`}
          />
        </div>
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
