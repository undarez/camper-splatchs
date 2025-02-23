-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ecoPoints" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "WashHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "washType" TEXT NOT NULL,
    "vehicleSize" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "waterUsed" DOUBLE PRECISION NOT NULL,
    "waterSaved" DOUBLE PRECISION NOT NULL,
    "ecoPoints" INTEGER NOT NULL,

    CONSTRAINT "WashHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WashHistory_userId_idx" ON "WashHistory"("userId");

-- CreateIndex
CREATE INDEX "WashHistory_stationId_idx" ON "WashHistory"("stationId");

-- AddForeignKey
ALTER TABLE "WashHistory" ADD CONSTRAINT "WashHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WashHistory" ADD CONSTRAINT "WashHistory_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;
