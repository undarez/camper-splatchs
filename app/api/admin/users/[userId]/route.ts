import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/AuthOptions";

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

    if (!["USER", "ADMIN"].includes(role)) {
      return new NextResponse("Rôle invalide", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: params.userId,
      },
      data: {
        role: role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
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
      where: {
        id: params.userId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}
