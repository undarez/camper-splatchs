import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/AuthOptions";

// Forcer le rendu dynamique pour cette route
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Retourner un tableau vide car nous n'utilisons plus la base de données
    return NextResponse.json({
      success: true,
      washHistory: [],
      message:
        "Le simulateur ne sauvegarde pas l'historique. Les données sont stockées temporairement dans le navigateur.",
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
