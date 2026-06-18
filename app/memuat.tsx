// Indikator loading kecil yang dipakai di file-file loading.tsx.
export function Memuat({ teks = "Memuat…" }: { teks?: string }) {
  return (
    <div className="flex flex-1 items-center justify-center p-10 text-sm text-zinc-500">
      <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
      {teks}
    </div>
  );
}
