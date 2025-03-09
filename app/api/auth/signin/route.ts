import { NextResponse } from "next/server";
import { signInUser, AuthError } from "@/lib/prismaAuth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Vérifier la connexion à la base de données
    console.log("Vérification de la connexion à la base de données...");
    try {
      await prisma.$connect();
      console.log("Connexion à la base de données réussie");
    } catch (dbError) {
      console.error("Erreur de connexion à la base de données:", dbError);
      return NextResponse.json(
        { error: "Erreur de connexion à la base de données" },
        { status: 500 }
      );
    }

    // 1. Extraire les données de la requête
    const body = await request.json();
    const { email, password } = body;

    // 2. Valider les données requises
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe sont requis" },
        { status: 400 }
      );
    }

    // 3. Connecter l'utilisateur
    try {
      const user = await signInUser({ email, password });

      // 4. Retourner une réponse de succès
      return NextResponse.json({
        message: "Connexion réussie",
        user,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }

      return NextResponse.json(
        { error: "Erreur lors de la connexion" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Erreur non gérée:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  } finally {
    // Déconnecter Prisma pour éviter les fuites de connexion
    await prisma.$disconnect();
  }
}
