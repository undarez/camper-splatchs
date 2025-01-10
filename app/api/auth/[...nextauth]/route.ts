import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { Role } from "@prisma/client";

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

        if (!user.user_metadata.isActive) {
          throw new Error("Compte non activé. Veuillez vérifier votre email.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.user_metadata.name,
          role: user.user_metadata.role as Role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const supabase = createRouteHandlerClient({ cookies });

        try {
          // Vérifier si l'utilisateur existe déjà dans Supabase
          const {
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession();

          if (sessionError) {
            console.error(
              "Erreur lors de la vérification de la session:",
              sessionError
            );
            return false;
          }

          if (!session) {
            // L'utilisateur n'existe pas, on le crée
            const { error: createError } = await supabase.auth.signUp({
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

            if (createError) {
              console.error("Erreur lors de la création:", createError);
              return false;
            }
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
