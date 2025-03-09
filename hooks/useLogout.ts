import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * Hook personnalisé pour gérer la déconnexion
 */
export function useLogout() {
  const router = useRouter();

  /**
   * Fonction pour se déconnecter
   * @param preventAutoLogin Si true, supprime également les cookies et les données de session
   * @param callbackUrl URL de redirection après la déconnexion
   */
  const logout = async (
    preventAutoLogin: boolean = false,
    callbackUrl: string = "/signin"
  ) => {
    if (preventAutoLogin) {
      // Rediriger vers la page de déconnexion forcée qui supprimera tous les cookies et tokens
      router.push("/logout");
      return;
    }

    // Déconnexion standard via NextAuth
    return signOut({ callbackUrl, redirect: true });
  };

  return { logout };
}
