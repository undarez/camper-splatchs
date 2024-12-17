import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Nombre total de stations
    const totalStations = await prisma.station.count();

    // Nombre total d'utilisateurs
    const totalUsers = await prisma.user.count();

    // Nombre total d'avis
    const totalReviews = await prisma.review.count();

    // Derniers avis
    const recentReviews = await prisma.review.findMany({
      take: 2,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    const formattedReviews = recentReviews.map((review) => ({
      userName: review.author?.name?.split(" ")[0] || "Anonyme",
      rating: review.rating,
      comment: review.content,
      createdAt: review.createdAt,
    }));

    return NextResponse.json({
      statistics: {
        stations: totalStations,
        users: totalUsers,
        reviews: totalReviews,
      },
      recentReviews: formattedReviews,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
