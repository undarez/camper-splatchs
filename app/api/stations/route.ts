import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const stations = await prisma.station.findMany({
      include: {
        services: true,
        parkingDetails: true,
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
