import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const [totalStations, activeStations, pendingStations] = await Promise.all([
      // Total des stations
      prisma.station.count(),
      // Stations actives
      prisma.station.count({
        where: {
          status: "active",
        },
      }),
      // Stations en attente
      prisma.station.count({
        where: {
          status: "en_attente",
        },
      }),
    ]);

    return NextResponse.json({
      totalStations,
      activeStations,
      pendingStations,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}
