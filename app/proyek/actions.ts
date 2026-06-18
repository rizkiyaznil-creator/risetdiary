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

// ===== Log Kegiatan =====

const STATUS_VALID = ["BELUM", "BERJALAN", "SELESAI"];

// Boleh menulis (log) bila anggota TERVERIFIKASI dan berperan peneliti.
// Pembimbing hanya boleh melihat. Mengembalikan keanggotaan atau null.
async function keanggotaanPenulis(proyekId: string, userId: string) {
  const k = await prisma.keanggotaanProyek.findUnique({
    where: { userId_proyekId: { userId, proyekId } },
  });
  if (!k || k.status !== "TERVERIFIKASI") return null;
  if (k.peran !== "PENELITI_UTAMA" && k.peran !== "PENELITI") return null;
  return k;
}

export async function tambahLog(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { userId } = await verifikasiSesi();
  const proyekId = String(formData.get("proyekId") ?? "");
  const k = await keanggotaanPenulis(proyekId, userId);
  if (!k) return { error: "Kamu tidak berhak menambah log di proyek ini." };

  const judul = String(formData.get("judul") ?? "").trim();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim();
  const linkBukti = String(formData.get("linkBukti") ?? "").trim();
  const status = String(formData.get("status") ?? "BERJALAN");
  const tanggalStr = String(formData.get("tanggal") ?? "");
  const milestoneId = String(formData.get("milestoneId") ?? "").trim();

  if (!judul) return { error: "Judul kegiatan wajib diisi." };
  if (!STATUS_VALID.includes(status)) return { error: "Status tidak valid." };
  if (linkBukti && !/^https?:\/\//i.test(linkBukti))
    return { error: "Link bukti harus diawali http:// atau https://" };
  const tanggal = tanggalStr ? new Date(tanggalStr) : new Date();
  if (Number.isNaN(tanggal.getTime()))
    return { error: "Tanggal tidak valid." };

  // Milestone opsional — bila diisi, pastikan milik proyek yang sama.
  let milestoneIdFinal: string | null = null;
  if (milestoneId) {
    const m = await prisma.milestone.findUnique({ where: { id: milestoneId } });
    if (!m || m.proyekId !== proyekId)
      return { error: "Milestone tidak valid." };
    milestoneIdFinal = m.id;
  }

  await prisma.logKegiatan.create({
    data: {
      proyekId,
      penulisId: userId,
      judul,
      deskripsi: deskripsi || null,
      linkBukti: linkBukti || null,
      status,
      tanggal,
      milestoneId: milestoneIdFinal,
    },
  });
  redirect(`/proyek/${proyekId}`);
}

export async function ubahStatusLog(formData: FormData) {
  const { userId } = await verifikasiSesi();
  const logId = String(formData.get("logId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!STATUS_VALID.includes(status)) return;
  const log = await prisma.logKegiatan.findUnique({ where: { id: logId } });
  if (!log) return;
  if (!(await keanggotaanPenulis(log.proyekId, userId))) return;
  await prisma.logKegiatan.update({ where: { id: logId }, data: { status } });
  revalidatePath(`/proyek/${log.proyekId}`);
}

export async function hapusLog(formData: FormData) {
  const { userId } = await verifikasiSesi();
  const logId = String(formData.get("logId") ?? "");
  const log = await prisma.logKegiatan.findUnique({ where: { id: logId } });
  if (!log) return;
  const k = await keanggotaanPenulis(log.proyekId, userId);
  if (!k) return;
  // Hanya penulis log atau peneliti utama yang boleh menghapus.
  if (log.penulisId !== userId && k.peran !== "PENELITI_UTAMA") return;
  await prisma.logKegiatan.delete({ where: { id: logId } });
  revalidatePath(`/proyek/${log.proyekId}`);
}

// ===== Milestone =====

export async function tambahMilestone(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { userId } = await verifikasiSesi();
  const proyekId = String(formData.get("proyekId") ?? "");
  if (!(await keanggotaanPenulis(proyekId, userId)))
    return { error: "Kamu tidak berhak menambah milestone." };

  const nama = String(formData.get("nama") ?? "").trim();
  const deskripsi = String(formData.get("deskripsi") ?? "").trim();
  const status = String(formData.get("status") ?? "BELUM");
  const tenggatStr = String(formData.get("tenggat") ?? "");

  if (!nama) return { error: "Nama milestone wajib diisi." };
  if (!STATUS_VALID.includes(status)) return { error: "Status tidak valid." };
  let tenggat: Date | null = null;
  if (tenggatStr) {
    tenggat = new Date(tenggatStr);
    if (Number.isNaN(tenggat.getTime()))
      return { error: "Tenggat tidak valid." };
  }

  await prisma.milestone.create({
    data: { proyekId, nama, deskripsi: deskripsi || null, status, tenggat },
  });
  redirect(`/proyek/${proyekId}`);
}

export async function ubahStatusMilestone(formData: FormData) {
  const { userId } = await verifikasiSesi();
  const milestoneId = String(formData.get("milestoneId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!STATUS_VALID.includes(status)) return;
  const m = await prisma.milestone.findUnique({ where: { id: milestoneId } });
  if (!m) return;
  if (!(await keanggotaanPenulis(m.proyekId, userId))) return;
  await prisma.milestone.update({
    where: { id: milestoneId },
    data: { status },
  });
  revalidatePath(`/proyek/${m.proyekId}`);
}

export async function hapusMilestone(formData: FormData) {
  const { userId } = await verifikasiSesi();
  const milestoneId = String(formData.get("milestoneId") ?? "");
  const m = await prisma.milestone.findUnique({ where: { id: milestoneId } });
  if (!m) return;
  if (!(await keanggotaanPenulis(m.proyekId, userId))) return;
  // Log yang terkait tidak ikut terhapus; milestoneId-nya otomatis jadi null.
  await prisma.milestone.delete({ where: { id: milestoneId } });
  revalidatePath(`/proyek/${m.proyekId}`);
}

// ===== Pengeluaran =====

export async function tambahPengeluaran(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { userId } = await verifikasiSesi();
  const proyekId = String(formData.get("proyekId") ?? "");
  if (!(await keanggotaanPenulis(proyekId, userId)))
    return { error: "Kamu tidak berhak menambah pengeluaran." };

  const keterangan = String(formData.get("keterangan") ?? "").trim();
  const kategori = String(formData.get("kategori") ?? "").trim() || "Lainnya";
  const linkNota = String(formData.get("linkNota") ?? "").trim();
  const tanggalStr = String(formData.get("tanggal") ?? "");
  // Ambil angka saja, agar "Rp 50.000" / "50000" sama-sama jadi 50000.
  const jumlahDigit = String(formData.get("jumlah") ?? "").replace(/[^\d]/g, "");
  const jumlah = jumlahDigit ? parseInt(jumlahDigit, 10) : 0;

  if (!keterangan) return { error: "Keterangan wajib diisi." };
  if (!jumlah || jumlah <= 0) return { error: "Jumlah harus lebih dari 0." };
  if (linkNota && !/^https?:\/\//i.test(linkNota))
    return { error: "Link nota harus diawali http:// atau https://" };
  const tanggal = tanggalStr ? new Date(tanggalStr) : new Date();
  if (Number.isNaN(tanggal.getTime()))
    return { error: "Tanggal tidak valid." };

  await prisma.pengeluaran.create({
    data: {
      proyekId,
      keterangan,
      kategori,
      jumlah,
      linkNota: linkNota || null,
      tanggal,
    },
  });
  redirect(`/proyek/${proyekId}`);
}

export async function hapusPengeluaran(formData: FormData) {
  const { userId } = await verifikasiSesi();
  const pengeluaranId = String(formData.get("pengeluaranId") ?? "");
  const e = await prisma.pengeluaran.findUnique({
    where: { id: pengeluaranId },
  });
  if (!e) return;
  if (!(await keanggotaanPenulis(e.proyekId, userId))) return;
  await prisma.pengeluaran.delete({ where: { id: pengeluaranId } });
  revalidatePath(`/proyek/${e.proyekId}`);
}
