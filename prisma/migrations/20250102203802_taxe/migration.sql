-- AlterTable
ALTER TABLE "ParkingDetails" ADD COLUMN     "hasWifi" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "taxeSejour" DOUBLE PRECISION,
ADD COLUMN     "totalPlaces" INTEGER NOT NULL DEFAULT 0;