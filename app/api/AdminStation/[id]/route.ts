import { NextResponse } from "next/dist/server/web/spec-extension/response";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/AuthOptions";
import { HighPressureType } from "@prisma/client";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email !== "fortuna77320@gmail.com") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { status } = await request.json();

    const result = await prisma.$transaction(async (tx) => {
      const existingStation = await tx.station.findUnique({
        where: { id: params.id },
        include: { services: true },
      });

      if (!existingStation) {
        throw new Error("Station non trouvée");
      }

      // Vérifier si un service existe déjà
      if (existingStation.services) {
        await tx.service.update({
          where: { stationId: params.id },
          data: {
            highPressure: existingStation.services.highPressure,
            tirePressure: existingStation.services.tirePressure,
            vacuum: existingStation.services.vacuum,
            handicapAccess: existingStation.services.handicapAccess,
            wasteWater: existingStation.services.wasteWater,
          },
        });
      } else {
        await tx.service.create({
          data: {
            stationId: params.id,
            highPressure: HighPressureType.NONE,
            tirePressure: false,
            vacuum: false,
            handicapAccess: false,
            wasteWater: false,
          },
        });
      }

      // Mettre à jour la station avec le nouveau statut
      const updatedStation = await tx.station.update({
        where: { id: params.id },
        data: {
          status: status,
          ...(status === "active"
            ? {
                validatedAt: new Date(),
                validatedBy: session.user.email,
              }
            : {}),
        },
        include: {
          services: true,
          author: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return updatedStation;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur lors de la mise à jour", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.email !== "fortuna77320@gmail.com") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Supprimer d'abord les services associés
    await prisma.service.deleteMany({
      where: { stationId: params.id },
    });

    // Puis supprimer la station
    await prisma.station.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Station supprimée" });
  } catch (error) {
    console.error("Erreur lors de la suppression", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
