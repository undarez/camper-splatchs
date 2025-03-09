import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";

export async function GET() {
  try {
    console.log("API admin/users: Début de la requête GET");
    const session = await getServerSession(authOptions);
    console.log("Session récupérée:", JSON.stringify(session, null, 2));

    if (!session?.user) {
      console.log("API admin/users: Utilisateur non authentifié");
      return new NextResponse("Non authentifié", { status: 401 });
    }

    // Vérifier si l'utilisateur est un administrateur en utilisant le rôle
    console.log(
      `API admin/users: Vérification du rôle - Rôle actuel: ${session.user.role}, Email: ${session.user.email}`
    );
    console.log(
      `API admin/users: Email admin attendu: ${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`
    );

    if (session.user.role !== "ADMIN") {
      console.log("API admin/users: L'utilisateur n'a pas le rôle ADMIN");

      // Vérification de secours basée sur l'email
      if (session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        console.log(
          "API admin/users: L'email correspond à l'email admin, mise à jour du rôle"
        );
        // Si l'email correspond mais que le rôle n'est pas ADMIN, mettre à jour le rôle
        try {
          await prisma.user.update({
            where: { email: session.user.email },
            data: { role: "ADMIN" },
          });
          console.log(
            "API admin/users: Rôle utilisateur mis à jour vers ADMIN"
          );
        } catch (updateError) {
          console.error(
            "API admin/users: Erreur lors de la mise à jour du rôle:",
            updateError
          );
        }
      } else {
        console.log(
          "API admin/users: L'email ne correspond pas à l'email admin"
        );
        return new NextResponse("Non autorisé", { status: 403 });
      }
    }

    console.log("API admin/users: Récupération des utilisateurs");
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
    console.log(`API admin/users: ${users.length} utilisateurs récupérés`);

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
