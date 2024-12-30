import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const stations = await prisma.station.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Conversion pour l'interface frontend
    const formattedStations = stations.map((station) => ({
      ...station,
      services: station.services || null,
      parkingDetails: station.parkingDetails || null,
    }));

    console.log("Stations envoyées par l'API:", formattedStations);

    return NextResponse.json(formattedStations);
  } catch (error) {
    console.error("Erreur lors de la récupération des stations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des stations" },
      { status: 500 }
    );
  }
}
