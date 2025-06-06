import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

// Fonction pour vérifier le captcha
async function verifyCaptcha(token: string) {
  try {
    console.log("Vérification du captcha avec le token:", token);

    // En production, ignorer temporairement la validation du captcha pour tester
    if (process.env.NODE_ENV === "production") {
      console.log(
        "Mode production: Validation du captcha ignorée temporairement pour le débogage"
      );
      return true;
    }

    // Vérifier si la clé secrète est définie
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.error(
        "Erreur: RECAPTCHA_SECRET_KEY n'est pas définie dans les variables d'environnement"
      );
      return false;
    }

    console.log(
      "Clé secrète du captcha (premiers caractères):",
      secretKey.substring(0, 5) + "..."
    );

    // Construire l'URL de vérification
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;

    // Préparer les données pour la requête POST
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);

    // Envoyer la requête
    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    // Vérifier si la requête a réussi
    if (!response.ok) {
      console.error(
        "Erreur lors de la vérification du captcha. Statut:",
        response.status
      );
      return false;
    }

    // Analyser la réponse
    const data = await response.json();
    console.log("Réponse de la vérification du captcha:", data);

    // Retourner le résultat de la vérification
    return data.success === true;
  } catch (error) {
    console.error("Exception lors de la vérification du captcha:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // Vérifier la méthode de la requête
    if (request.method !== "POST") {
      return NextResponse.json(
        { error: "Méthode non autorisée" },
        { status: 405 }
      );
    }

    // Lire le corps de la requête
    let body;
    try {
      body = await request.json();
      console.log(
        "Données reçues dans la requête:",
        JSON.stringify(body, null, 2)
      );
    } catch (parseError) {
      console.error(
        "Erreur lors de la lecture du corps de la requête:",
        parseError
      );
      return NextResponse.json(
        { error: "Format de requête invalide" },
        { status: 400 }
      );
    }

    // Extraire les données
    const { email, password, name, captchaToken } = body;

    // Vérifier que toutes les données requises sont présentes
    if (!email || !password || !name) {
      console.log("Erreur: Données manquantes", {
        email: !!email,
        password: !!password,
        name: !!name,
      });
      return NextResponse.json(
        { error: "Données d'inscription incomplètes" },
        { status: 400 }
      );
    }

    // Vérification du captcha
    if (!captchaToken && process.env.NODE_ENV !== "production") {
      console.log("Erreur: Token captcha manquant");
      return NextResponse.json(
        { error: "Validation du captcha requise" },
        { status: 400 }
      );
    }

    // Valider le captcha (si token présent)
    let isCaptchaValid = true;
    if (captchaToken) {
      isCaptchaValid = await verifyCaptcha(captchaToken);
      console.log("Résultat de la validation du captcha:", isCaptchaValid);
    } else {
      console.log(
        "Mode production: Validation du captcha ignorée (token manquant)"
      );
    }

    if (!isCaptchaValid && process.env.NODE_ENV !== "production") {
      console.log("Erreur: Validation du captcha échouée");
      return NextResponse.json(
        { error: "Validation du captcha échouée" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà dans Prisma
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Cette adresse email est déjà utilisée", emailTaken: true },
          { status: 400 }
        );
      }
    } catch (findError) {
      console.error("Erreur lors de la vérification de l'email:", findError);
      // Continuer malgré l'erreur, car l'utilisateur pourrait ne pas exister
    }

    // Hacher le mot de passe
    const hashedPassword = await hash(password, 12);

    // Créer l'utilisateur directement dans Prisma
    try {
      const user = await prisma.user.create({
        data: {
          email,
          name,
          hashedPassword,
          role: "USER",
        },
      });

      console.log("Utilisateur créé dans Prisma avec succès:", user.id);

      // Succès
      return NextResponse.json({
        message: "Compte créé avec succès",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (prismaError) {
      console.error(
        "Erreur Prisma lors de la création de l'utilisateur:",
        prismaError
      );
      return NextResponse.json(
        {
          error: "Erreur lors de la création du compte dans la base de données",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Exception non gérée lors de la création du compte:", error);
    return NextResponse.json(
      {
        error: "Erreur serveur interne lors de la création du compte",
      },
      { status: 500 }
    );
  }
}
