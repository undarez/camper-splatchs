import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { Role } from "@prisma/client";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";

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
          // Rechercher l'utilisateur dans Prisma
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.hashedPassword) {
            throw new Error("Compte non trouvé");
          }

          // Vérifier le mot de passe
          const passwordMatch = await compare(
            credentials.password,
            user.hashedPassword
          );

          if (!passwordMatch) {
            throw new Error("Mot de passe incorrect");
          }

          // Retourner les informations de l'utilisateur
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
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
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
