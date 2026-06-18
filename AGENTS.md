<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Proyek: RisetDiary

Web app pencatatan & pertanggungjawaban progres riset akademik (lihat `README.md`).

- **Bahasa komunikasi dengan user: Indonesia.** User sedang belajar — jelaskan tiap bagian, bangun bertahap.
- **Peran:** Peneliti (mengisi) + Pembimbing (memantau & komentar).
- **Fitur inti:** log kegiatan + link bukti · jurnal harian · pengeluaran (informal) · milestone.
- **Bukti dokumen:** cukup simpan URL (mis. Google Drive), bukan upload file.
- **Stack:** Next.js 16 (App Router, TS) · Prisma 7 + PostgreSQL (driver adapter `pg`) · auth email+password native (jose + bcryptjs) · Tailwind v4.
- **Catatan teknis (penting, beda dari dok lama):**
  - Next 16: `middleware.ts` → **`proxy.ts`**; `cookies()`, `params`, `searchParams` kini **async** (wajib `await`).
  - Prisma 7: tanpa engine bawaan → pakai **driver adapter** (`@prisma/adapter-pg`); client di-`generate` ke `app/generated/prisma`; `migrate dev` tidak auto-generate; status/peran disimpan sebagai **teks** (bukan enum).
  - Deploy: Vercel + Neon Postgres; skrip `build` menjalankan `prisma migrate deploy`. Lihat `DEPLOY.md`.
  - Auth: session JWT (`jose`, edge-safe di `lib/jwt.ts`) + cookie httpOnly (`lib/session.ts`) + penjaga di `lib/dal.ts` (`verifikasiSesi` / `userSekarang`).
- **Status & roadmap:** lihat bagian Roadmap di `README.md`.
