import { NextResponse } from "next/server";
import { createUser, AuthError } from "@/lib/supabaseUtils";

// Fonction pour vérifier le captcha
async function verifyCaptcha(token: string): Promise<boolean> {
  try {
    // Vérifier si la clé secrète est définie
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.error("RECAPTCHA_SECRET_KEY n'est pas définie");
      return false;
    }

    // Construire la requête de vérification
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);

    // Envoyer la requête à Google
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      }
    );

    // Analyser la réponse
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("Erreur lors de la vérification du captcha:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // 1. Extraire les données de la requête
    const body = await request.json();
    const { name, email, password, captchaToken } = body;

    // 2. Valider les données requises
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nom, email et mot de passe sont requis" },
        { status: 400 }
      );
    }

    // 3. Vérifier le captcha
    if (!captchaToken) {
      return NextResponse.json(
        { error: "Validation du captcha requise" },
        { status: 400 }
      );
    }

    const isCaptchaValid = await verifyCaptcha(captchaToken);
    if (!isCaptchaValid) {
      return NextResponse.json(
        { error: "Validation du captcha échouée" },
        { status: 400 }
      );
    }

    // 4. Créer l'utilisateur avec notre fonction utilitaire
    try {
      const user = await createUser({ email, password, name });

      // 5. Retourner une réponse de succès
      return NextResponse.json({
        message: "Compte créé avec succès",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error) {
      // Gérer les erreurs spécifiques
      if (error instanceof AuthError) {
        if (error.message.includes("déjà utilisée")) {
          return NextResponse.json(
            { error: error.message, emailTaken: true },
            { status: 400 }
          );
        }

        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      // Erreur générique
      return NextResponse.json(
        { error: "Erreur lors de la création du compte" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Erreur non gérée:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}
