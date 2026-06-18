import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getProyek } from "@/lib/proyek";
import { FormLog } from "./form-log";

export default async function HalamanTambahLog({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getProyek(id);
  if (!data) notFound();

  // Hanya peneliti (utama/anggota) terverifikasi yang boleh menambah log.
  const { keanggotaan } = data;
  const bisaTulis =
    keanggotaan.status === "TERVERIFIKASI" &&
    (keanggotaan.peran === "PENELITI_UTAMA" ||
      keanggotaan.peran === "PENELITI");
  if (!bisaTulis) redirect(`/proyek/${id}`);

  return (
    <main className="mx-auto w-full max-w-lg flex-1 p-6">
      <Link
        href={`/proyek/${id}`}
        className="text-sm text-zinc-500 hover:underline"
      >
        ← Kembali ke proyek
      </Link>
      <h1 className="mt-2 mb-6 text-2xl font-semibold">Tambah log kegiatan</h1>
      <FormLog proyekId={id} />
    </main>
  );
}
