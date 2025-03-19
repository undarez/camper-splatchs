import { NextResponse } from "next/server";
import { sendContactEmail } from "@/app/lib/emailService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    const result = await sendContactEmail({ name, email, message });

    if (!result.success) {
      console.error("Erreur lors de l'envoi de l'email:", result.error);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Email envoyé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors du traitement de la requête:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
