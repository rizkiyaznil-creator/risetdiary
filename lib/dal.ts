// Data Access Layer (DAL): pemeriksaan sesi & pengambilan data user login.
// Dipanggil dari Server Component/Action. "cache" menghindari kerja ganda
// bila dipanggil beberapa kali dalam satu request.
import { cache } from "react";
import { redirect } from "next/navigation";
import { ambilSesi } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// Pastikan ada sesi valid. Kalau tidak, alihkan ke halaman login.
export const verifikasiSesi = cache(async () => {
  const sesi = await ambilSesi();
  if (!sesi?.userId) redirect("/login");
  return { userId: sesi.userId };
});

// Ambil data user yang sedang login (tanpa kolom password).
export const userSekarang = cache(async () => {
  const sesi = await ambilSesi();
  if (!sesi?.userId) return null;
  return prisma.user.findUnique({
    where: { id: sesi.userId },
    select: { id: true, nama: true, email: true },
  });
});
