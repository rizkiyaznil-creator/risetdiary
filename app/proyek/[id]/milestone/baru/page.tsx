import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getProyek } from "@/lib/proyek";
import { FormMilestone } from "./form-milestone";

export default async function HalamanTambahMilestone({
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

  return (
    <main className="mx-auto w-full max-w-lg flex-1 p-6">
      <Link
        href={`/proyek/${id}`}
        className="text-sm text-zinc-500 hover:underline"
      >
        ← Kembali ke proyek
      </Link>
      <h1 className="mt-2 mb-6 text-2xl font-semibold">Tambah milestone</h1>
      <FormMilestone proyekId={id} />
    </main>
  );
}
