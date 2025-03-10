import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";
import { cookies } from "next/headers";

export async function GET() {
  try {
    console.log("API Users: Début de la récupération des utilisateurs");

    // Récupérer la session NextAuth
    const session = await getServerSession(authOptions);
    console.log("API Users: Session récupérée:", session ? "Oui" : "Non");

    // Vérifier les cookies de session
    const cookieStore = cookies();
    const sessionToken =
      cookieStore.get("next-auth.session-token") ||
      cookieStore.get("__Secure-next-auth.session-token");
    console.log(
      "API Users: Cookie de session présent:",
      sessionToken ? "Oui" : "Non"
    );

    if (!session?.user) {
      console.log("API Users: Utilisateur non authentifié");
      return NextResponse.json(
        {
          error: "Non authentifié",
          message: "Vous devez être connecté pour accéder à cette ressource",
          hasSessionCookie: !!sessionToken,
        },
        { status: 401 }
      );
    }

    // Récupérer l'email administrateur depuis les variables d'environnement
    const adminEmail =
      process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
    console.log("API Users: Email administrateur:", adminEmail);
    console.log("API Users: Email utilisateur:", session.user.email);
    console.log("API Users: Rôle utilisateur:", session.user.role);

    // Vérifier si l'utilisateur est un administrateur (par rôle ou par email)
    const isAdmin =
      session.user.role === "ADMIN" || session.user.email === adminEmail;

    if (!isAdmin) {
      console.log("API Users: Utilisateur non autorisé");
      return NextResponse.json(
        {
          error: "Non autorisé",
          message: "Vous n'avez pas les droits d'administrateur",
          userEmail: session.user.email,
          adminEmail: adminEmail,
          userRole: session.user.role,
        },
        { status: 403 }
      );
    }

    console.log(
      "API Users: Récupération des utilisateurs depuis la base de données"
    );
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        sessions: {
          orderBy: {
            expires: "desc",
          },
          take: 1,
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("API Users: Utilisateurs récupérés:", users.length);
    return NextResponse.json(users);
  } catch (error) {
    console.error(
      "API Users: Erreur lors de la récupération des utilisateurs:",
      error
    );
    return NextResponse.json(
      {
        error: "Erreur interne",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
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

    const body = await request.json();
    const { role } = body;

    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data: { role },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du rôle:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
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

    await prisma.user.delete({
      where: { id: params.userId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}
