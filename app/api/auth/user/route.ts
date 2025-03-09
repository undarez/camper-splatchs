import { NextResponse } from "next/server";
import { getCurrentUser, AuthError } from "@/lib/supabaseUtils";

export async function GET() {
  try {
    // Récupérer l'utilisateur actuel
    try {
      const user = await getCurrentUser();

      if (!user) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
      }

      // Retourner une réponse de succès
      return NextResponse.json({
        user,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json(
        { error: "Erreur lors de la récupération de l'utilisateur" },
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
