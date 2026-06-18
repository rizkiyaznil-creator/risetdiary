-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "KeanggotaanProyek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "peran" TEXT NOT NULL DEFAULT 'PENELITI',
    "userId" TEXT NOT NULL,
    "proyekId" TEXT NOT NULL,
    CONSTRAINT "KeanggotaanProyek_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "KeanggotaanProyek_proyekId_fkey" FOREIGN KEY ("proyekId") REFERENCES "Proyek" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Proyek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "tanggalMulai" DATETIME,
    "targetSelesai" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LogKegiatan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tanggal" DATETIME NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "linkBukti" TEXT,
    "status" TEXT NOT NULL DEFAULT 'BERJALAN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "proyekId" TEXT NOT NULL,
    "penulisId" TEXT NOT NULL,
    "milestoneId" TEXT,
    CONSTRAINT "LogKegiatan_proyekId_fkey" FOREIGN KEY ("proyekId") REFERENCES "Proyek" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LogKegiatan_penulisId_fkey" FOREIGN KEY ("penulisId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LogKegiatan_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "tenggat" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'BELUM',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "proyekId" TEXT NOT NULL,
    CONSTRAINT "Milestone_proyekId_fkey" FOREIGN KEY ("proyekId") REFERENCES "Proyek" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pengeluaran" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tanggal" DATETIME NOT NULL,
    "keterangan" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "linkNota" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "proyekId" TEXT NOT NULL,
    CONSTRAINT "Pengeluaran_proyekId_fkey" FOREIGN KEY ("proyekId") REFERENCES "Proyek" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Jurnal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tanggal" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isi" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "proyekId" TEXT NOT NULL,
    "penulisId" TEXT NOT NULL,
    CONSTRAINT "Jurnal_proyekId_fkey" FOREIGN KEY ("proyekId") REFERENCES "Proyek" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Jurnal_penulisId_fkey" FOREIGN KEY ("penulisId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Komentar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isi" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "penulisId" TEXT NOT NULL,
    "logId" TEXT,
    CONSTRAINT "Komentar_penulisId_fkey" FOREIGN KEY ("penulisId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Komentar_logId_fkey" FOREIGN KEY ("logId") REFERENCES "LogKegiatan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "KeanggotaanProyek_userId_proyekId_key" ON "KeanggotaanProyek"("userId", "proyekId");
