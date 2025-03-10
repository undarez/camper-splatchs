import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Chemins publics accessibles sans authentification
const publicPaths = [
  "/_next/",
  "/images/",
  "/favicon.ico",
  "/manifest.json",
  "/robots.txt",
  "/sitemap.xml",
  "/(auth)/signin",
  "/(auth)/signup",
  "/",
  "/api/",
];

// Chemins qui nécessitent une authentification
const protectedPaths = ["/pages/AdminUsers", "/api/admin/"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("Middleware: Traitement de la requête pour", pathname);

  // Vérifier si la requête est pour /api/auth/session
  if (pathname === "/api/auth/session") {
    // Vérifier si l'utilisateur est en mode invité via le cookie
    const guestModeCookie = request.cookies.get("guest-mode");
    const guestMode = guestModeCookie?.value === "true";

    // Vérifier également le localStorage via le cookie spécial
    const preventAutoLoginCookie = request.cookies.get("prevent-auto-login");
    const preventAutoLogin = preventAutoLoginCookie?.value === "true";

    console.log("Middleware: Requête pour /api/auth/session");
    console.log("Middleware: Cookie guest-mode =", guestModeCookie?.value);
    console.log(
      "Middleware: Cookie prevent-auto-login =",
      preventAutoLoginCookie?.value
    );
    console.log(
      "Middleware: Mode invité =",
      guestMode,
      "prevent-auto-login =",
      preventAutoLogin
    );

    // Si l'utilisateur est en mode invité ou a choisi de ne pas être reconnecté automatiquement,
    // renvoyer une réponse vide pour empêcher la reconnexion automatique
    if (guestMode || preventAutoLogin) {
      console.log("Middleware: Blocage de la reconnexion automatique");
      // Utiliser une réponse JSON vide pour simuler une session non authentifiée
      return NextResponse.json(
        { user: null },
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, max-age=0",
          },
        }
      );
    }
  }

  // Vérifier si le chemin est public
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Vérifier si le chemin est protégé et nécessite une authentification
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  console.log("Middleware: Chemin protégé =", isProtected);

  // Vérifier si l'utilisateur est authentifié
  const token = await getToken({ req: request });
  console.log("Middleware: Token présent =", !!token);

  // Si l'utilisateur n'est pas authentifié et que le chemin est protégé
  if (!token && isProtected) {
    console.log("Middleware: Redirection vers la page de connexion");
    // Rediriger vers la page de connexion
    const callbackUrl = request.url;
    return NextResponse.redirect(
      new URL(
        `/(auth)/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`,
        request.url
      )
    );
  }

  // Pour tous les autres cas, laisser passer la requête
  const res = NextResponse.next();

  // Si l'utilisateur n'est pas authentifié, définir un cookie pour le mode invité
  if (!token) {
    console.log("Middleware: Activation du mode invité via cookie");
    res.cookies.set("guest-mode", "true", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      sameSite: "lax",
    });
  } else {
    // Si l'utilisateur est authentifié, supprimer le cookie de mode invité
    console.log("Middleware: Suppression du cookie de mode invité");
    res.cookies.delete("guest-mode");
  }

  // Synchroniser le localStorage avec les cookies
  // Si prevent-auto-login est défini dans le localStorage, le définir également dans les cookies
  const preventAutoLoginHeader = request.headers.get("X-Prevent-Auto-Login");
  if (preventAutoLoginHeader === "true") {
    console.log("Middleware: Définition du cookie prevent-auto-login");
    res.cookies.set("prevent-auto-login", "true", {
      path: "/",
      maxAge: 60 * 60 * 24, // 1 jour
      sameSite: "lax",
    });
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|images|\\(auth\\)).*)",
    "/api/auth/session",
  ],
};
