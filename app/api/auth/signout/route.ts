import { NextResponse } from "next/server";
import { signOutUser, AuthError } from "@/lib/supabaseUtils";

export async function POST() {
  try {
    // Déconnecter l'utilisateur
    try {
      await signOutUser();

      // Retourner une réponse de succès
      return NextResponse.json({
        message: "Déconnexion réussie",
      });
    } catch (error) {
      if (error instanceof AuthError) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json(
        { error: "Erreur lors de la déconnexion" },
        { status: 400 }
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
