import {
  PrismaClient,
  StationStatus,
  StationType,
  HighPressureType,
  ElectricityType,
  PaymentMethod,
} from "@prisma/client";
import stationsData from "../data/stations.json";

const prisma = new PrismaClient();

async function main() {
  console.log("Début du seeding...");

  // Supprimer toutes les données existantes
  await prisma.review.deleteMany();
  await prisma.service.deleteMany();
  await prisma.parkingDetails.deleteMany();
  await prisma.station.deleteMany();

  // Créer un utilisateur admin par défaut
  const admin = await prisma.user.upsert({
    where: { email: "admin@lavatrans.fr" },
    update: {},
    create: {
      email: "admin@lavatrans.fr",
      name: "Admin LavaTrans",
      role: "ADMIN",
    },
  });

  console.log("Utilisateur admin créé:", admin.id);

  // Ajouter les stations
  for (const station of stationsData.stations) {
    const createdStation = await prisma.station.create({
      data: {
        name: station.name,
        address: station.address,
        city: station.city,
        postalCode: station.postalCode,
        latitude: station.latitude,
        longitude: station.longitude,
        images: station.images,
        status: station.status as StationStatus,
        type: station.type as StationType,
        phoneNumber: station.phoneNumber,
        description: station.description,
        isLavaTrans: station.isLavaTrans,
        author: {
          connect: { id: admin.id },
        },
        services: station.services
          ? {
              create: {
                highPressure: station.services.highPressure as HighPressureType,
                tirePressure: station.services.tirePressure,
                vacuum: station.services.vacuum,
                handicapAccess: station.services.handicapAccess,
                wasteWater: station.services.wasteWater,
                waterPoint: station.services.waterPoint,
                wasteWaterDisposal: station.services.wasteWaterDisposal,
                blackWaterDisposal: station.services.blackWaterDisposal,
                electricity:
                  station.services.electricity === "Aucun"
                    ? ("NONE" as ElectricityType)
                    : (station.services.electricity as ElectricityType),
                paymentMethods: station.services
                  .paymentMethods as PaymentMethod[],
              },
            }
          : undefined,
      },
    });
    console.log("Station créée:", createdStation.name);
  }

  // Ajouter les parkings
  for (const parking of stationsData.parkings) {
    const createdParking = await prisma.station.create({
      data: {
        name: parking.name,
        address: parking.address,
        city: parking.city,
        postalCode: parking.postalCode,
        latitude: parking.latitude,
        longitude: parking.longitude,
        images: parking.images,
        status: parking.status as StationStatus,
        type: parking.type as StationType,
        phoneNumber: parking.phoneNumber,
        description: parking.description,
        isLavaTrans: parking.isLavaTrans,
        author: {
          connect: { id: admin.id },
        },
        parkingDetails: parking.parkingDetails
          ? {
              create: {
                isPayant: false,
                tarif: 0,
                taxeSejour: 0,
                hasElectricity: "NONE",
                commercesProches: [
                  "NOURRITURE",
                  "CENTRE_VILLE",
                  "STATION_SERVICE",
                  "GARAGE",
                  "BANQUE",
                ],
                handicapAccess: parking.parkingDetails.handicapAccess,
                totalPlaces: parking.parkingDetails.totalPlaces,
                hasWifi: parking.parkingDetails.hasWifi,
                hasChargingPoint: parking.parkingDetails.hasChargingPoint,
                waterPoint: parking.parkingDetails.waterPoint,
                wasteWater: parking.parkingDetails.wasteWater,
                wasteWaterDisposal: parking.parkingDetails.wasteWaterDisposal,
                blackWaterDisposal: parking.parkingDetails.blackWaterDisposal,
              },
            }
          : undefined,
      },
    });
    console.log("Parking créé:", createdParking.name);
  }

  console.log("Seeding terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
