"use client";

import Image from "next/image";
import AuthWrapper from "../../components/AuthWrapper";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { useRouter } from "next/navigation";
import { AuthForm } from "../../components/AuthForm";

export default function SignIn() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const privacyAccepted = localStorage.getItem("privacyAccepted");
    if (!privacyAccepted) {
      setShowModal(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("privacyAccepted", "true");
    setShowModal(false);
  };

  const handleViewPrivacy = () => {
    router.push("/pages/Juridique/regles-de-confidentialite");
  };

  const handleGuestMode = () => {
    localStorage.setItem("guestSession", "true");
    router.push("/");
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
