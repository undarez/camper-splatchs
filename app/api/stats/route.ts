import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Données simulées pour la démo
    const stats = {
      totalStations: 15,
      totalUsers: 45,
      totalParkings: 8,
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
