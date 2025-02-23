-- AlterTable
ALTER TABLE "ParkingDetails" ADD COLUMN     "hasBarrier" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasCctv" BOOLEAN NOT NULL DEFAULT false;
