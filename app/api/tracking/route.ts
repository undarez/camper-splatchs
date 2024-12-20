import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { subDays } from "date-fns";

export async function GET() {
  try {
    // Calculer les dates pour la semaine et le mois en cours
    const oneWeekAgo = subDays(new Date(), 7);
    const oneMonthAgo = subDays(new Date(), 30);

    // Récupérer les statistiques des stations
    const [weeklyStations, monthlyStations, weeklyVisits, monthlyVisits] =
      await Promise.all([
        // Stations créées cette semaine
        prisma.station.count({
          where: {
            createdAt: {
              gte: oneWeekAgo,
            },
          },
        }),
        // Stations créées ce mois
        prisma.station.count({
          where: {
            createdAt: {
              gte: oneMonthAgo,
            },
          },
        }),
        // Visites cette semaine
        prisma.visit.count({
          where: {
            createdAt: {
              gte: oneWeekAgo,
            },
          },
        }),
        // Visites ce mois
        prisma.visit.count({
          where: {
            createdAt: {
              gte: oneMonthAgo,
            },
          },
        }),
      ]);

    return NextResponse.json({
      weeklyStations,
      monthlyStations,
      weeklyVisits,
      monthlyVisits,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}
