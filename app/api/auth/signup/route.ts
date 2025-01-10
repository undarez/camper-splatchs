import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    const supabase = createRouteHandlerClient({ cookies });

    // Créer l'utilisateur dans Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
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

    if (error) {
      if (error.message.includes("already registered")) {
        return NextResponse.json(
          { error: "Cette adresse email est déjà utilisée", emailTaken: true },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Erreur lors de la création du compte" },
        { status: 400 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "Erreur lors de la création de l'utilisateur" },
        { status: 400 }
      );
    }

    // Créer l'utilisateur dans Prisma
    try {
      await prisma.user.create({
        data: {
          id: user.id,
          email: email,
          name: name,
          role: "USER",
        },
      });
    } catch (prismaError) {
      console.error("Erreur Prisma:", prismaError);
      // Si erreur avec Prisma, supprimer l'utilisateur de Supabase
      await supabase.auth.admin.deleteUser(user.id);
      return NextResponse.json(
        {
          error: "Erreur lors de la création du compte dans la base de données",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Compte créé avec succès",
      user,
    });
  } catch (error) {
    console.error("Erreur lors de la création du compte", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
