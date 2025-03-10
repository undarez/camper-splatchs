"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginAd from "./LoginAd";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const [showLoginAd, setShowLoginAd] = useState(false);
  const [hasSeenLoginAd, setHasSeenLoginAd] = useState(false);
  const router = useRouter();

  // Log à chaque rendu du composant
  console.log("AuthWrapper: Rendu avec status =", status);

  // Vérifier si l'utilisateur vient de se déconnecter
  useEffect(() => {
    // Si l'utilisateur vient de se déconnecter, ne pas afficher le modal de bienvenue
    const justLoggedOut = sessionStorage.getItem("just-logged-out") === "true";

    if (justLoggedOut) {
      console.log(
        "AuthWrapper: L'utilisateur vient de se déconnecter, suppression du marqueur"
      );
      sessionStorage.removeItem("just-logged-out");
      setHasSeenLoginAd(true); // Empêcher l'affichage du modal
    }
  }, []);

  useEffect(() => {
    console.log("AuthWrapper: useEffect déclenché, status =", status);

    // Vérifier si l'utilisateur est en mode invité
    const guestMode = localStorage.getItem("guest-mode") === "true";
    console.log("AuthWrapper: Mode invité =", guestMode);

    // Si l'utilisateur est en mode invité mais qu'il est authentifié,
    // le déconnecter pour respecter son choix
    if (guestMode && status === "authenticated") {
      console.log(
        "AuthWrapper: Mode invité activé et utilisateur authentifié, déconnexion"
      );
      signOut({ redirect: false });
      return;
    }

    // Vérifier si l'utilisateur vient de se déconnecter avec l'option "prevent-auto-login"
    const preventAutoLogin =
      localStorage.getItem("prevent-auto-login") === "true";
    console.log("AuthWrapper: prevent-auto-login =", preventAutoLogin);

    // Si l'utilisateur a choisi de ne pas être reconnecté automatiquement,
    // le déconnecter
    if (preventAutoLogin && status === "authenticated") {
      console.log("AuthWrapper: Déconnexion forcée (prevent-auto-login)");
      signOut({ redirect: false });
      return;
    }

    // Afficher le modal de bienvenue uniquement si :
    // - l'utilisateur est authentifié
    // - le modal n'est pas déjà affiché
    // - l'utilisateur ne vient pas de se déconnecter avec l'option "prevent-auto-login"
    // - l'utilisateur n'a pas déjà fermé le modal avec "Rester ici"
    // - l'utilisateur n'est pas en mode invité
    const shouldShowLoginAd =
      status === "authenticated" &&
      !showLoginAd &&
      !preventAutoLogin &&
      !hasSeenLoginAd &&
      !guestMode;

    console.log("AuthWrapper: Conditions pour afficher le modal:", {
      authenticated: status === "authenticated",
      modalNotShown: !showLoginAd,
      notPreventAutoLogin: !preventAutoLogin,
      notSeenBefore: !hasSeenLoginAd,
      notGuestMode: !guestMode,
      shouldShow: shouldShowLoginAd,
    });

    if (shouldShowLoginAd) {
      console.log("AuthWrapper: Affichage du modal de bienvenue");
      setShowLoginAd(true);
    }

    // Si l'utilisateur vient de se déconnecter avec l'option "prevent-auto-login",
    // supprimer le marqueur pour les futures connexions
    if (preventAutoLogin) {
      console.log("AuthWrapper: Suppression du marqueur prevent-auto-login");
      localStorage.removeItem("prevent-auto-login");
    }
  }, [status, showLoginAd, hasSeenLoginAd]);

  const handleContinue = () => {
    console.log("AuthWrapper: Clic sur Continuer");
    setShowLoginAd(false);
    setHasSeenLoginAd(true);
    router.push("/");
  };

  const handleStayHere = () => {
    console.log("AuthWrapper: Clic sur Rester ici");
    // Fermer le modal et marquer comme vu pour éviter qu'il ne réapparaisse
    setShowLoginAd(false);
    setHasSeenLoginAd(true);
  };

  return (
    <>
      {children}
      {showLoginAd && (
        <LoginAd onContinue={handleContinue} onStayHere={handleStayHere} />
      )}
    </>
  );
}
