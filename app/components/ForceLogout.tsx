"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ForceLogout() {
  const router = useRouter();
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    console.log("ForceLogout: Début de la déconnexion forcée");

    // Marquer que l'utilisateur vient de se déconnecter
    sessionStorage.setItem("just-logged-out", "true");

    // Synchroniser les cookies avec le localStorage
    const preventAutoLogin =
      localStorage.getItem("prevent-auto-login") === "true";
    const guestMode = localStorage.getItem("guest-mode") === "true";

    // Faire une requête pour synchroniser le localStorage avec les cookies
    fetch("/api/auth/sync-cookies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        preventAutoLogin: preventAutoLogin,
        guestMode: true, // Toujours activer le mode invité lors de la déconnexion forcée
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("ForceLogout: Réponse de sync-cookies:", data);

        // Continuer avec la déconnexion
        deleteAllCookies();
        clearLocalStorage();
        clearSessionStorage();

        // Indiquer que la déconnexion est terminée
        setIsLoggedOut(true);
      })
      .catch((error) => {
        console.error(
          "ForceLogout: Erreur lors de la synchronisation des cookies:",
          error
        );

        // Continuer avec la déconnexion même en cas d'erreur
        deleteAllCookies();
        clearLocalStorage();
        clearSessionStorage();

        // Indiquer que la déconnexion est terminée
        setIsLoggedOut(true);
      });

    // Fonction pour supprimer tous les cookies
    const deleteAllCookies = () => {
      console.log("ForceLogout: Suppression de tous les cookies");
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
        console.log("ForceLogout: Suppression des données du localStorage");

        // Vérifier si l'utilisateur a choisi de ne pas être reconnecté automatiquement
        const privacyAccepted = localStorage.getItem("privacyAccepted");
        const termsAccepted = localStorage.getItem("termsAccepted");

        localStorage.clear();

        // Restaurer les préférences utilisateur
        if (privacyAccepted)
          localStorage.setItem("privacyAccepted", privacyAccepted);
        if (termsAccepted) localStorage.setItem("termsAccepted", termsAccepted);

        // Supprimer spécifiquement les éléments liés à l'authentification
        localStorage.removeItem("next-auth.session-token");
        localStorage.removeItem("next-auth.callback-url");
        localStorage.removeItem("next-auth.csrf-token");
        localStorage.removeItem("next-auth.state");
        localStorage.removeItem("supabase.auth.token");
        localStorage.removeItem("supabase.auth.refreshToken");
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
        console.log("ForceLogout: Suppression des données du sessionStorage");
        // Sauvegarder le marqueur just-logged-out
        const justLoggedOut = sessionStorage.getItem("just-logged-out");
        sessionStorage.clear();
        // Restaurer le marqueur
        if (justLoggedOut) {
          sessionStorage.setItem("just-logged-out", justLoggedOut);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la suppression des données de session:",
          error
        );
      }
    };
  }, []);

  const handleGoHome = () => {
    router.push("/");
  };

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
            {isLoggedOut ? "Déconnexion réussie" : "Déconnexion en cours..."}
          </h2>
          <p className="text-gray-300 mb-4">
            {isLoggedOut
              ? "Vous avez été déconnecté avec succès."
              : "Suppression de toutes les données de session..."}
          </p>
          {!isLoggedOut && (
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                <div
                  className="animate-pulse w-full h-full bg-blue-500 rounded"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
          )}
          {isLoggedOut && (
            <button
              onClick={handleGoHome}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Retourner à l'accueil
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
