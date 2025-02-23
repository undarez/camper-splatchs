import { Role } from "@prisma/client";

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
  provider: string;
  department?: string | null;
  age?: number | null;
  camperModel?: string | null;
  usageFrequency?: string | null;
  ecoPoints: number;
}

export interface Session {
  user: User;
  expires: string;
}
