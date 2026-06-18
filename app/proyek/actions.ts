"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifikasiSesi } from "@/lib/dal";
import { buatKodeProyek } from "@/lib/kode";

type FormState = { error?: string } | undefined;

// Pastikan user adalah peneliti utama (terverifikasi) dari proyek ini.
async function pastikanUtama(proyekId: string, userId: string) {
  const k = await prisma.keanggotaanProyek.findUnique({
    where: { userId_proyekId: { userId, proyekId } },
  });
  if (!k || k.peran !== "PENELITI_UTAMA" || k.status !== "TERVERIFIKASI") {
    throw new Error("Hanya peneliti utama yang boleh melakukan tindakan ini.");
  }
}

// Buat kode unik; ulangi bila kebetulan bentrok dengan yang sudah ada.
async function kodeUnik(): Promise<string> {
  let kode = buatKodeProyek();
  for (let i = 0; i < 5; i++) {
    const ada = await prisma.proyek.findUnique({ where: { kode } });
    if (!ada) break;
    kode = buatKodeProyek();
  }
  return kode;
}

export async function buatProyek(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { userId } = await verifikasiSesi();
  const judul = String(formData.get("judul") ?? "").trim();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim();
  if (!judul) return { error: "Judul proyek wajib diisi." };

  const proyek = await prisma.proyek.create({
    data: {
      kode: await kodeUnik(),
      judul,
      deskripsi: deskripsi || null,
      // Pembuat langsung jadi peneliti utama & terverifikasi.
      anggota: {
        create: { userId, peran: "PENELITI_UTAMA", status: "TERVERIFIKASI" },
      },
    },
  });

  redirect(`/proyek/${proyek.id}`);
}

export async function gabungProyek(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { userId } = await verifikasiSesi();
  const kode = String(formData.get("kode") ?? "")
    .trim()
    .toUpperCase();
  const peran = String(formData.get("peran") ?? "PENELITI");

  if (!kode) return { error: "Kode proyek wajib diisi." };
  if (peran !== "PENELITI" && peran !== "PEMBIMBING")
    return { error: "Peran tidak valid." };

  const proyek = await prisma.proyek.findUnique({ where: { kode } });
  if (!proyek) return { error: "Kode tidak ditemukan. Periksa kembali." };

  const sudah = await prisma.keanggotaanProyek.findUnique({
    where: { userId_proyekId: { userId, proyekId: proyek.id } },
  });
  if (!sudah) {
    await prisma.keanggotaanProyek.create({
      data: { userId, proyekId: proyek.id, peran, status: "MENUNGGU" },
    });
  }
  redirect(`/proyek/${proyek.id}`);
}

export async function setujuiAnggota(formData: FormData) {
  const { userId } = await verifikasiSesi();
  const keanggotaanId = String(formData.get("keanggotaanId") ?? "");
  const k = await prisma.keanggotaanProyek.findUnique({
    where: { id: keanggotaanId },
  });
  if (!k) return;
  await pastikanUtama(k.proyekId, userId);
  await prisma.keanggotaanProyek.update({
    where: { id: keanggotaanId },
    data: { status: "TERVERIFIKASI" },
  });
  revalidatePath(`/proyek/${k.proyekId}`);
}

export async function tolakAnggota(formData: FormData) {
  const { userId } = await verifikasiSesi();
  const keanggotaanId = String(formData.get("keanggotaanId") ?? "");
  const k = await prisma.keanggotaanProyek.findUnique({
    where: { id: keanggotaanId },
  });
  if (!k) return;
  await pastikanUtama(k.proyekId, userId);
  await prisma.keanggotaanProyek.update({
    where: { id: keanggotaanId },
    data: { status: "DITOLAK" },
  });
  revalidatePath(`/proyek/${k.proyekId}`);
}

export async function resetKode(formData: FormData) {
  const { userId } = await verifikasiSesi();
  const proyekId = String(formData.get("proyekId") ?? "");
  await pastikanUtama(proyekId, userId);
  await prisma.proyek.update({
    where: { id: proyekId },
    data: { kode: await kodeUnik() },
  });
  revalidatePath(`/proyek/${proyekId}`);
}
