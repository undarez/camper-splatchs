import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { Adapter } from "next-auth/adapters";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Aucun utilisateur trouvé avec cet email");
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordValid) {
          throw new Error("Mot de passe incorrect");
        }

        return {
          ...user,
          provider: "credentials",
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "instagram" && !account?.access_token) {
        return false;
      }

      try {
        if (!profile?.email) {
          return true;
        }

        const existingUser = await prisma.user.findUnique({
          where: {
            email: profile.email,
          },
          include: {
            accounts: true,
          },
        });

        if (existingUser) {
          const existingAccount = existingUser.accounts.find(
            (acc) => acc.provider === account?.provider
          );

          if (!existingAccount && account) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                token_type: account.token_type,
                scope: account.scope,
                expires_at: account.expires_at,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            });
          }
          return true;
        }
      } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        return false;
      }

      return true;
    },

    async session({ session, token }) {
      if (!session.user) {
        return session;
      }

      // Vérifier si l'utilisateur est l'administrateur et lui attribuer le rôle ADMIN
      const adminEmail =
        process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
      if (session.user.email === adminEmail) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id,
            provider: token.provider,
            role: "ADMIN", // Forcer le rôle ADMIN pour l'email administrateur
            department: token.department,
            age: token.age,
            camperModel: token.camperModel,
            usageFrequency: token.usageFrequency,
          },
        };
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          provider: token.provider,
          role: token.role || "USER",
          department: token.department,
          age: token.age,
          camperModel: token.camperModel,
          usageFrequency: token.usageFrequency,
        },
      };
    },

    async jwt({ token, user, trigger, session, account }) {
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }

      // Vérifier si l'utilisateur est l'administrateur et lui attribuer le rôle ADMIN
      const adminEmail =
        process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;

      if (user) {
        // Si l'email correspond à l'email administrateur, forcer le rôle ADMIN
        if (user.email === adminEmail) {
          return {
            ...token,
            id: user.id,
            provider: account?.provider || user.provider || "credentials",
            role: "ADMIN", // Forcer le rôle ADMIN pour l'email administrateur
            department: user.department,
            age: user.age,
            camperModel: user.camperModel,
            usageFrequency: user.usageFrequency,
          };
        }

        return {
          ...token,
          id: user.id,
          provider: account?.provider || user.provider || "credentials",
          role: user.role || "USER",
          department: user.department,
          age: user.age,
          camperModel: user.camperModel,
          usageFrequency: user.usageFrequency,
        };
      }

      // Vérifier également le token existant
      if (token.email === adminEmail) {
        return {
          ...token,
          role: "ADMIN", // Forcer le rôle ADMIN pour l'email administrateur
        };
      }

      return token;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
