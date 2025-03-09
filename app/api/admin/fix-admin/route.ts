import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";

export async function GET() {
  try {
    // Récupérer la session
    const session = await getServerSession(authOptions);

    // Récupérer l'email administrateur depuis les variables d'environnement
    const adminEmail =
      process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Variable d'environnement d'email administrateur non définie",
        },
        { status: 500 }
      );
    }

    // Vérifier si l'utilisateur est connecté
    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Vous devez être connecté pour effectuer cette action",
        },
        { status: 401 }
      );
    }

    // Vérifier si l'utilisateur connecté est l'administrateur
    if (session.user.email !== adminEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Vous n'êtes pas autorisé à effectuer cette action",
        },
        { status: 403 }
      );
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email: adminEmail },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Utilisateur administrateur non trouvé dans la base de données",
        },
        { status: 404 }
      );
    }

    // Mettre à jour le rôle si nécessaire
    if (user.role !== "ADMIN") {
      const updatedUser = await prisma.user.update({
        where: { email: adminEmail },
        data: { role: "ADMIN" },
        select: { id: true, email: true, role: true },
      });

      // Supprimer les sessions existantes pour forcer une nouvelle connexion
      await prisma.session.deleteMany({
        where: { userId: user.id },
      });

      return NextResponse.json({
        success: true,
        message:
          "Rôle administrateur mis à jour avec succès. Veuillez vous reconnecter.",
        user: updatedUser,
        action: "logout_required",
      });
    }

    return NextResponse.json({
      success: true,
      message: "L'utilisateur a déjà le rôle administrateur",
      user,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du rôle administrateur:",
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la mise à jour du rôle administrateur",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
