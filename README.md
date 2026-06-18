# RisetDiary 📓

Web app untuk **mencatat dan mempertanggungjawabkan progres riset akademik**.
Dipakai oleh peneliti untuk mencatat kegiatan, dan dipantau oleh pembimbing.

> Status: **Semua tahap (1–9) selesai** — siap deploy. Panduan: [DEPLOY.md](DEPLOY.md).

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
| Database | [Prisma](https://www.prisma.io) 7 + PostgreSQL | Driver adapter (`pg`). Pakai [Neon](https://neon.tech) gratis untuk lokal & production |
| Login | Session JWT ([jose](https://github.com/panva/jose)) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Auth email+password native Next 16 — transparan & ringan |
| Tampilan | [Tailwind CSS](https://tailwindcss.com) | Styling cepat lewat class |

## Menjalankan secara lokal

Butuh URL PostgreSQL — cara termudah: buat gratis di [Neon](https://neon.tech).

```bash
cp .env.example .env   # isi DATABASE_URL (Neon) & SESSION_SECRET
npm install            # pasang dependency (otomatis generate Prisma client)
npm run db:migrate     # buat tabel di database
npm run dev            # jalankan server pengembangan
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
- [x] **Tahap 3 — Login & peran**
- [x] **Tahap 4 — Proyek & keanggotaan**: buat proyek, gabung via kode, verifikasi anggota
- [x] **Tahap 5 — Log kegiatan + link bukti**
- [x] **Tahap 6 — Milestone & dashboard progres**
- [x] **Tahap 7 — Pengeluaran + rekap dana**
- [x] **Tahap 8 — Komentar pembimbing**
- [x] **Tahap 9 — Deploy online**: PostgreSQL + panduan di [DEPLOY.md](DEPLOY.md)

## Struktur folder

```
app/              # Halaman & rute (App Router Next.js)
  (auth)/         # Login, daftar, & server actions auth
  dashboard/      # Halaman terproteksi (daftar proyek)
  proyek/         # Buat, gabung, detail proyek & log kegiatan
  layout.tsx      # Kerangka tampilan global
  page.tsx        # Halaman beranda
  generated/      # Prisma client hasil generate (tidak di-commit)
lib/              # Kode bersama
  prisma.ts       # Koneksi database (pola singleton)
  jwt.ts          # Token session (jose) — aman untuk edge
  session.ts      # Cookie session (buat/baca/hapus)
  dal.ts          # Penjaga sesi & data user login
  proyek.ts       # Baca data proyek & keanggotaan
  kode.ts         # Pembuat kode proyek
  constants.ts    # Status, peran, kategori default
prisma/
  schema.prisma   # Definisi model/tabel
  migrations/     # Riwayat perubahan struktur database
proxy.ts          # Proteksi rute (dulu "middleware")
scripts/          # Skrip bantu (mis. cek database)
public/           # Aset statis (gambar, ikon)
```

---

Dibuat sebagai catatan perjalanan riset. Dikembangkan bertahap. 🚀
