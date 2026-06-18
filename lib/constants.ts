// Nilai-nilai tetap yang dipakai di banyak tempat.
// Karena SQLite tidak mendukung enum, "status" & "peran" disimpan sebagai
// teks dengan kunci di sini. Key = nilai tersimpan, value = label tampilan.

export const STATUS = {
  BELUM: "Belum mulai",
  BERJALAN: "Berjalan",
  SELESAI: "Selesai",
} as const;

export type StatusKey = keyof typeof STATUS;

export const PERAN = {
  PENELITI_UTAMA: "Peneliti utama",
  PENELITI: "Peneliti",
  PEMBIMBING: "Pembimbing",
} as const;

export type PeranKey = keyof typeof PERAN;

// Status keanggotaan seseorang di sebuah proyek (alur verifikasi).
export const STATUS_KEANGGOTAAN = {
  MENUNGGU: "Menunggu persetujuan",
  TERVERIFIKASI: "Terverifikasi",
  DITOLAK: "Ditolak",
} as const;

export type StatusKeanggotaanKey = keyof typeof STATUS_KEANGGOTAAN;

// Kategori pengeluaran bawaan. Pengguna tetap bisa mengetik kategori baru
// langsung di form; daftar ini hanya saran awal.
export const KATEGORI_PENGELUARAN_DEFAULT = [
  "Bahan/Alat",
  "Transport",
  "Konsumsi",
  "Publikasi",
  "Lainnya",
] as const;
