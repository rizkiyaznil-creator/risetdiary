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
- **Stack:** Next.js (App Router, TS) · Prisma + SQLite (→ Postgres saat deploy) · Auth.js · Tailwind.
- **Status & roadmap:** lihat bagian Roadmap di `README.md`.
