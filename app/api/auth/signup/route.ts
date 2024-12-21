import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

async function verifyCaptcha(token: string) {
  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      {
        method: "POST",
      }
    );
    const data = await response.json();
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
      email: body.email,
      captchaToken: !!body.captchaToken,
    });

    const { email, password, captchaToken } = body;

    if (!email || !password) {
      console.log("Email ou mot de passe manquant");
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    if (!captchaToken) {
      console.log("Token captcha manquant");
      return NextResponse.json(
        { error: "Validation du captcha requise" },
        { status: 400 }
      );
    }

    const isCaptchaValid = await verifyCaptcha(captchaToken);
    console.log("Résultat validation captcha:", isCaptchaValid);

    if (!isCaptchaValid) {
      return NextResponse.json(
        { error: "Validation du captcha invalide" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      console.log("Email déjà utilisé:", email);
      return NextResponse.json(
        { error: "Email déjà utilisé" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });

    console.log("Utilisateur créé avec succès:", { email: user.email });

    return NextResponse.json(
      { message: "Utilisateur créé avec succès" },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}
