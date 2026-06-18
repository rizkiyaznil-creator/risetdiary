import Link from "next/link";
import { verifikasiSesi } from "@/lib/dal";
import { FormBuat } from "./form-buat";

export default async function HalamanBuatProyek() {
  await verifikasiSesi();

  return (
    <main className="mx-auto w-full max-w-lg flex-1 p-6">
      <Link href="/dashboard" className="text-sm text-zinc-500 hover:underline">
        ← Kembali
      </Link>
      <h1 className="mt-2 mb-6 text-2xl font-semibold">Buat proyek baru</h1>
      <FormBuat />
    </main>
  );
}
