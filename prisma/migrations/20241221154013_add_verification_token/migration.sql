/*
  Warnings:

  - You are about to drop the column `encryptedCamperModel` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `encryptedDepartment` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `encryptedEmail` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `encryptedName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `encryptionVersion` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[verificationToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "encryptedCamperModel",
DROP COLUMN "encryptedDepartment",
DROP COLUMN "encryptedEmail",
DROP COLUMN "encryptedName",
DROP COLUMN "encryptionVersion",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hashedPassword" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "usageFrequency" TEXT,
ADD COLUMN     "verificationToken" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT DEFAULT 'USER';

-- CreateIndex
CREATE UNIQUE INDEX "User_verificationToken_key" ON "User"("verificationToken");
