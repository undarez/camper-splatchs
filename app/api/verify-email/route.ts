import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify?token=${token}`;

  return transporter.sendMail({
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: "Vérifiez votre compte CamperWash",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Bienvenue sur CamperWash, ${name} !</h2>
        <p>Merci de vous être inscrit sur CamperWash. Pour finaliser votre inscription, veuillez cliquer sur le bouton ci-dessous :</p>
        <p style="text-align: center;">
          <a href="${verificationUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; font-weight: bold;">
            Vérifier mon compte
          </a>
        </p>
        <p style="color: #666;">Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :</p>
        <p style="background: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #666; font-size: 0.9em;">⚠️ Ce lien expirera dans 24 heures.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 0.8em;">Si vous n'avez pas créé de compte sur CamperWash, vous pouvez ignorer cet email.</p>
      </div>
    `,
  });
}

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json(
      { error: "Content-type doit être application/json" },
      { status: 415 }
    );
  }

  try {
    const body = await request.json();
    const { email, name, token } = body;

    if (!email || !name || !token) {
      return NextResponse.json(
        { error: "Email, nom et token sont requis" },
        { status: 400 }
      );
    }

    if (!process.env.ADMIN_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json(
        { error: "Configuration email manquante" },
        { status: 500 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Token de vérification invalide" },
        { status: 400 }
      );
    }

    await sendVerificationEmail(email, name, token);

    return NextResponse.json({
      success: true,
      message: "Email de vérification envoyé",
    });
  } catch (error) {
    console.error("VERIFICATION_ERROR:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/signin?error=missing_token", request.url)
    );
  }

  try {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL("/signin?error=invalid_token", request.url)
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
      },
    });

    return NextResponse.redirect(new URL("/signin?verified=true", request.url));
  } catch (error) {
    console.error("VERIFY_ERROR:", error);
    return NextResponse.redirect(
      new URL("/signin?error=verification_failed", request.url)
    );
  }
}
