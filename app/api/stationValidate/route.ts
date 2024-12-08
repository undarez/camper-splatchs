import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

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

    return NextResponse.json({
      stations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des stations validées:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
