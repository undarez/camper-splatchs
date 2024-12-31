import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Désactiver le cache pour cette route
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 10; // Stations par page
  const skip = (page - 1) * limit;

  try {
    const stations = await prisma.station.findMany({
      where: {
        status: "active",
        validatedAt: {
          not: null,
        },
      },
      include: {
        services: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    const total = await prisma.station.count({
      where: {
        status: "active",
        validatedAt: {
          not: null,
        },
      },
    });

    return new NextResponse(
      JSON.stringify({
        stations,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      }),
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des stations validées:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
