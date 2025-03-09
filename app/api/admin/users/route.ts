import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";

export async function GET() {
  try {
    console.log("API: Début de la récupération des utilisateurs");
    const session = await getServerSession(authOptions);
    console.log("API: Session récupérée:", session ? "Oui" : "Non");

    if (!session?.user) {
      console.log("API: Utilisateur non authentifié");
      return new NextResponse("Non authentifié", { status: 401 });
    }

    // Récupérer l'email administrateur depuis les variables d'environnement
    const adminEmail =
      process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
    console.log("API: Email administrateur:", adminEmail);
    console.log("API: Email utilisateur:", session.user.email);
    console.log("API: Rôle utilisateur:", session.user.role);

    // Vérifier si l'utilisateur est un administrateur (par rôle ou par email)
    if (session.user.role !== "ADMIN" && session.user.email !== adminEmail) {
      console.log("API: Utilisateur non autorisé");
      return new NextResponse("Non autorisé", { status: 403 });
    }

    console.log("API: Récupération des utilisateurs depuis la base de données");
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

    console.log("API: Utilisateurs récupérés:", users.length);
    return NextResponse.json(users);
  } catch (error) {
    console.error("[USERS_GET]", error);
    return new NextResponse("Erreur interne", { status: 500 });
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
