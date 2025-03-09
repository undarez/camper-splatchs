import { signOut } from "next-auth/react";

/**
 * Hook personnalisé pour gérer la déconnexion
 */
export function useLogout() {
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
      // Supprimer les données de session du localStorage
      try {
        localStorage.removeItem("next-auth.session-token");
        localStorage.removeItem("next-auth.callback-url");
        localStorage.removeItem("next-auth.csrf-token");
        localStorage.removeItem("next-auth.state");

        // Marquer que l'utilisateur a choisi de ne pas être reconnecté automatiquement
        localStorage.setItem("prevent-auto-login", "true");

        // Supprimer les cookies liés à l'authentification
        document.cookie.split(";").forEach((cookie) => {
          const [name] = cookie.trim().split("=");
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });
      } catch (error) {
        console.error(
          "Erreur lors de la suppression des données de session:",
          error
        );
      }
    }

    // Déconnexion via NextAuth
    return signOut({ callbackUrl, redirect: true });
  };

  return { logout };
}
