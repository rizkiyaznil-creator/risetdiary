// Mengelola cookie session di sisi server: membuat, membaca, menghapus.
import { cookies } from "next/headers";
import { enkripsiSesi, dekripsiSesi, type SesiPayload } from "@/lib/jwt";

const NAMA_COOKIE = "session";
const DURASI_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari

export async function buatSesi(userId: string): Promise<void> {
  const expiresAt = new Date(Date.now() + DURASI_MS);
  const token = await enkripsiSesi({
    userId,
    expiresAt: expiresAt.toISOString(),
  });

  // cookies() async di Next 16 — wajib di-await
  const cookieStore = await cookies();
  cookieStore.set(NAMA_COOKIE, token, {
    httpOnly: true, // tidak bisa diakses JavaScript di browser
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function ambilSesi(): Promise<SesiPayload | null> {
  const cookieStore = await cookies();
  return dekripsiSesi(cookieStore.get(NAMA_COOKIE)?.value);
}

export async function hapusSesi(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(NAMA_COOKIE);
}
