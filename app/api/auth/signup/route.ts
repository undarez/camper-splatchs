import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Données reçues:", {
      emailPresent: !!body.email,
      passwordPresent: !!body.password,
    });

    const { email, password } = body;

    // Vérification des champs requis
    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("mot de passe");

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

    // Génération du token de vérification
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await hash(password, 12);

    // Création de l'utilisateur avec le token de vérification
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        verificationToken,
      },
    });

    // Envoi de l'email de vérification
    const emailSent = await sendVerificationEmail(email, verificationToken);

    if (!emailSent) {
      // Si l'email n'a pas pu être envoyé, on supprime l'utilisateur
      await prisma.user.delete({
        where: { id: user.id },
      });

      return NextResponse.json(
        {
          error: "Erreur lors de l'envoi de l'email de vérification",
        },
        { status: 500 }
      );
    }

    console.log("Utilisateur créé avec succès:", { email: user.email });

    return NextResponse.json(
      {
        message:
          "Compte créé avec succès. Veuillez vérifier votre email pour activer votre compte.",
      },
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
