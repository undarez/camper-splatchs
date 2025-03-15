import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/AuthOptions";
import prisma from "../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer les données de la requête
    const data = await req.json();
    const { pointsToAdd } = data;

    if (typeof pointsToAdd !== "number") {
      return NextResponse.json(
        { error: "Le paramètre pointsToAdd doit être un nombre" },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur actuel
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { ecoPoints: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Calculer les nouveaux points
    const newPoints = (user.ecoPoints || 0) + pointsToAdd;

    // Mettre à jour les points de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { ecoPoints: newPoints },
      select: { ecoPoints: true },
    });

    return NextResponse.json({
      success: true,
      ecoPoints: updatedUser.ecoPoints,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des points:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
