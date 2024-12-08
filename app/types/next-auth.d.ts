import { DefaultUser, DefaultSession } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      department?: string | null;
      age?: number | null;
      camperModel?: string | null;
      usageFrequency?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: Role;
    department?: string | null;
    age?: number | null;
    camperModel?: string | null;
    usageFrequency?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    id: string;
    department?: string | null;
    age?: number | null;
    camperModel?: string | null;
    usageFrequency?: string | null;
  }
}
