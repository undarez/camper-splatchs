import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";

export async function GET() {
  try {
    // Récupérer la session NextAuth
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Récupérer l'email administrateur depuis les variables d'environnement
    const adminEmail =
      process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;

    // Vérifier si l'utilisateur est l'administrateur
    const isAdmin = session.user.email === adminEmail;

    // Retourner les informations de l'utilisateur
    return NextResponse.json({
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: isAdmin ? "ADMIN" : session.user.role || "USER",
      isAdmin,
      adminEmail,
      env: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}
