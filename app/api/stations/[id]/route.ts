import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Review, Station } from "@prisma/client";

interface StationWithRelations extends Station {
  services: {
    id: string;
    highPressure: "NONE" | "PASSERELLE" | "ECHAFAUDAGE" | "PORTIQUE";
    tirePressure: boolean;
    vacuum: boolean;
    handicapAccess: boolean;
    wasteWater: boolean;
    waterPoint: boolean;
    wasteWaterDisposal: boolean;
    blackWaterDisposal: boolean;
    paymentMethods: ("JETON" | "ESPECES" | "CARTE_BANCAIRE")[];
    electricity: "NONE" | "AMP_8" | "AMP_15";
    maxVehicleLength: number | null;
    createdAt: Date;
  } | null;
  parkingDetails: {
    id: string;
    isPayant: boolean;
    tarif: number | null;
    taxeSejour: number | null;
    hasElectricity: "NONE" | "AMP_8" | "AMP_15";
    commercesProches: string[];
    handicapAccess: boolean;
    totalPlaces: number;
    hasWifi: boolean;
    hasChargingPoint: boolean;
    waterPoint: boolean;
    wasteWater: boolean;
    wasteWaterDisposal: boolean;
    blackWaterDisposal: boolean;
    createdAt: Date;
  } | null;
  reviews: (Review & {
    author: {
      id: string;
      name: string | null;
      image: string | null;
    };
  })[];
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Recherche de la station avec l'ID:", params.id);

    const station = await prisma.station.findUnique({
      where: {
        id: params.id,
      },
      include: {
        services: true,
        parkingDetails: true,
        reviews: {
          select: {
            id: true,
            content: true,
            rating: true,
            createdAt: true,
            authorId: true,
            stationId: true,
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    console.log(
      "Résultat de la requête:",
      station ? "Station trouvée" : "Station non trouvée"
    );

    if (!station) {
      console.log("Station non trouvée pour l'ID:", params.id);
      return NextResponse.json(
        { error: "Station non trouvée" },
        { status: 404 }
      );
    }

    const stationWithRelations = station as StationWithRelations;

    // Calculer la moyenne des notes
    const averageRating =
      stationWithRelations.reviews.length > 0
        ? stationWithRelations.reviews.reduce(
            (acc: number, review) => acc + review.rating,
            0
          ) / stationWithRelations.reviews.length
        : 0;

    const response = {
      ...stationWithRelations,
      averageRating: Number(averageRating.toFixed(1)),
    };

    console.log("Réponse préparée avec succès");
    return NextResponse.json(response);
  } catch (error) {
    console.error(
      "Erreur détaillée lors de la récupération de la station:",
      error
    );
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération de la station",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
