import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [totalStations, totalUsers, totalReviews, totalVisits] =
      await Promise.all([
        prisma.station.count(),
        prisma.user.count(),
        prisma.review.count(),
        prisma.visit.count(),
      ]);

    const stats = {
      totalStations,
      totalUsers,
      totalReviews,
      totalVisits,
      totalParkings: await prisma.station.count({
        where: {
          hasParking: true,
        },
      }),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des statistiques",
      },
      { status: 500 }
    );
  }
}
