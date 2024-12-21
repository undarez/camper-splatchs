import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/AuthOptions";

export async function DELETE(_request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Supprimer l'utilisateur et toutes ses données associées
    await prisma.user.delete({
      where: {
        email: session.user.email,
      },
    });

    return NextResponse.json(
      { message: "Compte supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE_ACCOUNT_ERROR", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du compte" },
      { status: 500 }
    );
  }
}
