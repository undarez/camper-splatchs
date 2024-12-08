import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";

export const useAuth = () => {
  const { data: session, status } = useSession();

  return {
    session,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    isAdmin: session?.user?.role === "ADMIN",
    role: session?.user?.role as Role | undefined,
    userId: session?.user?.id,
  };
};
