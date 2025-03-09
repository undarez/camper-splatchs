import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Non authentifié", { status: 401 });
    }

    // Vérifier si l'utilisateur est un administrateur
    if (
      session.user.role !== "ADMIN" &&
      session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL
    ) {
      return new NextResponse("Non autorisé", { status: 403 });
    }

    // Récupérer les variables d'environnement pertinentes
    const envVars = {
      NEXT_PUBLIC_ADMIN_EMAIL:
        process.env.NEXT_PUBLIC_ADMIN_EMAIL || "Non défini",
      NODE_ENV: process.env.NODE_ENV || "Non défini",
      SESSION_USER: {
        email: session.user.email,
        role: session.user.role,
        name: session.user.name,
      },
    };

    return NextResponse.json(envVars);
  } catch (error) {
    console.error("Erreur debug:", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
