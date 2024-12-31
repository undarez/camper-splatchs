import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";

export const dynamic = "force-dynamic";

interface StatisticsData {
  labels: string[];
  values: number[];
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "daily";

  try {
    // Données simulées pour l'exemple
    const data: StatisticsData = {
      labels: [],
      values: [],
    };

    switch (period) {
      case "daily":
        data.labels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
        data.values = [30, 45, 60, 45, 35, 48, 65];
        break;
      case "monthly":
        data.labels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];
        data.values = [300, 450, 600, 450, 350, 480];
        break;
      case "yearly":
        data.labels = ["2020", "2021", "2022", "2023", "2024"];
        data.values = [3000, 4500, 6000, 4500, 3500];
        break;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
}
