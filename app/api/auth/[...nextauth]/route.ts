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

        try {
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
            console.error("Erreur Supabase:", error);
            throw new Error("Identifiants invalides");
          }

          return {
            id: prismaUser.id,
            email: prismaUser.email,
            name: prismaUser.name,
            role: prismaUser.role,
          };
        } catch (error) {
          console.error("Erreur d'authentification:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Vérifier/Créer l'utilisateur dans Prisma uniquement
          let prismaUser = await prisma.user.findUnique({
            where: { email: user.email || "" },
          });

          if (!prismaUser) {
            prismaUser = await prisma.user.create({
              data: {
                email: user.email || "",
                name: user.name || "",
                role: "USER",
              },
            });
          }

          return true;
        } catch (error) {
          console.error("Erreur authentification Google:", error);
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
    signIn: "/(auth)/signin",
    error: "/(auth)/error",
  },
});

export { handler as GET, handler as POST };
