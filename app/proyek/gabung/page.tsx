import Link from "next/link";
import { verifikasiSesi } from "@/lib/dal";
import { FormGabung } from "./form-gabung";

export default async function HalamanGabung() {
  await verifikasiSesi();

  return (
    <main className="mx-auto w-full max-w-lg flex-1 p-6">
      <Link href="/dashboard" className="text-sm text-zinc-500 hover:underline">
        ← Kembali
      </Link>
      <h1 className="mt-2 mb-1 text-2xl font-semibold">Gabung proyek</h1>
      <p className="mb-6 text-sm text-zinc-500">
        Masukkan kode dari peneliti utama. Permintaanmu akan menunggu
        persetujuan.
      </p>
      <FormGabung />
    </main>
  );
}
