import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession();

    if (
      !session?.user?.email ||
      session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL
    ) {
      return new NextResponse("Non autorisé", { status: 401 });
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
    const session = await getServerSession();

    if (
      !session?.user?.email ||
      session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL
    ) {
      return new NextResponse("Non autorisé", { status: 401 });
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
