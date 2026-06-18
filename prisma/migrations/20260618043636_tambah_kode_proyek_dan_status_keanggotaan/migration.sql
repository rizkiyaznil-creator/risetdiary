/*
  Warnings:

  - Added the required column `kode` to the `Proyek` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_KeanggotaanProyek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "peran" TEXT NOT NULL DEFAULT 'PENELITI',
    "status" TEXT NOT NULL DEFAULT 'MENUNGGU',
    "userId" TEXT NOT NULL,
    "proyekId" TEXT NOT NULL,
    CONSTRAINT "KeanggotaanProyek_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "KeanggotaanProyek_proyekId_fkey" FOREIGN KEY ("proyekId") REFERENCES "Proyek" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_KeanggotaanProyek" ("id", "peran", "proyekId", "userId") SELECT "id", "peran", "proyekId", "userId" FROM "KeanggotaanProyek";
DROP TABLE "KeanggotaanProyek";
ALTER TABLE "new_KeanggotaanProyek" RENAME TO "KeanggotaanProyek";
CREATE UNIQUE INDEX "KeanggotaanProyek_userId_proyekId_key" ON "KeanggotaanProyek"("userId", "proyekId");
CREATE TABLE "new_Proyek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kode" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "tanggalMulai" DATETIME,
    "targetSelesai" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Proyek" ("createdAt", "deskripsi", "id", "judul", "tanggalMulai", "targetSelesai", "updatedAt") SELECT "createdAt", "deskripsi", "id", "judul", "tanggalMulai", "targetSelesai", "updatedAt" FROM "Proyek";
DROP TABLE "Proyek";
ALTER TABLE "new_Proyek" RENAME TO "Proyek";
CREATE UNIQUE INDEX "Proyek_kode_key" ON "Proyek"("kode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
