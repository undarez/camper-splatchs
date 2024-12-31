import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Désactiver le cache pour cette route
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const stations = await prisma.station.findMany({
      where: {
        status: "active",
      },
      include: {
        services: true,
        parkingDetails: true,
        reviews: {
          select: {
            rating: true,
            content: true,
            createdAt: true,
            author: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
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

    // Conversion pour l'interface frontend avec calcul de la moyenne des notes
    const formattedStations = stations.map((station) => ({
      ...station,
      services: station.services || null,
      parkingDetails: station.parkingDetails || null,
      averageRating:
        station.reviews.length > 0
          ? station.reviews.reduce((acc, review) => acc + review.rating, 0) /
            station.reviews.length
          : 0,
    }));

    // Configuration des headers pour désactiver le cache
    return new NextResponse(JSON.stringify(formattedStations), {
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
