import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get("error");

  console.error("Erreur d'authentification:", error);

  return NextResponse.redirect(new URL("/(auth)/error", request.url));
}
