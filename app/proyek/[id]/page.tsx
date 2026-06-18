import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProyek,
  anggotaProyek,
  logProyek,
  milestoneProyek,
  pengeluaranProyek,
} from "@/lib/proyek";
import { PERAN, STATUS, type PeranKey, type StatusKey } from "@/lib/constants";
import {
  setujuiAnggota,
  tolakAnggota,
  resetKode,
  hapusLog,
  ubahStatusLog,
  ubahStatusMilestone,
  hapusMilestone,
  hapusPengeluaran,
} from "../actions";
import { StatusSelect } from "./status-select";

const labelPeran = (p: string) => PERAN[p as PeranKey] ?? p;

const kelasBadgeStatus = (s: string) =>
  s === "SELESAI"
    ? "bg-green-500/15 text-green-700 dark:text-green-400"
    : s === "BERJALAN"
      ? "bg-blue-500/15 text-blue-700 dark:text-blue-400"
      : "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400";

const fmtTanggal = (d: Date) =>
  d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const rupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;

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
  const bisaTulis = utama || keanggotaan.peran === "PENELITI";
  const log = await logProyek(id);
  const milestones = await milestoneProyek(id);
  const pengeluaran = await pengeluaranProyek(id);
  const totalPengeluaran = pengeluaran.reduce((s, e) => s + e.jumlah, 0);
  const rekapKategori = Object.entries(
    pengeluaran.reduce<Record<string, number>>((acc, e) => {
      acc[e.kategori] = (acc[e.kategori] ?? 0) + e.jumlah;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  const anggota = utama ? await anggotaProyek(id) : [];
  const menunggu = anggota.filter((a) => a.status === "MENUNGGU");
  const aktif = anggota.filter((a) => a.status === "TERVERIFIKASI");

  const totalM = milestones.length;
  const selesaiM = milestones.filter((m) => m.status === "SELESAI").length;
  const persen = totalM ? Math.round((selesaiM / totalM) * 100) : 0;

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

      {/* ===== Ringkasan progres ===== */}
      {totalM > 0 && (
        <div className="mt-6">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium">Progres milestone</span>
            <span className="text-zinc-500">
              {selesaiM}/{totalM} selesai ({persen}%)
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/15">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${persen}%` }}
            />
          </div>
        </div>
      )}

      {/* ===== Milestone ===== */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Milestone</h2>
          {bisaTulis && (
            <Link
              href={`/proyek/${id}/milestone/baru`}
              className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/[.04] dark:border-white/20 dark:hover:bg-white/[.06]"
            >
              + Tambah milestone
            </Link>
          )}
        </div>

        {milestones.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/15 p-6 text-center text-sm text-zinc-500 dark:border-white/20">
            Belum ada milestone.
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {milestones.map((m) => (
              <li
                key={m.id}
                className="rounded-lg border border-black/10 p-4 dark:border-white/15"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-medium">{m.nama}</h3>
                    <p className="text-xs text-zinc-500">
                      {m.tenggat
                        ? `Tenggat ${fmtTanggal(m.tenggat)}`
                        : "Tanpa tenggat"}{" "}
                      · {m._count.logKegiatan} log
                    </p>
                  </div>
                  {bisaTulis ? (
                    <StatusSelect
                      action={ubahStatusMilestone}
                      idName="milestoneId"
                      idValue={m.id}
                      status={m.status}
                    />
                  ) : (
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs ${kelasBadgeStatus(m.status)}`}
                    >
                      {STATUS[m.status as StatusKey] ?? m.status}
                    </span>
                  )}
                </div>
                {m.deskripsi && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-400">
                    {m.deskripsi}
                  </p>
                )}
                {bisaTulis && (
                  <form action={hapusMilestone} className="mt-2">
                    <input type="hidden" name="milestoneId" value={m.id} />
                    <button className="text-sm text-red-600 hover:underline dark:text-red-400">
                      Hapus
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ===== Log Kegiatan ===== */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Log Kegiatan</h2>
          {bisaTulis && (
            <Link
              href={`/proyek/${id}/log/baru`}
              className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90"
            >
              + Tambah log
            </Link>
          )}
        </div>

        {log.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/15 p-8 text-center text-zinc-500 dark:border-white/20">
            Belum ada log kegiatan.
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {log.map((l) => (
              <li
                key={l.id}
                className="rounded-lg border border-black/10 p-4 dark:border-white/15"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-medium">{l.judul}</h3>
                    <p className="text-xs text-zinc-500">
                      {fmtTanggal(l.tanggal)} · {l.penulis.nama}
                      {l.milestone && <> · 🎯 {l.milestone.nama}</>}
                    </p>
                  </div>
                  {bisaTulis ? (
                    <StatusSelect
                      action={ubahStatusLog}
                      idName="logId"
                      idValue={l.id}
                      status={l.status}
                    />
                  ) : (
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs ${kelasBadgeStatus(l.status)}`}
                    >
                      {STATUS[l.status as StatusKey] ?? l.status}
                    </span>
                  )}
                </div>

                {l.deskripsi && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-400">
                    {l.deskripsi}
                  </p>
                )}

                <div className="mt-2 flex items-center gap-4">
                  {l.linkBukti && (
                    <a
                      href={l.linkBukti}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                      🔗 Lihat bukti
                    </a>
                  )}
                  {bisaTulis && (l.penulisId === keanggotaan.userId || utama) && (
                    <form action={hapusLog}>
                      <input type="hidden" name="logId" value={l.id} />
                      <button className="text-sm text-red-600 hover:underline dark:text-red-400">
                        Hapus
                      </button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ===== Pengeluaran ===== */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Pengeluaran</h2>
          {bisaTulis && (
            <Link
              href={`/proyek/${id}/pengeluaran/baru`}
              className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90"
            >
              + Tambah pengeluaran
            </Link>
          )}
        </div>

        {pengeluaran.length === 0 ? (
          <div className="rounded-xl border border-dashed border-black/15 p-8 text-center text-zinc-500 dark:border-white/20">
            Belum ada pengeluaran.
          </div>
        ) : (
          <>
            <div className="mb-3 rounded-xl border border-black/10 p-4 dark:border-white/15">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Total pengeluaran</span>
                <span className="text-lg font-semibold">
                  {rupiah(totalPengeluaran)}
                </span>
              </div>
              <div className="mt-3 flex flex-col gap-1">
                {rekapKategori.map(([kat, jml]) => (
                  <div
                    key={kat}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {kat}
                    </span>
                    <span>{rupiah(jml)}</span>
                  </div>
                ))}
              </div>
            </div>

            <ul className="flex flex-col gap-2">
              {pengeluaran.map((e) => (
                <li
                  key={e.id}
                  className="flex items-start gap-3 rounded-lg border border-black/10 p-3 dark:border-white/15"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{e.keterangan}</p>
                    <p className="text-xs text-zinc-500">
                      {fmtTanggal(e.tanggal)} ·{" "}
                      <span className="rounded-full bg-black/[.05] px-2 py-0.5 dark:bg-white/[.08]">
                        {e.kategori}
                      </span>
                    </p>
                    {e.linkNota && (
                      <a
                        href={e.linkNota}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                      >
                        🔗 Lihat nota
                      </a>
                    )}
                  </div>
                  <div className="ml-auto flex shrink-0 flex-col items-end gap-1">
                    <span className="font-medium">{rupiah(e.jumlah)}</span>
                    {bisaTulis && (
                      <form action={hapusPengeluaran}>
                        <input
                          type="hidden"
                          name="pengeluaranId"
                          value={e.id}
                        />
                        <button className="text-xs text-red-600 hover:underline dark:text-red-400">
                          Hapus
                        </button>
                      </form>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

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
              Permintaan bergabung
              {menunggu.length > 0 && ` (${menunggu.length})`}
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
