import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";
import prisma from "@/lib/prisma";
import { decryptFromDatabase } from "@/lib/encryption";

// Indiquer que cette route est dynamique
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer les données de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        notes: true,
        reviews: {
          select: {
            encryptedContent: true,
            rating: true,
            createdAt: true,
          },
        },
        stations: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Préparer les données pour l'export
    const userData = {
      informationsPersonnelles: {
        email: user.email,
        nom: user.name,
        dateInscription: user.createdAt,
      },
      notes: user.notes.map((note) => ({
        date: note.date,
        contenu: note.content,
        créeLe: note.createdAt,
        modifiéLe: note.updatedAt,
      })),
      avis: user.reviews.map((review) => ({
        contenu: review.encryptedContent
          ? decryptFromDatabase(review.encryptedContent)
          : "",
        note: review.rating,
        créeLe: review.createdAt,
      })),
      stations: user.stations.map((station) => ({
        nom: station.name,
        adresse: station.address,
        ville: station.city,
        codePostal: station.postalCode,
        type: station.type,
        créeLe: station.createdAt,
      })),
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Erreur lors de l'export des données:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'export des données" },
      { status: 500 }
    );
  }
}
