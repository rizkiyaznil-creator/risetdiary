import Link from "next/link";

// Ditampilkan untuk 404 — termasuk saat mengakses proyek yang bukan milikmu.
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <span className="text-4xl">🔍</span>
      <h1 className="text-xl font-semibold">Halaman tidak ditemukan</h1>
      <p className="max-w-sm text-sm text-zinc-500">
        Halaman yang kamu cari tidak ada, atau kamu tidak punya akses ke proyek
        ini.
      </p>
      <Link
        href="/dashboard"
        className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
      >
        Ke Dashboard
      </Link>
    </main>
  );
}
