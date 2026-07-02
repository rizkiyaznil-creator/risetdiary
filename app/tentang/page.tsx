import Link from "next/link";
import type { Metadata } from "next";
import { PwaButtons } from "../pwa-buttons";
import { TandaTangan } from "../tanda-tangan";

export const metadata: Metadata = {
  title: "Tentang — RisetDiary",
};

export default function HalamanTentang() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 p-6">
      <Link href="/" className="text-sm text-zinc-500 hover:underline">
        ← Beranda
      </Link>

      <header className="mt-3 flex items-center gap-3">
        <span className="text-4xl">📓</span>
        <div>
          <h1 className="text-2xl font-semibold">Tentang RisetDiary</h1>
          <p className="text-sm text-zinc-500">
            Catatan &amp; pertanggungjawaban progres riset akademik
          </p>
        </div>
      </header>

      <section className="mt-6 text-zinc-700 dark:text-zinc-300">
        <p>
          <b>RisetDiary</b> membantu peneliti mencatat perjalanan risetnya — apa
          yang sudah dikerjakan beserta buktinya, target (milestone), serta
          pengeluaran — dalam satu tempat yang bisa dipantau pembimbing.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 font-semibold">Fitur utama</h2>
        <ul className="flex flex-col gap-1.5 text-sm text-zinc-700 dark:text-zinc-300">
          <li>📝 <b>Log kegiatan</b> + link dokumen bukti (mis. Google Drive)</li>
          <li>🎯 <b>Milestone</b> dengan tenggat &amp; bar progres</li>
          <li>💰 <b>Pengeluaran</b> per kategori + rekap total</li>
          <li>💬 <b>Komentar</b> untuk diskusi dengan pembimbing</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 font-semibold">Peran</h2>
        <ul className="flex flex-col gap-1.5 text-sm text-zinc-700 dark:text-zinc-300">
          <li>
            <b>Peneliti utama</b> — membuat proyek, mengelola &amp;
            memverifikasi anggota, serta mengubah/menghapus catatan.
          </li>
          <li>
            <b>Peneliti anggota</b> — menambah log, milestone, dan pengeluaran.
          </li>
          <li>
            <b>Pembimbing</b> — memantau progres &amp; memberi komentar.
          </li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 font-semibold">Cara penggunaan</h2>
        <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          <li>
            <b>Daftar</b> akun (email &amp; password), lalu <b>masuk</b>.
          </li>
          <li>
            <b>Buat proyek</b> — kamu otomatis jadi peneliti utama dan mendapat{" "}
            <b>kode proyek</b>.
          </li>
          <li>
            <b>Bagikan kode</b> ke rekan/pembimbing. Mereka pilih menu{" "}
            <b>Gabung</b>, masukkan kode, lalu memilih peran.
          </li>
          <li>
            Sebagai peneliti utama, <b>setujui</b> permintaan bergabung di
            halaman proyek.
          </li>
          <li>
            <b>Catat</b> log kegiatan (+ link bukti), milestone, dan
            pengeluaran.
          </li>
          <li>
            <b>Pantau</b> progres milestone &amp; rekap dana; pembimbing memberi
            komentar.
          </li>
        </ol>
      </section>

      <section className="mt-8 rounded-xl border border-black/10 p-5 dark:border-white/15">
        <h2 className="font-semibold">Pasang &amp; bagikan aplikasi</h2>
        <p className="mb-3 mt-1 text-sm text-zinc-500">
          Pasang RisetDiary ke layar utama HP/desktop, atau bagikan tautannya ke
          rekan dan pembimbing.
        </p>
        <PwaButtons />
      </section>

      <TandaTangan className="mt-10" />
    </main>
  );
}
