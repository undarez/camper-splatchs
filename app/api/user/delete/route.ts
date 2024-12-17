import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/AuthOptions";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    // Supprimer toutes les données associées à l'utilisateur
    await prisma.$transaction(async (prisma) => {
      // Supprimer les sessions de l'utilisateur
      await prisma.session.deleteMany({
        where: {
          userId: session.user.id,
        },
      });

      // Supprimer les comptes liés (Google, Facebook, etc.)
      await prisma.account.deleteMany({
        where: {
          userId: session.user.id,
        },
      });

      // Supprimer l'utilisateur lui-même
      await prisma.user.delete({
        where: {
          email: session.user.email,
        },
      });
    });

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}
