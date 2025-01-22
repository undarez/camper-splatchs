import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ElectricityType } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const latestStations = await prisma.station.findMany({
      where: {
        status: "active",
      },
      include: {
        services: true,
        parkingDetails: true,
        reviews: {
          select: {
            id: true,
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

      // S'assurer que parkingDetails a toutes les propriétés requises
      const formattedParkingDetails = station.parkingDetails
        ? {
            id: station.parkingDetails.id,
            isPayant: station.parkingDetails.isPayant,
            tarif: station.parkingDetails.tarif,
            taxeSejour: station.parkingDetails.taxeSejour,
            hasElectricity: station.parkingDetails
              .hasElectricity as ElectricityType,
            commercesProches: station.parkingDetails.commercesProches,
            handicapAccess: station.parkingDetails.handicapAccess,
            totalPlaces: station.parkingDetails.totalPlaces,
            hasWifi: station.parkingDetails.hasWifi,
            hasChargingPoint: station.parkingDetails.hasChargingPoint,
            waterPoint: station.parkingDetails.waterPoint,
            wasteWater: station.parkingDetails.wasteWater,
            wasteWaterDisposal: station.parkingDetails.wasteWaterDisposal,
            blackWaterDisposal: station.parkingDetails.blackWaterDisposal,
            createdAt: station.parkingDetails.createdAt,
          }
        : null;

      return {
        ...station,
        images: Array.isArray(station.images) ? station.images : [],
        services: station.services,
        parkingDetails: formattedParkingDetails,
        reviews: station.reviews.map((review) => ({
          ...review,
          author: review.author,
        })),
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
