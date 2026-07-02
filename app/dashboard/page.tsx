import Link from "next/link";
import { verifikasiSesi, userSekarang } from "@/lib/dal";
import { proyekSaya } from "@/lib/proyek";
import { keluar } from "../(auth)/actions";
import { TandaTangan } from "../tanda-tangan";
import {
  PERAN,
  STATUS_KEANGGOTAAN,
  type PeranKey,
  type StatusKeanggotaanKey,
} from "@/lib/constants";

export default async function HalamanDashboard() {
  // Penjaga utama: alihkan ke /login bila belum masuk.
  await verifikasiSesi();
  const [user, daftar] = await Promise.all([userSekarang(), proyekSaya()]);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Halo, {user?.nama} 👋</h1>
          <p className="text-sm text-zinc-500">{user?.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/tentang"
            className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/[.04] dark:border-white/20 dark:hover:bg-white/[.06]"
          >
            Tentang
          </Link>
          <form action={keluar}>
            <button
              type="submit"
              className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/[.04] dark:border-white/20 dark:hover:bg-white/[.06]"
            >
              Keluar
            </button>
          </form>
        </div>
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Proyek Saya</h2>
          <div className="flex gap-2">
            <Link
              href="/proyek/gabung"
              className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/[.04] dark:border-white/20 dark:hover:bg-white/[.06]"
            >
              Gabung via kode
            </Link>
            <Link
              href="/proyek/baru"
              className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90"
            >
              + Buat proyek
            </Link>
          </div>
        </div>

        {daftar.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/15 p-8 text-center text-zinc-500 dark:border-white/20">
            <p>Belum ada proyek.</p>
            <p className="mt-1 text-sm">
              Buat proyek baru atau gabung lewat kode.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {daftar.map((k) => (
              <li key={k.id}>
                <Link
                  href={`/proyek/${k.proyekId}`}
                  className="flex items-center gap-3 rounded-lg border border-black/10 p-4 transition-colors hover:bg-black/[.03] dark:border-white/15 dark:hover:bg-white/[.04]"
                >
                  <div className="min-w-0">
                    <h3 className="truncate font-medium">{k.proyek.judul}</h3>
                    <p className="truncate text-sm text-zinc-500">
                      {PERAN[k.peran as PeranKey] ?? k.peran}
                    </p>
                  </div>
                  <span
                    className={`ml-auto shrink-0 rounded-full px-2.5 py-0.5 text-xs ${
                      k.status === "TERVERIFIKASI"
                        ? "bg-green-500/15 text-green-700 dark:text-green-400"
                        : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    {STATUS_KEANGGOTAAN[k.status as StatusKeanggotaanKey] ??
                      k.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <TandaTangan className="mt-10" />
    </main>
  );
}
