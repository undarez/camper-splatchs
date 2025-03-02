import { NextResponse } from "next/server";
import stationsData from "@/data/stations.json";

export async function GET() {
  try {
    // Vérifier si les données sont correctement importées
    console.log("Nombre de stations:", stationsData.stations.length);

    // Renvoyer les 3 premières stations pour vérification
    const firstThreeStations = stationsData.stations.slice(0, 3);

    return NextResponse.json({
      success: true,
      stationsCount: stationsData.stations.length,
      firstThreeStations,
    });
  } catch (error) {
    console.error("Erreur lors de l'accès aux données des stations:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'accès aux données des stations",
        errorDetails: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
