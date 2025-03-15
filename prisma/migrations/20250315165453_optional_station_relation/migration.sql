-- DropForeignKey
ALTER TABLE "WashHistory" DROP CONSTRAINT "WashHistory_stationId_fkey";

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "manualWashPrice" DOUBLE PRECISION,
ADD COLUMN     "portiquePrice" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "WashHistory" ADD COLUMN     "stationAddress" TEXT,
ADD COLUMN     "stationCity" TEXT,
ADD COLUMN     "stationName" TEXT,
ALTER COLUMN "stationId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "WashLane" (
    "id" TEXT NOT NULL,
    "laneNumber" INTEGER NOT NULL,
    "hasHighPressure" BOOLEAN NOT NULL DEFAULT false,
    "hasBusesPortique" BOOLEAN NOT NULL DEFAULT false,
    "hasRollerPortique" BOOLEAN NOT NULL DEFAULT false,
    "stationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WashLane_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WashLane_stationId_idx" ON "WashLane"("stationId");

-- AddForeignKey
ALTER TABLE "WashHistory" ADD CONSTRAINT "WashHistory_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WashLane" ADD CONSTRAINT "WashLane_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;
