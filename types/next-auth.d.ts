import { DefaultSession, DefaultUser } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      provider: string;
      department?: string | null;
      age?: number | null;
      camperModel?: string | null;
      usageFrequency?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: Role;
    provider: string;
    department?: string | null;
    age?: number | null;
    camperModel?: string | null;
    usageFrequency?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    provider: string;
    department?: string | null;
    age?: number | null;
    camperModel?: string | null;
    usageFrequency?: string | null;
  }
}
