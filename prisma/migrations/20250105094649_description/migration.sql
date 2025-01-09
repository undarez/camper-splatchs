/*
  Warnings:

  - The `commercesProches` column on the `ParkingDetails` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ParkingDetails" DROP COLUMN "commercesProches",
ADD COLUMN     "commercesProches" TEXT[];

-- AlterTable
ALTER TABLE "Station" ADD COLUMN     "description" TEXT;
