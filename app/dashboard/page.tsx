import { verifikasiSesi, userSekarang } from "@/lib/dal";
import { keluar } from "../(auth)/actions";

export default async function HalamanDashboard() {
  // Penjaga utama: alihkan ke /login bila belum masuk.
  await verifikasiSesi();
  const user = await userSekarang();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Halo, {user?.nama} 👋</h1>
          <p className="text-sm text-zinc-500">{user?.email}</p>
        </div>
        <form action={keluar}>
          <button
            type="submit"
            className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/[.04] dark:border-white/20 dark:hover:bg-white/[.06]"
          >
            Keluar
          </button>
        </form>
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-black/15 p-8 text-center text-zinc-500 dark:border-white/20">
        <p>
          Ini dashboard-mu. Daftar proyek, log kegiatan, pengeluaran, dan
          milestone akan muncul di sini.
        </p>
        <p className="mt-1 text-sm">
          (Tahap berikutnya: membuat &amp; mengelola proyek riset.)
        </p>
      </div>
    </main>
  );
}
