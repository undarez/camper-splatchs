import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/AuthOptions";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    const { stationId } = await request.json();
    if (!stationId) {
      return NextResponse.json(
        { error: "L'ID de la station est requis" },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Créer une nouvelle visite
    const visit = await prisma.visit.create({
      data: {
        userId: user.id,
        stationId,
      },
    });

    return NextResponse.json(visit);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la visite:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement de la visite" },
      { status: 500 }
    );
  }
}
