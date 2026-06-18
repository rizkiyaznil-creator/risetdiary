"use server";

// Server Actions untuk autentikasi: daftar, masuk, keluar.
// Berjalan di server, dipanggil langsung dari <form action={...}>.
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { buatSesi, hapusSesi } from "@/lib/session";

type FormState = { error?: string } | undefined;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function daftar(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const nama = String(formData.get("nama") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!nama || !email || !password)
    return { error: "Semua kolom wajib diisi." };
  if (!EMAIL_REGEX.test(email)) return { error: "Format email tidak valid." };
  if (password.length < 6)
    return { error: "Password minimal 6 karakter." };

  const sudahAda = await prisma.user.findUnique({ where: { email } });
  if (sudahAda) return { error: "Email sudah terdaftar. Silakan masuk." };

  // Password TIDAK pernah disimpan apa adanya — selalu di-hash dulu.
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { nama, email, password: hash },
  });

  await buatSesi(user.id);
  redirect("/dashboard");
}

export async function masuk(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password)
    return { error: "Email dan password wajib diisi." };

  const user = await prisma.user.findUnique({ where: { email } });
  // Pesan error sengaja samar (tidak membocorkan email mana yang terdaftar).
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: "Email atau password salah." };
  }

  await buatSesi(user.id);
  redirect("/dashboard");
}

export async function keluar(): Promise<void> {
  await hapusSesi();
  redirect("/login");
}
