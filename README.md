# RisetDiary 📓

Web app untuk **mencatat dan mempertanggungjawabkan progres riset akademik**.
Dipakai oleh peneliti untuk mencatat kegiatan, dan dipantau oleh pembimbing.

> Status: **Tahap 1 — Fondasi** (scaffold proyek). Lihat [Roadmap](#roadmap).

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
npm install        # pasang dependency
npm run dev        # jalankan server pengembangan
```

Buka <http://localhost:3000> di browser.

## Roadmap

- [x] **Tahap 1 — Fondasi**: scaffold Next.js + Tailwind
- [ ] **Tahap 2 — Model data**: Proyek, LogKegiatan, Milestone, Pengeluaran, Jurnal, User (Prisma)
- [ ] **Tahap 3 — Login & peran**
- [ ] **Tahap 4 — CRUD log kegiatan + link bukti**
- [ ] **Tahap 5 — Milestone & dashboard progres**
- [ ] **Tahap 6 — Pengeluaran + rekap dana**
- [ ] **Tahap 7 — Akses & komentar pembimbing**
- [ ] **Tahap 8 — Deploy online** (Postgres + hosting)

## Struktur folder

```
app/            # Halaman & rute (App Router Next.js)
  layout.tsx    # Kerangka tampilan global
  page.tsx      # Halaman beranda
  globals.css   # Style global (Tailwind)
public/         # Aset statis (gambar, ikon)
```

---

Dibuat sebagai catatan perjalanan riset. Dikembangkan bertahap. 🚀
