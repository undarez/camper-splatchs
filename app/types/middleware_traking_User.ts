import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function middleware(request: NextRequest) {
  // Ne pas tracker les appels API et les ressources statiques
  if (!request.url.includes("/api/") && !request.url.includes("/_next/")) {
    try {
      await prisma.analytics.create({
        data: {
          type: "PAGE_VIEW",
          path: request.nextUrl.pathname,
          ip: request.ip || request.headers.get("x-forwarded-for") || "",
        },
      });
    } catch (error) {
      console.error("Erreur lors du tracking:", error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
