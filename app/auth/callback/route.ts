import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL("/auth/error?error=missing_token", request.url)
    );
  }

  const supabase = createRouteHandlerClient({ cookies });

  // Rechercher tous les utilisateurs et filtrer côté serveur
  const {
    data: { users },
    error: searchError,
  } = await supabase.auth.admin.listUsers();

  if (searchError || !users) {
    return NextResponse.redirect(
      new URL("/auth/error?error=search_failed", request.url)
    );
  }

  // Trouver l'utilisateur avec le bon token
  const targetUser = users.find(
    (user) => user.user_metadata?.verificationToken === token
  );

  if (!targetUser) {
    return NextResponse.redirect(
      new URL("/auth/error?error=invalid_token", request.url)
    );
  }

  // Mettre à jour isActive à true et supprimer le token
  const { error: updateError } = await supabase.auth.admin.updateUserById(
    targetUser.id,
    {
      user_metadata: {
        ...targetUser.user_metadata,
        isActive: true,
        verificationToken: null,
      },
    }
  );

  if (updateError) {
    return NextResponse.redirect(
      new URL("/auth/error?error=update_failed", request.url)
    );
  }

  // Rediriger vers la page de connexion avec un message de succès
  return NextResponse.redirect(
    new URL("/auth/signin?verified=true", request.url)
  );
}
