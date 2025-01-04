import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/AuthOptions";

// Désactiver le cache pour cette route
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

    return new NextResponse(JSON.stringify(stations), {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await req.json();
    console.log("Données reçues dans l'API:", data);

    // Vérifier et formater les données du parking
    const parkingDetails =
      data.type === "PARKING"
        ? {
            create: {
              isPayant: Boolean(data.parkingDetails.isPayant),
              tarif:
                data.parkingDetails.isPayant && data.parkingDetails.tarif
                  ? parseFloat(data.parkingDetails.tarif)
                  : null,
              taxeSejour:
                data.parkingDetails.taxeSejour !== undefined
                  ? parseFloat(String(data.parkingDetails.taxeSejour))
                  : null,
              hasElectricity: data.parkingDetails.hasElectricity || "NONE",
              commercesProches: Array.isArray(
                data.parkingDetails.commercesProches
              )
                ? data.parkingDetails.commercesProches
                : [],
              handicapAccess: Boolean(data.parkingDetails.handicapAccess),
              totalPlaces: data.parkingDetails.totalPlaces
                ? parseInt(String(data.parkingDetails.totalPlaces))
                : 0,
              hasWifi: Boolean(data.parkingDetails.hasWifi),
              hasChargingPoint: Boolean(data.parkingDetails.hasChargingPoint),
              waterPoint: Boolean(data.parkingDetails.waterPoint),
              wasteWater: Boolean(data.parkingDetails.wasteWater),
              wasteWaterDisposal: Boolean(
                data.parkingDetails.wasteWaterDisposal
              ),
              blackWaterDisposal: Boolean(
                data.parkingDetails.blackWaterDisposal
              ),
            },
          }
        : undefined;

    console.log("Détails du parking formatés:", parkingDetails);

    const station = await prisma.station.create({
      data: {
        name: data.name || "Sans nom",
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        type: data.type,
        status: "en_attente",
        images: data.images || [],
        author: {
          connect: {
            email: session.user.email,
          },
        },
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
        parkingDetails,
      },
      include: {
        services: true,
        parkingDetails: true,
        author: true,
      },
    });

    console.log("Station créée:", station);
    return new NextResponse(JSON.stringify(station), {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Erreur détaillée lors de la création de la station:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la station" },
      { status: 500 }
    );
  }
}
