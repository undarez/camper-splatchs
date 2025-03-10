import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    console.log("API sync-cookies: Début de la synchronisation des cookies");

    // Récupérer le corps de la requête
    const body = await request.json().catch(() => ({}));
    console.log("API sync-cookies: Corps de la requête:", body);

    // Récupérer l'en-tête X-Prevent-Auto-Login
    const preventAutoLoginHeader = request.headers.get("X-Prevent-Auto-Login");
    const preventAutoLogin =
      preventAutoLoginHeader === "true" || body.preventAutoLogin === true;
    console.log("API sync-cookies: prevent-auto-login =", preventAutoLogin);

    // Définir le cookie prevent-auto-login si nécessaire
    if (preventAutoLogin) {
      console.log("API sync-cookies: Définition du cookie prevent-auto-login");
      cookies().set("prevent-auto-login", "true", {
        path: "/",
        maxAge: 60 * 60 * 24, // 1 jour
        sameSite: "lax",
      });
    }

    // Récupérer l'en-tête X-Guest-Mode
    const guestModeHeader = request.headers.get("X-Guest-Mode");
    const guestMode = guestModeHeader === "true" || body.guestMode === true;
    console.log("API sync-cookies: guest-mode =", guestMode);

    // Définir le cookie guest-mode si nécessaire
    if (guestMode) {
      console.log("API sync-cookies: Définition du cookie guest-mode");
      cookies().set("guest-mode", "true", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 jours
        sameSite: "lax",
      });
    }

    // Récupérer tous les cookies pour les afficher
    const allCookies = cookies().getAll();
    console.log("API sync-cookies: Tous les cookies:", allCookies);

    return NextResponse.json({
      success: true,
      cookies: {
        preventAutoLogin,
        guestMode,
        allCookies: allCookies.map((c) => ({ name: c.name, value: c.value })),
      },
    });
  } catch (error) {
    console.error(
      "API sync-cookies: Erreur lors de la synchronisation des cookies:",
      error
    );
    return NextResponse.json(
      { error: "Erreur lors de la synchronisation des cookies" },
      { status: 500 }
    );
  }
}
