import { NextResponse } from "next/server";
import { sendStationCreationEmail } from "@/app/lib/emailService";

interface StationData {
  address: string;
  latitude: number;
  longitude: number;
  createdBy?: string;
}

export async function POST(request: Request) {
  try {
    const stationData = (await request.json()) as StationData;

    if (
      !stationData.address ||
      typeof stationData.latitude !== "number" ||
      typeof stationData.longitude !== "number"
    ) {
      return NextResponse.json(
        { error: "Données de station incomplètes ou invalides" },
        { status: 400 }
      );
    }

    const result = await sendStationCreationEmail(stationData);

    if (!result.success) {
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de la notification" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Notification envoyée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors du traitement de la notification:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
