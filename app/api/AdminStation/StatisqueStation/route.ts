import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/AuthOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session?.user?.email ||
      session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL
    ) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer les statistiques
    const [totalStations, activeStations, pendingStations, analytics] =
      await Promise.all([
        prisma.station.count(),
        prisma.station.count({ where: { status: "active" } }),
        prisma.station.count({ where: { status: "en_attente" } }),
        prisma.analytics.findMany({
          where: {
            timestamp: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30)), // Dernier mois
            },
          },
        }),
      ]);

    // Calculer les visites hebdomadaires
    const weekAgo = new Date(new Date().setDate(new Date().getDate() - 7));
    const weeklyVisits = analytics.filter((a) => a.timestamp >= weekAgo).length;

    // Calculer les visites mensuelles
    const monthlyVisits = analytics.length;

    return NextResponse.json({
      totalStations,
      activeStations,
      pendingStations,
      weeklyVisits,
      monthlyVisits,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
