import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Review, Station } from "@prisma/client";

interface StationWithRelations extends Station {
  isDelisle: boolean;
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

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        postalCode: true,
        latitude: true,
        longitude: true,
        images: true,
        status: true,
        type: true,
        description: true,
        phoneNumber: true,
        services: true,
        parkingDetails: true,
        iconType: true,
        validatedAt: true,
        validatedBy: true,
        createdAt: true,
        updatedAt: true,
        isLavaTrans: true,
        authorId: true,
        encryptedName: true,
        encryptedAddress: true,
        hasParking: true,
        userId: true,
        reviews: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
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
            email: true,
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

    // Transformer les données pour le front-end
    const stationWithRelations = {
      ...station,
      isDelisle: (station as { isDelisle?: boolean }).isDelisle ?? false,
    } as StationWithRelations;

    // Ajouter les versions snake_case des propriétés et transformer les services
    const response = {
      ...stationWithRelations,
      phone_number: station.phoneNumber,
      postal_code: station.postalCode,
      services: station.services
        ? {
            ...station.services,
            high_pressure: station.services.highPressure,
            tire_pressure: station.services.tirePressure,
            water_point: station.services.waterPoint,
            waste_water: station.services.wasteWater,
            waste_water_disposal: station.services.wasteWaterDisposal,
            black_water_disposal: station.services.blackWaterDisposal,
            handicap_access: station.services.handicapAccess,
          }
        : null,
      parking_details: station.parkingDetails
        ? {
            ...station.parkingDetails,
            is_payant: station.parkingDetails.isPayant,
            has_electricity: station.parkingDetails.hasElectricity,
            commerces_proches: station.parkingDetails.commercesProches,
            handicap_access: station.parkingDetails.handicapAccess,
            total_places: station.parkingDetails.totalPlaces,
            has_wifi: station.parkingDetails.hasWifi,
            has_charging_point: station.parkingDetails.hasChargingPoint,
            water_point: station.parkingDetails.waterPoint,
            waste_water: station.parkingDetails.wasteWater,
            waste_water_disposal: station.parkingDetails.wasteWaterDisposal,
            black_water_disposal: station.parkingDetails.blackWaterDisposal,
          }
        : null,
      averageRating:
        stationWithRelations.reviews.length > 0
          ? Number(
              (
                stationWithRelations.reviews.reduce(
                  (acc: number, review) => acc + review.rating,
                  0
                ) / stationWithRelations.reviews.length
              ).toFixed(1)
            )
          : 0,
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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Début de la mise à jour de la station:", params.id);

    const body = await request.json();
    console.log("Données reçues:", body);

    const { description, phone_number } = body;

    if (!description && !phone_number) {
      console.log("Aucune donnée valide fournie pour la mise à jour");
      return NextResponse.json(
        { error: "Aucune donnée valide fournie pour la mise à jour" },
        { status: 400 }
      );
    }

    console.log("Mise à jour de la station avec:", {
      description,
      phoneNumber: phone_number,
    });

    const updatedStation = await prisma.station.update({
      where: {
        id: params.id,
      },
      data: {
        ...(description && { description }),
        ...(phone_number && { phoneNumber: phone_number }),
      },
    });

    console.log("Station mise à jour avec succès:", updatedStation);
    return NextResponse.json(updatedStation);
  } catch (error) {
    console.error(
      "Erreur détaillée lors de la mise à jour de la station:",
      error
    );
    return NextResponse.json(
      {
        error: "Erreur lors de la mise à jour de la station",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
