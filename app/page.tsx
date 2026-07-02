import Link from "next/link";
import { userSekarang } from "@/lib/dal";
import { TandaTangan } from "./tanda-tangan";

export default async function Beranda() {
  const user = await userSekarang();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-8 p-8 text-center">
      <div className="flex flex-col items-center gap-3">
        <span className="text-5xl">📓</span>
        <h1 className="text-4xl font-bold tracking-tight">RisetDiary</h1>
        <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          Catat dan pertanggungjawabkan progres riset akademikmu — log
          kegiatan, jurnal, pengeluaran, dan milestone dalam satu tempat.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {user ? (
          <Link
            href="/dashboard"
            className="rounded-full bg-foreground px-6 py-3 font-medium text-background transition-opacity hover:opacity-90"
          >
            Buka Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/daftar"
              className="rounded-full bg-foreground px-6 py-3 font-medium text-background transition-opacity hover:opacity-90"
            >
              Mulai — Daftar
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-black/15 px-6 py-3 font-medium transition-colors hover:bg-black/[.04] dark:border-white/20 dark:hover:bg-white/[.06]"
            >
              Masuk
            </Link>
          </>
        )}
      </div>

      <Link
        href="/tentang"
        className="text-sm text-zinc-500 hover:underline"
      >
        Tentang aplikasi
      </Link>

      <TandaTangan />
    </main>
  );
}
