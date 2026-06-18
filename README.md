# RisetDiary 📓

Web app untuk **mencatat dan mempertanggungjawabkan progres riset akademik**.
Dipakai oleh peneliti untuk mencatat kegiatan, dan dipantau oleh pembimbing.

> Status: **Tahap 2 — Model data** selesai. Lihat [Roadmap](#roadmap).

## Apa yang dicatat

- **Log kegiatan** — apa yang sudah dilakukan, beserta **link dokumen bukti** (Google Drive, dll)
- **Jurnal harian** — catatan progres & refleksi bebas
- **Pengeluaran** — pencatatan informal, dikategorikan dan dijumlahkan
- **Tugas & milestone** — target dengan tenggat dan status

## Peran pengguna

| Peran | Bisa apa |
|---|---|
| **Peneliti** | Membuat & mengubah semua catatan |
| **Pembimbing** | Memantau progres, melihat pengeluaran, memberi komentar |

## Stack

| Bagian | Alat | Kenapa |
|---|---|---|
| Kerangka web | [Next.js](https://nextjs.org) (App Router, TypeScript) | Frontend + backend/API dalam satu proyek, satu bahasa |
| Database | [Prisma](https://www.prisma.io) + SQLite | Struktur data gampang dibaca; SQLite nol setup untuk belajar. Pindah ke Postgres saat online |
| Login | [Auth.js](https://authjs.dev) | Login & pembeda peran peneliti/pembimbing |
| Tampilan | [Tailwind CSS](https://tailwindcss.com) | Styling cepat lewat class |

## Menjalankan secara lokal

```bash
npm install        # pasang dependency (otomatis generate Prisma client)
npm run dev        # jalankan server pengembangan
```

Buka <http://localhost:3000> di browser.

Perintah database:

```bash
npm run db:migrate   # buat/ubah tabel sesuai prisma/schema.prisma
npm run db:studio    # buka penjelajah data (Prisma Studio)
npm run db:check     # cek koneksi database
```

## Roadmap

- [x] **Tahap 1 — Fondasi**: scaffold Next.js + Tailwind
- [x] **Tahap 2 — Model data**: Proyek, LogKegiatan, Milestone, Pengeluaran, Jurnal, User (Prisma)
- [ ] **Tahap 3 — Login & peran**
- [ ] **Tahap 4 — CRUD log kegiatan + link bukti**
- [ ] **Tahap 5 — Milestone & dashboard progres**
- [ ] **Tahap 6 — Pengeluaran + rekap dana**
- [ ] **Tahap 7 — Akses & komentar pembimbing**
- [ ] **Tahap 8 — Deploy online** (Postgres + hosting)

## Struktur folder

```
app/              # Halaman & rute (App Router Next.js)
  layout.tsx      # Kerangka tampilan global
  page.tsx        # Halaman beranda
  globals.css     # Style global (Tailwind)
  generated/      # Prisma client hasil generate (tidak di-commit)
lib/              # Kode bersama
  prisma.ts       # Koneksi database (pola singleton)
  constants.ts    # Status, peran, kategori default
prisma/
  schema.prisma   # Definisi model/tabel
  migrations/     # Riwayat perubahan struktur database
scripts/          # Skrip bantu (mis. cek database)
public/           # Aset statis (gambar, ikon)
```

---

Dibuat sebagai catatan perjalanan riset. Dikembangkan bertahap. 🚀
