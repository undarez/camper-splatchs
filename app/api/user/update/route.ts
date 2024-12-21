import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/AuthOptions";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const data = await request.json();

    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        name: data.name,
        department: data.department,
        age: data.age ? parseInt(data.age) : null,
        camperModel: data.camperModel,
        usageFrequency: data.usageFrequency,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser,
        name: data.name,
        department: data.department,
        camperModel: data.camperModel,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}
