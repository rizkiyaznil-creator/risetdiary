-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeanggotaanProyek" (
    "id" TEXT NOT NULL,
    "peran" TEXT NOT NULL DEFAULT 'PENELITI',
    "status" TEXT NOT NULL DEFAULT 'MENUNGGU',
    "userId" TEXT NOT NULL,
    "proyekId" TEXT NOT NULL,

    CONSTRAINT "KeanggotaanProyek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proyek" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "tanggalMulai" TIMESTAMP(3),
    "targetSelesai" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proyek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogKegiatan" (
    "id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "linkBukti" TEXT,
    "status" TEXT NOT NULL DEFAULT 'BERJALAN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "proyekId" TEXT NOT NULL,
    "penulisId" TEXT NOT NULL,
    "milestoneId" TEXT,

    CONSTRAINT "LogKegiatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "tenggat" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'BELUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "proyekId" TEXT NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengeluaran" (
    "id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "keterangan" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "linkNota" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "proyekId" TEXT NOT NULL,

    CONSTRAINT "Pengeluaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jurnal" (
    "id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "proyekId" TEXT NOT NULL,
    "penulisId" TEXT NOT NULL,

    CONSTRAINT "Jurnal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Komentar" (
    "id" TEXT NOT NULL,
    "isi" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "penulisId" TEXT NOT NULL,
    "logId" TEXT,

    CONSTRAINT "Komentar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "KeanggotaanProyek_userId_proyekId_key" ON "KeanggotaanProyek"("userId", "proyekId");

-- CreateIndex
CREATE UNIQUE INDEX "Proyek_kode_key" ON "Proyek"("kode");

-- AddForeignKey
ALTER TABLE "KeanggotaanProyek" ADD CONSTRAINT "KeanggotaanProyek_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeanggotaanProyek" ADD CONSTRAINT "KeanggotaanProyek_proyekId_fkey" FOREIGN KEY ("proyekId") REFERENCES "Proyek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogKegiatan" ADD CONSTRAINT "LogKegiatan_proyekId_fkey" FOREIGN KEY ("proyekId") REFERENCES "Proyek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogKegiatan" ADD CONSTRAINT "LogKegiatan_penulisId_fkey" FOREIGN KEY ("penulisId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogKegiatan" ADD CONSTRAINT "LogKegiatan_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_proyekId_fkey" FOREIGN KEY ("proyekId") REFERENCES "Proyek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengeluaran" ADD CONSTRAINT "Pengeluaran_proyekId_fkey" FOREIGN KEY ("proyekId") REFERENCES "Proyek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jurnal" ADD CONSTRAINT "Jurnal_proyekId_fkey" FOREIGN KEY ("proyekId") REFERENCES "Proyek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jurnal" ADD CONSTRAINT "Jurnal_penulisId_fkey" FOREIGN KEY ("penulisId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Komentar" ADD CONSTRAINT "Komentar_penulisId_fkey" FOREIGN KEY ("penulisId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Komentar" ADD CONSTRAINT "Komentar_logId_fkey" FOREIGN KEY ("logId") REFERENCES "LogKegiatan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
