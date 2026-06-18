import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getProyek, pengeluaranProyek } from "@/lib/proyek";
import { KATEGORI_PENGELUARAN_DEFAULT } from "@/lib/constants";
import { FormPengeluaran } from "./form-pengeluaran";

export default async function HalamanTambahPengeluaran({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getProyek(id);
  if (!data) notFound();

  const { keanggotaan } = data;
  const bisaTulis =
    keanggotaan.status === "TERVERIFIKASI" &&
    (keanggotaan.peran === "PENELITI_UTAMA" ||
      keanggotaan.peran === "PENELITI");
  if (!bisaTulis) redirect(`/proyek/${id}`);

  // Saran kategori = default + kategori yang sudah pernah dipakai di proyek ini.
  const list = await pengeluaranProyek(id);
  const kategoris = Array.from(
    new Set([...KATEGORI_PENGELUARAN_DEFAULT, ...list.map((e) => e.kategori)]),
  );

  return (
    <main className="mx-auto w-full max-w-lg flex-1 p-6">
      <Link
        href={`/proyek/${id}`}
        className="text-sm text-zinc-500 hover:underline"
      >
        ← Kembali ke proyek
      </Link>
      <h1 className="mt-2 mb-6 text-2xl font-semibold">Tambah pengeluaran</h1>
      <FormPengeluaran proyekId={id} kategoris={kategoris} />
    </main>
  );
}
