import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

async function verifyCaptcha(token: string) {
  try {
    if (!process.env.RECAPTCHA_SECRET_KEY) {
      console.error("RECAPTCHA_SECRET_KEY manquante");
      return false;
    }

    const url = "https://www.google.com/recaptcha/api/siteverify";
    const formData = new URLSearchParams();
    formData.append("secret", process.env.RECAPTCHA_SECRET_KEY);
    formData.append("response", token);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const data = await response.json();
    console.log("Réponse ReCaptcha:", data);
    return data.success;
  } catch (error) {
    console.error("Erreur verification captcha:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Données reçues:", {
      emailPresent: !!body.email,
      passwordPresent: !!body.password,
      captchaPresent: !!body.captchaToken,
    });

    const { email, password, captchaToken } = body;

    // Vérification des champs requis
    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("mot de passe");
    if (!captchaToken) missingFields.push("captcha");

    if (missingFields.length > 0) {
      console.log("Champs manquants:", missingFields);
      return NextResponse.json(
        {
          error: `Champs requis manquants: ${missingFields.join(", ")}`,
          missingFields,
        },
        { status: 400 }
      );
    }

    // Validation du captcha
    const isCaptchaValid = await verifyCaptcha(captchaToken);
    console.log("Résultat validation captcha:", isCaptchaValid);

    if (!isCaptchaValid) {
      return NextResponse.json(
        {
          error: "La validation du captcha a échoué. Veuillez réessayer.",
          captchaError: true,
        },
        { status: 400 }
      );
    }

    // Vérification si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("Email déjà utilisé:", email);
      return NextResponse.json(
        {
          error: "Cette adresse email est déjà utilisée",
          emailTaken: true,
        },
        { status: 400 }
      );
    }

    // Création de l'utilisateur
    const hashedPassword = await hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });

    console.log("Utilisateur créé avec succès:", { email: user.email });

    return NextResponse.json(
      { message: "Compte créé avec succès" },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return NextResponse.json(
      {
        error: "Une erreur est survenue lors de l'inscription",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
