import { NextResponse } from "next/server";
import { signInUser, AuthError } from "@/lib/supabaseUtils";

export async function POST(request: Request) {
  try {
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
      const data = await signInUser({ email, password });

      // 4. Retourner une réponse de succès
      return NextResponse.json({
        message: "Connexion réussie",
        session: data.session,
        user: data.user,
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
  }
}
