import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import prisma from "@/lib/prisma";
import { Adapter } from "next-auth/adapters";

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
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          auth_type: "rerequest",
          scope: "email,public_profile",
        },
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
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role || "USER",
          department: token.department,
          age: token.age,
          camperModel: token.camperModel,
          usageFrequency: token.usageFrequency,
        },
      };
    },

    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }

      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role || "USER",
          department: user.department,
          age: user.age,
          camperModel: user.camperModel,
          usageFrequency: user.usageFrequency,
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
