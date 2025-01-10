import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { Role } from "@prisma/client";
import prisma from "@/lib/prisma";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Identifiants requis");
        }

        const supabase = createRouteHandlerClient({ cookies });

        // Vérifier d'abord si l'utilisateur existe dans Prisma
        const prismaUser = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!prismaUser) {
          throw new Error("Compte non trouvé");
        }

        // Ensuite vérifier les credentials avec Supabase
        const {
          data: { user },
          error,
        } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !user) {
          throw new Error("Identifiants invalides");
        }

        return {
          id: prismaUser.id,
          email: prismaUser.email,
          name: prismaUser.name,
          role: prismaUser.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const supabase = createRouteHandlerClient({ cookies });

        try {
          // Vérifier si l'utilisateur existe déjà dans Prisma
          let prismaUser = await prisma.user.findUnique({
            where: { email: user.email || "" },
          });

          if (!prismaUser) {
            // Créer l'utilisateur dans Supabase
            const { data: supabaseUser, error: createError } =
              await supabase.auth.signUp({
                email: user.email || "",
                password: Math.random().toString(36).slice(-8),
                options: {
                  data: {
                    name: user.name,
                    role: "USER",
                    isActive: true,
                  },
                },
              });

            if (createError || !supabaseUser.user) {
              console.error(
                "Erreur lors de la création Supabase:",
                createError
              );
              return false;
            }

            // Créer l'utilisateur dans Prisma
            prismaUser = await prisma.user.create({
              data: {
                id: supabaseUser.user.id,
                email: user.email || "",
                name: user.name || "",
                role: "USER",
              },
            });
          }

          return true;
        } catch (error) {
          console.error("Erreur lors de l'authentification Google:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as Role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});

export { handler as GET, handler as POST };
