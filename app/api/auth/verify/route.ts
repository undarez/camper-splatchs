import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const token = requestUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token manquant" }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });

    const { data: userData, error } = await supabase.rpc("confirm_user_email", {
      user_token: token,
    });

    if (error) {
      console.error("Erreur lors de la confirmation:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'activation du compte" },
        { status: 500 }
      );
    }

    if (!userData) {
      return NextResponse.json(
        { error: "Token invalide ou expiré" },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: { email_verified: true },
    });

    if (updateError) {
      console.error("Erreur lors de la mise à jour:", updateError);
    }

    return NextResponse.json({
      message: "Compte activé avec succès",
      debug: userData,
    });
  } catch (error) {
    console.error("Erreur lors de la vérification:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
