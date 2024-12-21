/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `highPressure` on table `Service` required. This step will fail if there are existing NULL values in that column.
  - Made the column `electricity` on table `Service` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_stationId_fkey";

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "highPressure" SET NOT NULL,
ALTER COLUMN "electricity" SET NOT NULL,
ALTER COLUMN "electricity" SET DEFAULT 'NONE';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;
