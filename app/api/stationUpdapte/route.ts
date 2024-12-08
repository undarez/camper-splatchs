import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/AuthOptions";
import {
  ElectricityType,
  HighPressureType,
  PaymentMethod,
  StationStatus,
} from "@prisma/client";

export async function POST(req: Request) {
  console.log("Route POST appelée");

  try {
    // Vérifier la connexion à la base de données
    await prisma.$connect();
    console.log("Prisma connecté");

    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await req.json();
    console.log("Données reçues:", data);

    // Trouver ou créer l'utilisateur
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      // Créer l'utilisateur s'il n'existe pas
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || null,
          image: session.user.image || null,
          role: "USER",
        },
      });
      console.log("Nouvel utilisateur créé:", user);
    }

    console.log("Utilisateur:", user);

    // Création de la station
    const station = await prisma.station.create({
      data: {
        name: data.name,
        address: data.address,
        latitude: data.lat,
        longitude: data.lng,
        images: data.images,
        status: data.status as StationStatus,
        authorId: user.id,
        services: {
          create: {
            highPressure: data.services.highPressure as HighPressureType,
            tirePressure: data.services.tirePressure,
            vacuum: data.services.vacuum,
            handicapAccess: data.services.handicapAccess,
            wasteWater: data.services.wasteWater,
            electricity: data.services.electricity as ElectricityType,
            paymentMethods: data.services.paymentMethods as PaymentMethod[],
            maxVehicleLength: data.services.maxVehicleLength,
          },
        },
      },
    });

    console.log("Station créée:", station);
    return NextResponse.json({ success: true, station });
  } catch (error) {
    console.error("Erreur détaillée:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Une erreur inconnue est survenue";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const stations = await prisma.station.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        services: true,
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
      lat: station.latitude,
      lng: station.longitude,
      images: station.images,
      status: station.status,
      services: station.services,
      author: station.author,
      createdAt: station.createdAt,
    }));

    return NextResponse.json(formattedStations);
  } catch (error) {
    console.error("Erreur lors de la récupération des stations:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
