import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";
import { cookies } from "next/headers";

export async function GET() {
  try {
    console.log("API User: Début de la vérification du statut utilisateur");

    // Récupérer la session NextAuth
    const session = await getServerSession(authOptions);
    console.log("API User: Session récupérée:", session ? "Oui" : "Non");

    // Récupérer l'email administrateur depuis les variables d'environnement
    const adminEmail =
      process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
    console.log("API User: Email administrateur configuré:", adminEmail);

    // Vérifier les cookies de session
    const cookieStore = cookies();
    const sessionToken =
      cookieStore.get("next-auth.session-token") ||
      cookieStore.get("__Secure-next-auth.session-token");
    console.log(
      "API User: Cookie de session présent:",
      sessionToken ? "Oui" : "Non"
    );

    if (!session?.user) {
      console.log("API User: Utilisateur non authentifié");

      // Retourner un statut spécial pour indiquer que l'utilisateur n'est pas connecté
      // mais que l'API fonctionne correctement
      return NextResponse.json(
        {
          authenticated: false,
          message: "Non authentifié",
          adminEmail,
          env: process.env.NODE_ENV,
          hasSessionCookie: !!sessionToken,
        },
        { status: 200 }
      );
    }

    // Vérifier si l'utilisateur est l'administrateur
    const isAdmin = session.user.email === adminEmail;
    console.log("API User: Email utilisateur:", session.user.email);
    console.log("API User: Est administrateur:", isAdmin);
    console.log("API User: Rôle utilisateur:", session.user.role);

    // Retourner les informations de l'utilisateur
    return NextResponse.json({
      authenticated: true,
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: isAdmin ? "ADMIN" : session.user.role || "USER",
      isAdmin,
      adminEmail,
      env: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error(
      "API User: Erreur lors de la récupération de l'utilisateur:",
      error
    );
    return NextResponse.json(
      {
        error: "Erreur serveur interne",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
