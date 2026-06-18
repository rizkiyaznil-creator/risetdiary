// Satu instance PrismaClient untuk seluruh aplikasi (pola "singleton").
// Tujuannya mencegah koneksi database menumpuk saat hot-reload di mode dev.
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 tidak lagi punya engine bawaan — koneksi ke database lewat
// "driver adapter". Aplikasi memakai PostgreSQL (mis. Neon saat deploy).
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
