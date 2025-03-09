"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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

  useEffect(() => {
    // Vérifier si l'utilisateur vient de se déconnecter avec l'option "prevent-auto-login"
    const preventAutoLogin = localStorage.getItem("prevent-auto-login");

    // Afficher le modal de bienvenue uniquement si :
    // - l'utilisateur est authentifié
    // - le modal n'est pas déjà affiché
    // - l'utilisateur ne vient pas de se déconnecter avec l'option "prevent-auto-login"
    // - l'utilisateur n'a pas déjà fermé le modal avec "Rester ici"
    if (
      status === "authenticated" &&
      !showLoginAd &&
      preventAutoLogin !== "true" &&
      !hasSeenLoginAd
    ) {
      setShowLoginAd(true);
    }

    // Si l'utilisateur vient de se déconnecter avec l'option "prevent-auto-login",
    // supprimer le marqueur pour les futures connexions
    if (preventAutoLogin === "true") {
      localStorage.removeItem("prevent-auto-login");
    }
  }, [status, showLoginAd, hasSeenLoginAd]);

  const handleContinue = () => {
    setShowLoginAd(false);
    setHasSeenLoginAd(true);
    router.push("/");
  };

  const handleStayHere = () => {
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
