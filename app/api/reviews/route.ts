import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";
import prisma from "@/lib/prisma";
import { encryptForDatabase } from "@/lib/encryption";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    const { stationId, content, rating } = await request.json();

    // Validation des données
    if (!stationId || !content || !rating) {
      return NextResponse.json(
        { error: "Toutes les informations sont requises" },
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

    // Vérifier que la station existe
    const station = await prisma.station.findUnique({
      where: { id: stationId },
    });

    if (!station) {
      return NextResponse.json(
        { error: "Station non trouvée" },
        { status: 404 }
      );
    }

    // Chiffrer le contenu de l'avis
    const encryptedContent = encryptForDatabase(content);

    // Créer l'avis
    const review = await prisma.review.create({
      data: {
        content: content, // Version non chiffrée pour l'affichage immédiat
        encryptedContent: encryptedContent, // Version chiffrée pour le stockage
        rating,
        author: { connect: { id: user.id } },
        station: { connect: { id: stationId } },
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Erreur lors de la création de l'avis:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'avis" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stationId = searchParams.get("stationId");

    if (!stationId) {
      return NextResponse.json(
        { error: "ID de station requis" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { stationId },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Erreur lors de la récupération des avis:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des avis" },
      { status: 500 }
    );
  }
}
