import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/AuthOptions";
import { CommerceType } from "@prisma/client";

export const dynamic = "force-dynamic";

// Ajouter la méthode GET
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email !== "fortuna77320@gmail.com") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const stations = await prisma.station.findMany({
      include: {
        services: true,
        parkingDetails: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(stations);
  } catch (error) {
    console.error("Erreur lors de la récupération des stations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des stations" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Données reçues par l'API:", data);

    // Valider les types de commerces
    const validCommerces =
      data.type === "PARKING" && data.parkingDetails?.commercesProches
        ? data.parkingDetails.commercesProches.filter((commerce: string) =>
            Object.values(CommerceType).includes(commerce as CommerceType)
          )
        : [];

    console.log("Types de commerces valides:", validCommerces);
    console.log("Détails du parking reçus:", data.parkingDetails);

    const station = await prisma.station.create({
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        latitude: data.latitude,
        longitude: data.longitude,
        type: data.type,
        status: "en_attente",
        images: data.images || [],
        services:
          data.type === "STATION_LAVAGE"
            ? {
                create: {
                  highPressure: data.services.highPressure,
                  tirePressure: data.services.tirePressure === true,
                  vacuum: data.services.vacuum === true,
                  handicapAccess: data.services.handicapAccess === true,
                  wasteWater: data.services.wasteWater === true,
                  waterPoint: data.services.waterPoint === true,
                  wasteWaterDisposal: data.services.wasteWaterDisposal === true,
                  blackWaterDisposal: data.services.blackWaterDisposal === true,
                  electricity: data.services.electricity,
                  maxVehicleLength: data.services.maxVehicleLength,
                  paymentMethods: data.services.paymentMethods || [],
                },
              }
            : undefined,
        parkingDetails:
          data.type === "PARKING"
            ? {
                create: {
                  isPayant: data.parkingDetails.isPayant === true,
                  tarif: data.parkingDetails.tarif
                    ? Number(data.parkingDetails.tarif)
                    : null,
                  hasElectricity: data.parkingDetails.hasElectricity || "NONE",
                  commercesProches: validCommerces,
                  handicapAccess: data.parkingDetails.handicapAccess === true,
                },
              }
            : undefined,
        author: {
          connect: {
            email: data.author.email,
          },
        },
      },
      include: {
        services: true,
        parkingDetails: true,
        author: true,
      },
    });

    // Envoyer la notification par email
    try {
      console.log("Tentative d'envoi de notification par email...");
      console.log(
        "URL de l'API:",
        `${process.env.NEXT_PUBLIC_APP_URL}/api/notify-new-station`
      );
      console.log("Données à envoyer:", {
        ...data,
        services: station.services,
        parkingDetails: station.parkingDetails,
        author: station.author,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/notify-new-station`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            services: station.services,
            parkingDetails: station.parkingDetails,
            author: station.author,
          }),
        }
      );

      const responseData = await response.json();
      console.log("Réponse de notify-new-station:", responseData);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error(
        "Erreur détaillée lors de l'envoi de la notification:",
        error
      );
      if (error instanceof Error) {
        console.error("Message d'erreur:", error.message);
        if ("response" in error) {
          const errorWithResponse = error as {
            response: { text: () => Promise<string> };
          };
          console.error(
            "Réponse d'erreur:",
            await errorWithResponse.response.text()
          );
        }
      }
    }

    console.log("Station créée:", station);
    return NextResponse.json(station);
  } catch (error) {
    console.error("Erreur détaillée lors de la création de la station:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la station" },
      { status: 500 }
    );
  }
}
