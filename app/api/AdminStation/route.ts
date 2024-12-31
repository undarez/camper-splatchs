import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/AuthOptions";
import { CommerceType } from "@prisma/client";

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

    // Valider les types de commerces
    const validCommerces =
      data.type === "PARKING" && data.parkingDetails?.commercesProches
        ? data.parkingDetails.commercesProches.filter((commerce: string) =>
            Object.values(CommerceType).includes(commerce as CommerceType)
          )
        : [];

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
        parkingDetails:
          data.type === "PARKING"
            ? {
                create: {
                  isPayant: data.isPayant === true,
                  tarif: data.isPayant ? parseFloat(data.tarif) : null,
                  hasElectricity: data.electricity || "NONE",
                  commercesProches: validCommerces,
                  handicapAccess: data.handicapAccess === true,
                },
              }
            : undefined,
      },
      include: {
        services: true,
        parkingDetails: true,
        author: true,
      },
    });

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
