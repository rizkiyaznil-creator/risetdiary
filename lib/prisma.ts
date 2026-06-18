// Satu instance PrismaClient untuk seluruh aplikasi (pola "singleton").
// Tujuannya mencegah koneksi database menumpuk saat hot-reload di mode dev.
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Prisma 7 tidak lagi punya engine bawaan — koneksi ke database lewat
// "driver adapter". Untuk SQLite lokal kita pakai better-sqlite3.
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
