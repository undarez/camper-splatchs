import { NextResponse } from "next/server";
import { sendStationCreationConfirmationEmail } from "@/app/lib/emailService";
import { z } from "zod";

const confirmationSchema = z.object({
  userEmail: z.string().email("Email invalide"),
  stationName: z.string().min(1, "Le nom est requis"),
  stationType: z.enum(["STATION_LAVAGE", "PARKING"]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = confirmationSchema.parse(body);

    const result = await sendStationCreationConfirmationEmail(
      validatedData.userEmail,
      validatedData.stationName,
      validatedData.stationType
    );

    if (!result.success) {
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email de confirmation" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email de confirmation envoyé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de confirmation:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement de la demande" },
      { status: 500 }
    );
  }
}
