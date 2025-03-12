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
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email et mot de passe requis");
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user || !user.hashedPassword) {
            console.log(
              `Aucun utilisateur trouvé avec l'email: ${credentials.email}`
            );
            throw new Error("Aucun utilisateur trouvé avec cet email");
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.hashedPassword
          );

          if (!isPasswordValid) {
            console.log(
              `Mot de passe incorrect pour l'utilisateur: ${credentials.email}`
            );
            throw new Error("Mot de passe incorrect");
          }

          console.log(
            `Connexion réussie pour l'utilisateur: ${credentials.email}`
          );
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            provider: "credentials",
          };
        } catch (error) {
          console.error("Erreur dans authorize:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      try {
        console.log(
          `Tentative de connexion avec le provider: ${
            account?.provider
          }, utilisateur: ${user?.email || "inconnu"}`
        );

        if (account?.provider === "credentials") {
          return true;
        }

        if (account?.provider === "instagram" && !account?.access_token) {
          return false;
        }

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
        } else if (profile.email && account) {
          // Créer un nouvel utilisateur si aucun n'existe avec cet email
          const newUser = await prisma.user.create({
            data: {
              email: profile.email,
              name: profile.name || "",
              role: "USER",
              accounts: {
                create: {
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
              },
            },
          });
          console.log(`Nouvel utilisateur créé: ${newUser.id}`);
          return true;
        }
      } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        return false;
      }

      return true;
    },

    async session({ session, token }) {
      try {
        if (!session.user) {
          return session;
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
      } catch (error) {
        console.error("Erreur dans la callback session:", error);
        return session;
      }
    },

    async jwt({ token, user, trigger, session, account }) {
      try {
        if (trigger === "update" && session) {
          return { ...token, ...session.user };
        }

        if (user) {
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
        return token;
      } catch (error) {
        console.error("Erreur dans la callback jwt:", error);
        return token;
      }
    },
  },
  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  secret: process.env.NEXTAUTH_SECRET,
};
