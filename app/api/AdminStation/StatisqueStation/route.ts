import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const totalStations = await prisma.station.count();
    const activeStations = await prisma.station.count({
      where: { status: "active" },
    });
    const pendingStations = await prisma.station.count({
      where: { status: "en_attente" },
    });
    const inactiveStations = await prisma.station.count({
      where: { status: "inactive" },
    });

    const services = await prisma.service.findMany({
      select: {
        highPressure: true,
        tirePressure: true,
        vacuum: true,
        handicapAccess: true,
        wasteWater: true,
      },
    });

    const stationsPerService = [
      {
        name: "Haute pression",
        count: services.filter((s) => s.highPressure !== "NONE").length,
      },
      {
        name: "Gonflage pneus",
        count: services.filter((s) => s.tirePressure).length,
      },
      {
        name: "Aspirateur",
        count: services.filter((s) => s.vacuum).length,
      },
      {
        name: "Accès PMR",
        count: services.filter((s) => s.handicapAccess).length,
      },
      {
        name: "Eaux usées",
        count: services.filter((s) => s.wasteWater).length,
      },
    ];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentStations = await prisma.station.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const recentActivity = recentStations.map((station) => ({
      date: station.createdAt.toISOString().split("T")[0],
      count: 1,
      type: "creation" as const,
    }));

    return NextResponse.json({
      totalStations,
      activeStations,
      pendingStations,
      inactiveStations,
      stationsPerService,
      recentActivity,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
