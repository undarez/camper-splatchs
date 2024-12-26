-- CreateEnum
CREATE TYPE "StationType" AS ENUM ('STATION_LAVAGE', 'PARKING');

-- CreateEnum
CREATE TYPE "CommerceType" AS ENUM ('NOURRITURE', 'BANQUE', 'CENTRE_VILLE', 'STATION_SERVICE', 'LAVERIE', 'GARAGE');

-- AlterTable
ALTER TABLE "Station" ADD COLUMN     "type" "StationType" NOT NULL DEFAULT 'STATION_LAVAGE';

-- CreateTable
CREATE TABLE "ParkingDetails" (
    "id" TEXT NOT NULL,
    "isPayant" BOOLEAN NOT NULL DEFAULT false,
    "tarif" DOUBLE PRECISION,
    "hasElectricity" "ElectricityType" NOT NULL DEFAULT 'NONE',
    "commercesProches" "CommerceType"[],
    "handicapAccess" BOOLEAN NOT NULL DEFAULT false,
    "stationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParkingDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParkingDetails_stationId_key" ON "ParkingDetails"("stationId");

-- AddForeignKey
ALTER TABLE "ParkingDetails" ADD CONSTRAINT "ParkingDetails_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;
