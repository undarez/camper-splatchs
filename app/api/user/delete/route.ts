import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/AuthOptions";

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Email de l'utilisateur non trouvé" },
        { status: 400 }
      );
    }

    const userEmail: string = session.user.email;

    await prisma.$transaction(async (prisma) => {
      await prisma.user.delete({
        where: {
          email: userEmail,
        },
      });
    });

    return NextResponse.json({ message: "Compte supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du compte" },
      { status: 500 }
    );
  }
}
