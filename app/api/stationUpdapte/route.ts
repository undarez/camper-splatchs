import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";
import {
  Prisma,
  StationStatus,
  StationType,
  HighPressureType,
  ElectricityType,
} from "@prisma/client";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();

    // Récupération de l'utilisateur
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const stationData: Prisma.StationCreateInput = {
      name: data.name,
      address: data.address,
      city: data.city || null,
      postalCode: data.postalCode || null,
      latitude: parseFloat(data.latitude || data.lat),
      longitude: parseFloat(data.longitude || data.lng),
      images: data.images || [],
      status: StationStatus.en_attente,
      type: data.type as StationType,
      author: { connect: { id: user.id } },
      user: { connect: { id: user.id } },
    };

    // Si c'est une station de lavage
    if (data.type === StationType.STATION_LAVAGE) {
      stationData.services = {
        create: {
          highPressure: data.services?.highPressure || HighPressureType.NONE,
          tirePressure: data.services?.tirePressure || false,
          vacuum: data.services?.vacuum || false,
          handicapAccess: data.services?.handicapAccess || false,
          wasteWater: data.services?.wasteWater || false,
          waterPoint: data.services?.waterPoint || false,
          wasteWaterDisposal: data.services?.wasteWaterDisposal || false,
          blackWaterDisposal: data.services?.blackWaterDisposal || false,
          electricity: data.services?.electricity || ElectricityType.NONE,
          maxVehicleLength: data.services?.maxVehicleLength
            ? parseFloat(data.services.maxVehicleLength.toString())
            : null,
          paymentMethods: data.services?.paymentMethods || [],
        },
      };
    }

    // Si c'est un parking
    if (data.type === StationType.PARKING) {
      stationData.parkingDetails = {
        create: {
          isPayant: data.isPayant || false,
          tarif: data.isPayant ? parseFloat(data.tarif) : null,
          hasElectricity: data.electricity || ElectricityType.NONE,
          commercesProches: data.commercesProches || [],
          handicapAccess: data.handicapAccess || false,
          totalPlaces: data.totalPlaces || 0,
          hasWifi: data.hasWifi || false,
          hasChargingPoint: data.hasChargingPoint || false,
          waterPoint: data.waterPoint || false,
          wasteWater: data.wasteWater || false,
          wasteWaterDisposal: data.wasteWaterDisposal || false,
          blackWaterDisposal: data.blackWaterDisposal || false,
        },
      };
    }

    const station = await prisma.station.create({
      data: stationData,
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

    return NextResponse.json(station);
  } catch (error) {
    console.error("Erreur lors de la création de la station:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la station" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const stations = await prisma.station.findMany({
      orderBy: { createdAt: "desc" },
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

    // Conversion pour l'interface frontend
    const formattedStations = stations.map((station) => ({
      id: station.id,
      name: station.name,
      address: station.address,
      city: station.city,
      postalCode: station.postalCode,
      latitude: station.latitude,
      longitude: station.longitude,
      images: station.images,
      status: station.status,
      type: station.type,
      services: station.services,
      parkingDetails: station.parkingDetails,
      author: station.author,
      createdAt: station.createdAt,
    }));

    return NextResponse.json(formattedStations);
  } catch (error) {
    console.error("Erreur lors de la récupération des stations:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
