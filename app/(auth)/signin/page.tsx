"use client";

import Image from "next/image";
import AuthWrapper from "@/app/components/AuthWrapper";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/app/components/AuthForm";
import { useSession, signOut } from "next-auth/react";

export default function SignIn() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  // Log à chaque rendu du composant
  console.log("SignIn: Rendu avec status =", status);

  useEffect(() => {
    console.log("SignIn: useEffect déclenché, status =", status);

    // Si l'utilisateur est déjà connecté, vérifier s'il doit être déconnecté
    if (status === "authenticated") {
      console.log("SignIn: Utilisateur déjà authentifié");

      const preventAutoLogin =
        localStorage.getItem("prevent-auto-login") === "true";
      const guestMode = localStorage.getItem("guest-mode") === "true";

      console.log("SignIn: État des flags:", { preventAutoLogin, guestMode });

      // Si l'utilisateur a choisi de ne pas être reconnecté automatiquement
      // ou s'il est en mode invité, le déconnecter
      if (preventAutoLogin || guestMode) {
        console.log("SignIn: Déconnexion forcée depuis la page de connexion");
        signOut({ redirect: false });
      } else {
        // Sinon, rediriger vers la page d'accueil
        console.log("SignIn: Redirection vers la page d'accueil");
        router.push("/");
      }
    }

    // Vérifier si l'utilisateur a accepté les règles de confidentialité
    const privacyAccepted = localStorage.getItem("privacyAccepted") === "true";
    console.log(
      "SignIn: Règles de confidentialité acceptées =",
      privacyAccepted
    );

    if (!privacyAccepted) {
      console.log("SignIn: Affichage du modal de confidentialité");
      setShowModal(true);
    }
  }, [status, router]);

  const handleAccept = () => {
    console.log("SignIn: Acceptation des règles de confidentialité");
    localStorage.setItem("privacyAccepted", "true");
    setShowModal(false);
  };

  const handleViewPrivacy = () => {
    console.log("SignIn: Redirection vers les règles de confidentialité");
    router.push("/pages/Juridique/regles-de-confidentialite");
  };

  const handleGuestMode = () => {
    console.log("SignIn: Activation du mode invité");
    // Activer le mode invité
    localStorage.setItem("guest-mode", "true");

    // Si l'utilisateur est connecté, le déconnecter
    if (status === "authenticated") {
      console.log("SignIn: Déconnexion avant activation du mode invité");
      signOut({ redirect: false }).then(() => {
        console.log(
          "SignIn: Redirection vers la page d'accueil après déconnexion"
        );
        router.push("/");
      });
    } else {
      console.log("SignIn: Redirection vers la page d'accueil en mode invité");
      router.push("/");
    }
  };

  return (
    <AuthWrapper>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Règles de Confidentialité</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Avant de continuer, veuillez prendre connaissance de nos règles de
              confidentialité. Ces règles expliquent comment nous utilisons et
              protégeons vos données personnelles.
            </p>
            <p>
              En acceptant, vous confirmez avoir lu et compris nos règles de
              confidentialité.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleViewPrivacy}>
              Lire les règles de confidentialité
            </Button>
            <Button onClick={handleAccept}>Accepter et continuer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen bg-[#1E2337] flex">
        <main className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-screen-xl mx-auto flex flex-col lg:flex-row items-stretch">
            {/* Left side - Image (hidden on small screens) */}
            <div className="relative hidden lg:flex lg:w-1/2">
              <div className="absolute inset-0 bg-blue-600" />
              <Image
                src="/images/A_realistic_camping_cars_station.png"
                alt="Station de lavage camping-car"
                fill
                style={{ objectFit: "cover" }}
                className="opacity-40"
                priority
              />
              <div className="relative z-20 p-10 mt-auto">
                <blockquote className="space-y-2">
                  <p className="text-lg text-white">
                    Trouvez facilement les stations de lavage pour votre
                    camping-car
                  </p>
                  <p className="text-base text-white">
                    Pour découvrir nos services et localiser les stations près
                    de chez vous, connectez-vous à votre espace personnel.
                  </p>
                </blockquote>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 bg-[#252B43] p-8 sm:p-12">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Connexion à votre compte
                  </h1>
                  <p className="text-gray-400">
                    Connectez-vous avec Google ou créez un compte avec votre
                    email
                  </p>
                </div>

                <AuthForm />

                <div className="mt-6 text-center">
                  <p className="text-gray-400 mb-4">Ou continuez sans compte</p>
                  <Button
                    onClick={handleGuestMode}
                    variant="outline"
                    className="w-full border-gray-600 text-white hover:bg-gray-700"
                  >
                    Mode invité
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthWrapper>
  );
}
