-- AlterTable
ALTER TABLE "ParkingDetails" ADD COLUMN     "blackWaterDisposal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "wasteWater" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "wasteWaterDisposal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "waterPoint" BOOLEAN NOT NULL DEFAULT false;
