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
        services: {
          select: {
            highPressure: true,
            tirePressure: true,
            vacuum: true,
            handicapAccess: true,
            wasteWater: true,
            paymentMethods: true,
            electricity: true,
            maxVehicleLength: true,
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

    // Calculer la moyenne des notes pour chaque station
    const stationsWithAverageRating = stations.map((station) => ({
      ...station,
      averageRating:
        station.reviews.length > 0
          ? station.reviews.reduce((acc, review) => acc + review.rating, 0) /
            station.reviews.length
          : 0,
    }));

    return new NextResponse(
      JSON.stringify({
        success: true,
        stations: stationsWithAverageRating,
      }),
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des stations:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Une erreur inconnue est survenue",
      },
      { status: 500 }
    );
  }
}
