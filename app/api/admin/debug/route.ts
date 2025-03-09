import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";

export async function GET() {
  try {
    console.log("API admin/debug: Début de la requête GET");
    const session = await getServerSession(authOptions);
    console.log("Session récupérée:", JSON.stringify(session, null, 2));

    if (!session?.user) {
      console.log("API admin/debug: Utilisateur non authentifié");
      return new NextResponse("Non authentifié", { status: 401 });
    }

    // Vérifier si l'utilisateur est un administrateur en utilisant l'email
    // IMPORTANT: Cette vérification est temporaire et devrait être remplacée par une vérification de rôle
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    console.log(
      `API admin/debug: Email utilisateur: ${session.user.email}, Email admin: ${adminEmail}`
    );

    if (session.user.email !== adminEmail) {
      console.log("API admin/debug: L'email ne correspond pas à l'email admin");
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
