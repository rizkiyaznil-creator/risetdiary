import Link from "next/link";
import { notFound } from "next/navigation";
import { getProyek, anggotaProyek } from "@/lib/proyek";
import { PERAN, type PeranKey } from "@/lib/constants";
import { setujuiAnggota, tolakAnggota, resetKode } from "../actions";

const labelPeran = (p: string) => PERAN[p as PeranKey] ?? p;

export default async function HalamanProyek({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // params async di Next 16
  const data = await getProyek(id);
  if (!data) notFound();

  const { proyek, keanggotaan } = data;

  // Belum terverifikasi → tampilkan status, sembunyikan isi proyek.
  if (keanggotaan.status !== "TERVERIFIKASI") {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 p-6">
        <Link href="/dashboard" className="text-sm text-zinc-500 hover:underline">
          ← Dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">{proyek.judul}</h1>
        <div className="mt-6 rounded-xl border border-black/10 p-6 dark:border-white/15">
          {keanggotaan.status === "MENUNGGU" ? (
            <p>
              ⏳ Permintaanmu sebagai <b>{labelPeran(keanggotaan.peran)}</b>{" "}
              sedang menunggu persetujuan peneliti utama.
            </p>
          ) : (
            <p>❌ Permintaanmu untuk bergabung ditolak.</p>
          )}
        </div>
      </main>
    );
  }

  const utama = keanggotaan.peran === "PENELITI_UTAMA";
  const anggota = utama ? await anggotaProyek(id) : [];
  const menunggu = anggota.filter((a) => a.status === "MENUNGGU");
  const aktif = anggota.filter((a) => a.status === "TERVERIFIKASI");

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 p-6">
      <Link href="/dashboard" className="text-sm text-zinc-500 hover:underline">
        ← Dashboard
      </Link>

      <div className="mt-2 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">{proyek.judul}</h1>
          {proyek.deskripsi && (
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              {proyek.deskripsi}
            </p>
          )}
        </div>
        <span className="shrink-0 rounded-full border border-black/15 px-3 py-1 text-xs dark:border-white/20">
          {labelPeran(keanggotaan.peran)}
        </span>
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-black/15 p-6 text-center text-zinc-500 dark:border-white/20">
        Log kegiatan, milestone, dan pengeluaran akan muncul di sini (tahap
        berikutnya).
      </div>

      {utama && (
        <>
          <section className="mt-8">
            <h2 className="mb-2 text-lg font-semibold">Kode proyek</h2>
            <div className="flex items-center gap-3 rounded-xl border border-black/10 p-4 dark:border-white/15">
              <code className="text-lg font-bold tracking-wider">
                {proyek.kode}
              </code>
              <form action={resetKode} className="ml-auto">
                <input type="hidden" name="proyekId" value={proyek.id} />
                <button className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/[.04] dark:border-white/20 dark:hover:bg-white/[.06]">
                  Reset kode
                </button>
              </form>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Bagikan kode ini agar peneliti/pembimbing lain bisa mengajukan
              gabung.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="mb-2 text-lg font-semibold">
              Permintaan bergabung{menunggu.length > 0 && ` (${menunggu.length})`}
            </h2>
            {menunggu.length === 0 ? (
              <p className="text-sm text-zinc-500">Tidak ada permintaan.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {menunggu.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center gap-3 rounded-lg border border-black/10 p-3 dark:border-white/15"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{a.user.nama}</p>
                      <p className="truncate text-xs text-zinc-500">
                        {a.user.email} · minta jadi {labelPeran(a.peran)}
                      </p>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <form action={setujuiAnggota}>
                        <input type="hidden" name="keanggotaanId" value={a.id} />
                        <button className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90">
                          Setujui
                        </button>
                      </form>
                      <form action={tolakAnggota}>
                        <input type="hidden" name="keanggotaanId" value={a.id} />
                        <button className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/[.04] dark:border-white/20 dark:hover:bg-white/[.06]">
                          Tolak
                        </button>
                      </form>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mt-8">
            <h2 className="mb-2 text-lg font-semibold">
              Anggota ({aktif.length})
            </h2>
            <ul className="flex flex-col gap-2">
              {aktif.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center gap-3 rounded-lg border border-black/10 p-3 dark:border-white/15"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{a.user.nama}</p>
                    <p className="truncate text-xs text-zinc-500">
                      {a.user.email}
                    </p>
                  </div>
                  <span className="ml-auto rounded-full border border-black/15 px-2.5 py-0.5 text-xs dark:border-white/20">
                    {labelPeran(a.peran)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </main>
  );
}
