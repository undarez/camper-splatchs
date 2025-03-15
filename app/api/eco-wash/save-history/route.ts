import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/AuthOptions";
import stationsData from "../../../../data/stations.json";

export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer les données de la requête
    const data = await req.json();
    const {
      stationId,
      washType,
      vehicleSize,
      duration,
      waterUsed,
      waterSaved,
      ecoPoints,
    } = data;

    // Validation des données
    if (
      !stationId ||
      !washType ||
      !vehicleSize ||
      !duration ||
      !waterUsed ||
      !waterSaved ||
      !ecoPoints
    ) {
      return NextResponse.json(
        { error: "Données incomplètes" },
        { status: 400 }
      );
    }

    // Vérifier si la station existe dans le fichier JSON
    const jsonStation = stationsData.stations.find(
      (station) => station.id === stationId
    );

    if (!jsonStation) {
      return NextResponse.json(
        { error: "Station non trouvée dans le fichier JSON" },
        { status: 404 }
      );
    }

    // Créer un objet de simulation sans sauvegarder dans la base de données
    const simulationResult = {
      id: `sim_${Date.now()}`,
      userId: session.user.id,
      stationId: stationId,
      date: new Date(),
      washType,
      vehicleSize,
      duration,
      waterUsed,
      waterSaved,
      ecoPoints,
      station: {
        id: jsonStation.id,
        name: jsonStation.name,
        address: jsonStation.address,
        city: jsonStation.city,
      },
      // Ajouter des statistiques supplémentaires pour le simulateur
      stats: {
        waterSavedPercentage: Math.round(
          (waterSaved / (waterUsed + waterSaved)) * 100
        ),
        ecoImpact: {
          treesEquivalent: Math.round(waterSaved / 100), // Exemple: 1 arbre pour 100L d'eau économisée
          co2Reduction: Math.round(waterSaved * 0.5), // Exemple: 0.5kg de CO2 par litre d'eau économisée
        },
        comparison: {
          showers: Math.round(waterSaved / 60), // Exemple: 1 douche = 60L
          bottlesOfWater: Math.round(waterSaved / 1.5), // Exemple: 1 bouteille = 1.5L
        },
      },
    };

    // Retourner le résultat de la simulation
    return NextResponse.json({
      success: true,
      simulation: simulationResult,
      message: "Simulation réussie ! Ces données ne sont pas sauvegardées.",
    });
  } catch (error) {
    console.error("Erreur lors de la simulation:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
