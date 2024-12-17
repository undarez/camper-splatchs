import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();

    if (
      !session?.user?.email ||
      session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL
    ) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        sessions: {
          orderBy: {
            expires: "desc",
          },
          take: 1,
          select: {
            expires: true,
          },
        },
      },
      orderBy: [
        {
          emailVerified: "desc",
        },
      ],
    });

    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.emailVerified,
      lastLogin: user.sessions[0]?.expires || user.emailVerified,
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return new NextResponse("Erreur interne du serveur", { status: 500 });
  }
}

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
