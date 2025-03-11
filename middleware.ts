import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

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
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si le chemin est public
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Vérifier si l'utilisateur est authentifié
  const token = await getToken({ req: request });
  if (!token) {
    const callbackUrl = request.url;
    return NextResponse.redirect(
      new URL(
        `/(auth)/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`,
        request.url
      )
    );
  }

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  try {
    // Vérifier la session Supabase
    if (token.email) {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Si pas de session Supabase, continuer quand même
      // La synchronisation se fera via le composant client
      if (!session) {
        console.log("Pas de session Supabase, mais NextAuth authentifié");
      }
    }

    return res;
  } catch (error) {
    console.error("Erreur dans le middleware:", error);
    return res;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api|images|\\(auth\\)).*)",
  ],
};
