import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Nombre total de stations actives
    const stations = await prisma.station.count({
      where: {
        status: "active",
      },
    });

    // Nombre total d'utilisateurs
    const users = await prisma.user.count();

    // Nombre total d'avis sur les stations actives
    const reviews = await prisma.review.count({
      where: {
        station: {
          status: "active",
        },
      },
    });

    // Derniers avis
    const recentReviews = await prisma.review.findMany({
      where: {
        station: {
          status: "active",
        },
      },
      select: {
        content: true,
        rating: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 2,
    });

    const formattedReviews = recentReviews.map((review) => ({
      userName: review.author?.name?.split(" ")[0] || "Anonyme",
      rating: review.rating,
      comment: review.content,
      createdAt: review.createdAt,
    }));

    return NextResponse.json({
      statistics: {
        stations,
        users,
        reviews,
      },
      recentReviews: formattedReviews,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
