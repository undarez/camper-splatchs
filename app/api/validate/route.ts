import { NextResponse } from "next/server";
import { sendStationValidationEmail } from "@/app/lib/emailService";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/AuthOptions";
import prisma from "@/lib/prisma";

const validationSchema = z.object({
  stationId: z.string().min(1, "L'ID de la station est requis"),
});

export async function POST(request: Request) {
  try {
    console.log("🚀 Début de la validation de la station");

    // Vérifier l'authentification de l'administrateur
    const session = await getServerSession(authOptions);
    console.log("Session:", session?.user?.email);

    if (!session?.user?.email) {
      console.log("❌ Utilisateur non authentifié");
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Vérifier que l'utilisateur est un administrateur
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });
    console.log("Role utilisateur:", user?.role);

    if (user?.role !== "ADMIN") {
      console.log("❌ Utilisateur non admin");
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Données reçues:", body);

    const validatedData = validationSchema.parse(body);
    console.log("Données validées:", validatedData);

    // Récupérer les informations de la station
    const station = await prisma.station.findUnique({
      where: { id: validatedData.stationId },
      include: { author: true },
    });
    console.log("Station trouvée:", station);

    if (!station) {
      console.log("❌ Station non trouvée");
      return NextResponse.json(
        { error: "Station non trouvée" },
        { status: 404 }
      );
    }

    // Mettre à jour le statut de la station
    console.log("Mise à jour du statut de la station...");
    await prisma.station.update({
      where: { id: validatedData.stationId },
      data: { status: "active" },
    });
    console.log("✅ Statut de la station mis à jour");

    // Envoyer l'email de validation si l'auteur existe
    if (station.author?.email) {
      console.log("Envoi de l'email de validation à:", station.author.email);
      const result = await sendStationValidationEmail(
        station.author.email,
        station.name,
        station.type
      );

      if (!result.success) {
        console.error("❌ Erreur lors de l'envoi de l'email de validation");
      } else {
        console.log("✅ Email de validation envoyé avec succès");
      }
    } else {
      console.log("⚠️ Pas d'email d'auteur trouvé pour la station");
    }

    return NextResponse.json({
      success: true,
      message: "Station validée et email envoyé avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur détaillée lors de la validation:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement de la demande" },
      { status: 500 }
    );
  }
}
