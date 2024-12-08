import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const stations = await prisma.station.findMany({
      include: {
        services: true,
        author: true,
      },
    });
    return NextResponse.json({ success: true, stations });
  } catch (error) {
    console.error("Erreur lors de la récupération des stations:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Une erreur inconnue est survenue";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
