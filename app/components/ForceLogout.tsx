"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ForceLogout() {
  const router = useRouter();

  useEffect(() => {
    // Fonction pour supprimer tous les cookies
    const deleteAllCookies = () => {
      document.cookie.split(";").forEach((cookie) => {
        const [name] = cookie.trim().split("=");
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        // Essayer également avec d'autres chemins courants
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      });
    };

    // Supprimer les données de session du localStorage
    const clearLocalStorage = () => {
      try {
        // Supprimer les éléments spécifiques à next-auth
        localStorage.removeItem("next-auth.session-token");
        localStorage.removeItem("next-auth.callback-url");
        localStorage.removeItem("next-auth.csrf-token");
        localStorage.removeItem("next-auth.state");

        // Supprimer les éléments spécifiques à Supabase
        localStorage.removeItem("supabase.auth.token");
        localStorage.removeItem("supabase.auth.refreshToken");

        // Marquer que l'utilisateur a choisi de ne pas être reconnecté automatiquement
        localStorage.setItem("prevent-auto-login", "true");
      } catch (error) {
        console.error(
          "Erreur lors de la suppression des données de session:",
          error
        );
      }
    };

    // Supprimer les données de session du sessionStorage
    const clearSessionStorage = () => {
      try {
        sessionStorage.clear();
      } catch (error) {
        console.error(
          "Erreur lors de la suppression des données de session:",
          error
        );
      }
    };

    // Exécuter toutes les fonctions de nettoyage
    deleteAllCookies();
    clearLocalStorage();
    clearSessionStorage();

    // Afficher un message et rediriger vers la page de connexion après un court délai
    const timeout = setTimeout(() => {
      router.push("/signin");
    }, 1000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-blue-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <h2 className="text-2xl font-bold text-white mb-2">
            Déconnexion en cours...
          </h2>
          <p className="text-gray-300 mb-4">
            Suppression de toutes les données de session...
          </p>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
              <div
                className="animate-pulse w-full h-full bg-blue-500 rounded"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            Vous allez être redirigé vers la page de connexion.
          </p>
        </div>
      </div>
    </div>
  );
}
