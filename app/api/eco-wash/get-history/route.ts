import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/AuthOptions";
import prisma from "../../../../lib/prisma";
import stationsData from "../../../../data/stations.json";

export async function GET() {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer l'historique des lavages
    const washHistory = await prisma.washHistory.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
      include: {
        station: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    // Créer un cache des stations du fichier JSON pour les stations manquantes
    const stationsCache = new Map();
    stationsData.stations.forEach((station) => {
      stationsCache.set(station.id, station);
    });

    // Compléter les informations des stations avec les données du fichier JSON ou les données stockées directement
    const completeWashHistory = washHistory.map((wash) => {
      // Si nous avons déjà les informations de la station dans l'historique
      if (wash.stationName) {
        return {
          ...wash,
          station: {
            id: wash.stationId || "unknown",
            name: wash.stationName,
            address: wash.stationAddress || "",
            city: wash.stationCity || "",
          },
        };
      }

      // Sinon, chercher la station dans le fichier JSON
      if (wash.stationId) {
        const jsonStation = stationsCache.get(wash.stationId);

        if (jsonStation) {
          // Si la station existe dans le fichier JSON, utiliser ses informations
          return {
            ...wash,
            station: {
              id: jsonStation.id,
              name: jsonStation.name,
              address: jsonStation.address,
              city: jsonStation.city,
              postalCode: jsonStation.postalCode,
              phoneNumber: jsonStation.phoneNumber,
              description: jsonStation.description,
              // Ajouter d'autres informations si nécessaire
            },
          };
        } else if (wash.station && wash.station.name) {
          // Si la station existe dans la base de données, utiliser ses informations
          return wash;
        }
      }

      // Si aucune information n'est disponible, utiliser un nom générique
      return {
        ...wash,
        station: { name: "Station inconnue" },
      };
    });

    return NextResponse.json({
      success: true,
      washHistory: completeWashHistory,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
