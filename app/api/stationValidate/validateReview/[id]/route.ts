import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/AuthOptions";
import { encryptForDatabase } from "@/lib/encryption";

const FORBIDDEN_WORDS = ["list", "of", "forbidden", "words"];

function validateReview(content: string): boolean {
  const lowercaseContent = content.toLowerCase();
  if (content.length > 800) return false;
  return !FORBIDDEN_WORDS.some((word) => lowercaseContent.includes(word));
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Email non trouvé" }, { status: 401 });
    }

    const { content, rating } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const station = await prisma.station.findUnique({
      where: { id: params.id },
    });

    if (!station) {
      return NextResponse.json(
        { error: "Station non trouvée" },
        { status: 404 }
      );
    }

    if (!validateReview(content)) {
      return NextResponse.json({ error: "Contenu invalide" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        content: content,
        encryptedContent: encryptForDatabase(content),
        rating,
        station: { connect: { id: params.id } },
        author: { connect: { id: user.id } },
      },
    });

    return NextResponse.json({
      ...review,
      content: content,
    });
  } catch (error) {
    console.error("Erreur lors de la création de l'avis:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
