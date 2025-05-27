import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/AuthOptions";
import { HighPressureType } from "@prisma/client";

// Fonction requise pour l'export statique avec des routes dynamiques
export async function generateStaticParams() {
  // Retourner une liste vide car les API routes ne peuvent pas être pré-générées
  return [];
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email !== "fortuna77320@gmail.com") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { status, parkingDetails, services } = await request.json();
    console.log("Données reçues dans PATCH:", { parkingDetails, services });

    const result = await prisma.$transaction(async (tx) => {
      const existingStation = await tx.station.findUnique({
        where: { id: params.id },
        include: {
          services: true,
          parkingDetails: true,
        },
      });

      if (!existingStation) {
        throw new Error("Station non trouvée");
      }

      // Vérifier si un service existe déjà pour une station de lavage
      if (existingStation.type === "STATION_LAVAGE" && services) {
        if (existingStation.services) {
          await tx.service.update({
            where: { stationId: params.id },
            data: {
              highPressure: services.highPressure,
              tirePressure: services.tirePressure,
              vacuum: services.vacuum,
              handicapAccess: services.handicapAccess,
              wasteWater: services.wasteWater,
              waterPoint: services.waterPoint,
              wasteWaterDisposal: services.wasteWaterDisposal,
              blackWaterDisposal: services.blackWaterDisposal,
              electricity: services.electricity,
              maxVehicleLength: services.maxVehicleLength,
              paymentMethods: services.paymentMethods,
            },
          });
        } else {
          await tx.service.create({
            data: {
              stationId: params.id,
              highPressure: services.highPressure || HighPressureType.NONE,
              tirePressure: services.tirePressure || false,
              vacuum: services.vacuum || false,
              handicapAccess: services.handicapAccess || false,
              wasteWater: services.wasteWater || false,
              waterPoint: services.waterPoint || false,
              wasteWaterDisposal: services.wasteWaterDisposal || false,
              blackWaterDisposal: services.blackWaterDisposal || false,
              electricity: services.electricity || "NONE",
              maxVehicleLength: services.maxVehicleLength || null,
              paymentMethods: services.paymentMethods || [],
            },
          });
        }
      }

      // Vérifier si les détails du parking existent déjà pour un parking
      if (existingStation.type === "PARKING" && parkingDetails) {
        console.log("Mise à jour des détails du parking:", parkingDetails);
        if (existingStation.parkingDetails) {
          const updatedParkingDetails = await tx.parkingDetails.update({
            where: { stationId: params.id },
            data: {
              isPayant: Boolean(parkingDetails.isPayant),
              tarif: parkingDetails.tarif
                ? parseFloat(String(parkingDetails.tarif))
                : null,
              taxeSejour: parkingDetails.taxeSejour
                ? parseFloat(String(parkingDetails.taxeSejour))
                : null,
              hasElectricity: parkingDetails.hasElectricity || "NONE",
              commercesProches: parkingDetails.commercesProches || [],
              handicapAccess: Boolean(parkingDetails.handicapAccess),
              totalPlaces: parkingDetails.totalPlaces
                ? parseInt(String(parkingDetails.totalPlaces))
                : 0,
              hasWifi: Boolean(parkingDetails.hasWifi),
              hasChargingPoint: Boolean(parkingDetails.hasChargingPoint),
              waterPoint: Boolean(parkingDetails.waterPoint),
              wasteWater: Boolean(parkingDetails.wasteWater),
              wasteWaterDisposal: Boolean(parkingDetails.wasteWaterDisposal),
              blackWaterDisposal: Boolean(parkingDetails.blackWaterDisposal),
            },
          });
          console.log("Détails du parking mis à jour:", updatedParkingDetails);
        } else {
          const createdParkingDetails = await tx.parkingDetails.create({
            data: {
              stationId: params.id,
              isPayant: Boolean(parkingDetails.isPayant),
              tarif: parkingDetails.tarif
                ? parseFloat(String(parkingDetails.tarif))
                : null,
              taxeSejour: parkingDetails.taxeSejour
                ? parseFloat(String(parkingDetails.taxeSejour))
                : null,
              hasElectricity: parkingDetails.hasElectricity || "NONE",
              commercesProches: parkingDetails.commercesProches || [],
              handicapAccess: Boolean(parkingDetails.handicapAccess),
              totalPlaces: parkingDetails.totalPlaces
                ? parseInt(String(parkingDetails.totalPlaces))
                : 0,
              hasWifi: Boolean(parkingDetails.hasWifi),
              hasChargingPoint: Boolean(parkingDetails.hasChargingPoint),
              waterPoint: Boolean(parkingDetails.waterPoint),
              wasteWater: Boolean(parkingDetails.wasteWater),
              wasteWaterDisposal: Boolean(parkingDetails.wasteWaterDisposal),
              blackWaterDisposal: Boolean(parkingDetails.blackWaterDisposal),
            },
          });
          console.log("Détails du parking créés:", createdParkingDetails);
        }
      }

      // Mettre à jour la station avec le nouveau statut
      const updatedStation = await tx.station.update({
        where: { id: params.id },
        data: {
          status: status,
          ...(status === "active"
            ? {
                validatedAt: new Date(),
                validatedBy: session.user.email,
              }
            : {}),
        },
        include: {
          services: true,
          parkingDetails: true,
          author: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return updatedStation;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur lors de la mise à jour", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email !== "fortuna77320@gmail.com") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Supprimer d'abord les services associés
    await prisma.service.deleteMany({
      where: { stationId: params.id },
    });

    // Puis supprimer la station
    await prisma.station.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Station supprimée" });
  } catch (error) {
    console.error("Erreur lors de la suppression", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
