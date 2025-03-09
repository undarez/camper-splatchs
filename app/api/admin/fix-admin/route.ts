import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Récupérer l'email administrateur depuis les variables d'environnement
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (!adminEmail) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Variable d'environnement NEXT_PUBLIC_ADMIN_EMAIL non définie",
        },
        { status: 500 }
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

      return NextResponse.json({
        success: true,
        message: "Rôle administrateur mis à jour avec succès",
        user: updatedUser,
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
