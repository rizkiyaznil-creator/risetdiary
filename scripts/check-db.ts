// Cek cepat koneksi database & skema. Jalankan dengan: npm run db:check
// Memakai import relatif (bukan alias "@/") agar mudah dijalankan via tsx.
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const jumlah = {
    user: await prisma.user.count(),
    proyek: await prisma.proyek.count(),
    logKegiatan: await prisma.logKegiatan.count(),
    milestone: await prisma.milestone.count(),
    pengeluaran: await prisma.pengeluaran.count(),
    jurnal: await prisma.jurnal.count(),
    komentar: await prisma.komentar.count(),
  };
  console.log("✅ Koneksi database OK. Jumlah baris per tabel:");
  console.table(jumlah);
}

main()
  .catch((e) => {
    console.error("❌ Gagal terhubung ke database:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
