import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const station = await prisma.station.findUnique({
      where: {
        id: params.id,
      },
      include: {
        services: true,
        reviews: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!station) {
      return NextResponse.json(
        { error: "Station non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(station);
  } catch (error) {
    console.error("Erreur lors de la récupération de la station:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
