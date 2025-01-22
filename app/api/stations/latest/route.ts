import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const latestStations = await prisma.station.findMany({
      where: {
        status: "active",
      },
      include: {
        services: true,
        parkingDetails: {
          select: {
            id: true,
            isPayant: true,
            tarif: true,
            taxeSejour: true,
            hasElectricity: true,
            commercesProches: true,
            handicapAccess: true,
            totalPlaces: true,
            hasWifi: true,
            hasChargingPoint: true,
            waterPoint: true,
            wasteWater: true,
            wasteWaterDisposal: true,
            blackWaterDisposal: true,
            createdAt: true,
          },
        },
        reviews: {
          select: {
            rating: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });

    if (!latestStations || latestStations.length === 0) {
      return NextResponse.json([]);
    }

    const stationsWithDetails = latestStations.map((station) => {
      const averageRating = station.reviews.length
        ? station.reviews.reduce((acc, review) => acc + review.rating, 0) /
          station.reviews.length
        : 0;

      return {
        ...station,
        images: Array.isArray(station.images) ? station.images : [],
        services: station.services,
        parkingDetails: station.parkingDetails,
        reviews: station.reviews,
        averageRating: Number(averageRating.toFixed(1)),
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
