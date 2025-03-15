import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/AuthOptions";
import prisma from "../../../../lib/prisma";
import stationsData from "../../../../data/stations.json";

export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    console.log("Session user ID:", session.user.id);
    console.log("Session user:", session.user);

    // Vérifier que l'utilisateur existe dans la base de données
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });

    console.log("User found in database:", user);

    if (!user) {
      // Essayer de trouver l'utilisateur par email
      const userByEmail = session.user.email
        ? await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
          })
        : null;

      console.log("User found by email:", userByEmail);

      if (userByEmail) {
        // Utiliser l'ID trouvé dans la base de données
        session.user.id = userByEmail.id;
      } else {
        return NextResponse.json(
          { error: "Utilisateur non trouvé", sessionUserId: session.user.id },
          { status: 404 }
        );
      }
    }

    // Récupérer les données de la requête
    const data = await req.json();
    const {
      stationId,
      stationName,
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

    // Vérifier si la station existe déjà dans la base de données
    const existingStation = await prisma.station.findUnique({
      where: { id: stationId },
      select: { id: true },
    });

    // Enregistrer l'historique de lavage avec les informations de la station
    const washHistory = await prisma.washHistory.create({
      data: {
        userId: session.user.id,
        stationId: existingStation ? existingStation.id : null, // Utiliser null si la station n'existe pas
        stationName: stationName || jsonStation.name,
        stationAddress: jsonStation.address || "",
        stationCity: jsonStation.city || "",
        washType,
        vehicleSize,
        duration,
        waterUsed,
        waterSaved,
        ecoPoints,
        date: new Date(),
      },
    });

    // Mettre à jour les points de l'utilisateur
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ecoPoints: {
          increment: ecoPoints,
        },
      },
    });

    // Retourner l'historique avec les informations de la station du fichier JSON
    return NextResponse.json({
      success: true,
      washHistory: {
        ...washHistory,
        station: {
          id: jsonStation.id,
          name: jsonStation.name,
          address: jsonStation.address,
          city: jsonStation.city,
          // Ajouter d'autres informations de la station si nécessaire
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'historique:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
