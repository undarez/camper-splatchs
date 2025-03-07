import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

    // Vérifier la connexion à la base de données
    try {
      console.log("Vérification de la connexion à la base de données...");
      console.log(
        "URL de la base de données:",
        process.env.DATABASE_URL?.substring(0, 20) + "..."
      );

      // Vérifier si Prisma peut se connecter
      await prisma.$connect();
      console.log("Connexion à la base de données réussie");
    } catch (dbConnectError) {
      console.error(
        "Erreur de connexion à la base de données:",
        dbConnectError
      );
      return NextResponse.json(
        { error: "Erreur de connexion à la base de données" },
        { status: 500 }
      );
    }

    // Créer le client Supabase
    console.log("Création du client Supabase...");
    console.log("URL Supabase:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    const supabase = createRouteHandlerClient({ cookies });

    // Créer l'utilisateur dans Supabase
    console.log("Tentative de création de l'utilisateur dans Supabase...");
    let signUpResult;
    try {
      signUpResult = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: "USER",
            isActive: true,
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        },
      });
    } catch (supabaseError) {
      console.error(
        "Exception lors de la création de l'utilisateur dans Supabase:",
        supabaseError
      );
      return NextResponse.json(
        {
          error:
            "Erreur lors de la création du compte: " + supabaseError.message,
        },
        { status: 500 }
      );
    }

    const {
      data: { user },
      error,
    } = signUpResult;

    // Gérer les erreurs de Supabase
    if (error) {
      console.error("Erreur Supabase:", error);

      if (error.message.includes("already registered")) {
        return NextResponse.json(
          { error: "Cette adresse email est déjà utilisée", emailTaken: true },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Erreur lors de la création du compte: " + error.message },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur a été créé
    if (!user) {
      console.log("Erreur: Utilisateur non créé dans Supabase");
      return NextResponse.json(
        { error: "Erreur lors de la création de l'utilisateur" },
        { status: 400 }
      );
    }

    console.log("Utilisateur créé dans Supabase avec succès:", user.id);

    // Créer l'utilisateur dans Prisma
    try {
      console.log("Tentative de création de l'utilisateur dans Prisma...");
      await prisma.user.create({
        data: {
          id: user.id,
          email: email,
          name: name,
          role: "USER",
        },
      });
      console.log("Utilisateur créé dans Prisma avec succès");
    } catch (prismaError) {
      console.error("Erreur Prisma:", prismaError);
      // Si erreur avec Prisma, supprimer l'utilisateur de Supabase
      try {
        console.log(
          "Tentative de suppression de l'utilisateur Supabase suite à l'erreur Prisma..."
        );
        await supabase.auth.admin.deleteUser(user.id);
        console.log("Utilisateur Supabase supprimé avec succès");
      } catch (deleteError) {
        console.error(
          "Erreur lors de la suppression de l'utilisateur Supabase:",
          deleteError
        );
      }

      return NextResponse.json(
        {
          error:
            "Erreur lors de la création du compte dans la base de données: " +
            prismaError.message,
        },
        { status: 500 }
      );
    }

    // Succès
    console.log("Inscription réussie pour l'utilisateur:", email);
    return NextResponse.json({
      message: "Compte créé avec succès",
      user,
    });
  } catch (error) {
    console.error("Exception non gérée lors de la création du compte:", error);
    return NextResponse.json(
      {
        error:
          "Erreur serveur interne: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}
