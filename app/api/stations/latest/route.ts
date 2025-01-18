import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const latestStations = await prisma.station.findMany({
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        services: true,
        parkingDetails: true,
        reviews: true,
      },
      where: {
        status: "active",
      },
    });

    const stationsWithDetails = latestStations.map((station) => {
      const averageRating = station.reviews.length
        ? station.reviews.reduce((acc, review) => acc + review.rating, 0) /
          station.reviews.length
        : 0;

      return {
        ...station,
        images: station.images || [],
        averageRating,
      };
    });

    return NextResponse.json(stationsWithDetails);
  } catch (error) {
    console.error("Erreur lors de la récupération des stations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des stations" },
      { status: 500 }
    );
  }
}
