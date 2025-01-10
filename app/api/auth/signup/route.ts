import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/app/lib/server/emailService";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });
    const verificationToken = uuidv4();

    // Créer l'utilisateur dans Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: "USER",
          isActive: false,
          verificationToken,
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { error: "Erreur lors de la création du compte" },
        { status: 400 }
      );
    }

    // Envoyer l'email de vérification avec Nodemailer
    const emailSent = await sendVerificationEmail(email, verificationToken);

    if (!emailSent) {
      // Si l'email n'a pas pu être envoyé, on supprime l'utilisateur
      await supabase.auth.admin.deleteUser(user?.id || "");
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email de vérification" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Vérifiez votre email pour activer votre compte",
      user,
    });
  } catch (error) {
    console.error("Erreur lors de la création du compte", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
