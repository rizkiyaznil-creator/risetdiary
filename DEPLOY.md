# Deploy RisetDiary ke Online

Panduan men-deploy ke **Vercel** (hosting) + **Neon** (PostgreSQL). Keduanya
punya paket **gratis** yang cukup untuk mulai.

> Saat build, Vercel otomatis menjalankan `prisma migrate deploy` sehingga
> tabel database dibuat tanpa langkah manual.

## 1. Siapkan database PostgreSQL (Neon)

1. Daftar di <https://neon.tech> (bisa pakai akun GitHub).
2. Buat **Project** baru — otomatis dapat satu database.
3. Salin **connection string**-nya. Bentuknya:
   `postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require`

## 2. Push kode ke GitHub

Pastikan branch kerjamu sudah ter-push ke GitHub (repo ini sudah di sana).

## 3. Buat project di Vercel

1. Daftar di <https://vercel.com> (pakai akun GitHub).
2. **Add New → Project** → pilih repo `risetdiary` → **Import**.
3. Framework terdeteksi otomatis sebagai **Next.js**. Jangan klik Deploy dulu.

## 4. Set Environment Variables di Vercel

Tambahkan dua variabel ini (halaman import atau Settings → Environment Variables):

| Nama | Nilai |
|---|---|
| `DATABASE_URL` | connection string dari Neon (langkah 1) |
| `SESSION_SECRET` | nilai acak; buat dengan perintah di bawah |

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 5. Deploy

Klik **Deploy**. Saat build, Vercel menjalankan otomatis:

1. `npm install` → `prisma generate`
2. `prisma migrate deploy` → membuat tabel di Neon
3. `next build`

Selesai — aplikasi online di `https://<nama>.vercel.app`. 🎉

## Pengembangan lokal dengan Postgres

Gunakan database Neon (boleh project terpisah untuk dev):

```bash
cp .env.example .env     # isi DATABASE_URL (Neon) & SESSION_SECRET
npm install
npm run db:migrate       # buat tabel
npm run dev
```

## Catatan

- **Jangan commit `.env`** (sudah di-`.gitignore`). Simpan rahasia hanya di Vercel.
- Mengganti `SESSION_SECRET` akan melogout semua sesi yang ada.
- Mengubah skema: jalankan `npm run db:migrate` di lokal, commit folder
  `prisma/migrations`, lalu deploy ulang (Vercel menerapkannya otomatis).
