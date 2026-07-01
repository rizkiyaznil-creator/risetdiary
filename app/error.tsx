"use client";

// Ditampilkan bila sebuah halaman/segmen melempar error tak terduga.
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <span className="text-4xl">⚠️</span>
      <h1 className="text-xl font-semibold">Terjadi kesalahan</h1>
      <p className="max-w-sm text-sm text-zinc-500">
        Maaf, ada yang tidak beres. Coba lagi sebentar.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
      >
        Coba lagi
      </button>
    </main>
  );
}
