// Helper baca data proyek (dipanggil dari Server Component). Bukan "use server"
// karena ini bukan action mutasi — hanya pengambilan data.
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { ambilSesi } from "@/lib/session";

// Daftar proyek yang saya ikuti (kecuali yang ditolak), dengan peran & status saya.
export const proyekSaya = cache(async () => {
  const sesi = await ambilSesi();
  if (!sesi?.userId) return [];
  return prisma.keanggotaanProyek.findMany({
    where: { userId: sesi.userId, status: { not: "DITOLAK" } },
    include: { proyek: true },
    orderBy: { proyek: { createdAt: "desc" } },
  });
});

// Ambil satu proyek BILA saya tercatat sebagai anggota (status apa pun).
// Mengembalikan { proyek, keanggotaan } milik saya, atau null bila bukan anggota.
export const getProyek = cache(async (proyekId: string) => {
  const sesi = await ambilSesi();
  if (!sesi?.userId) return null;
  const keanggotaan = await prisma.keanggotaanProyek.findUnique({
    where: { userId_proyekId: { userId: sesi.userId, proyekId } },
  });
  if (!keanggotaan) return null;
  const proyek = await prisma.proyek.findUnique({ where: { id: proyekId } });
  if (!proyek) return null;
  return { proyek, keanggotaan };
});

// Semua anggota sebuah proyek (untuk halaman peneliti utama).
export const anggotaProyek = cache(async (proyekId: string) => {
  return prisma.keanggotaanProyek.findMany({
    where: { proyekId },
    include: { user: { select: { id: true, nama: true, email: true } } },
    orderBy: { id: "asc" },
  });
});

// Daftar log kegiatan sebuah proyek (terbaru di atas), beserta nama penulis.
export const logProyek = cache(async (proyekId: string) => {
  return prisma.logKegiatan.findMany({
    where: { proyekId },
    include: { penulis: { select: { id: true, nama: true } } },
    orderBy: [{ tanggal: "desc" }, { createdAt: "desc" }],
  });
});
