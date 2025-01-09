"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
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

                <div className="space-y-6">
                  {/* Google Sign In */}
                  <button
                    onClick={() => signIn("google")}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                    </svg>
                    Continuer avec Google
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-[#252B43] text-gray-400">
                        Ou continuez avec
                      </span>
                    </div>
                  </div>

                  {/* Email form */}
                  <form className="space-y-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Adresse e-mail
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="exemple@email.com"
                        className="w-full px-4 py-2 bg-[#1E2337] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
                        Mot de passe
                      </label>
                      <input
                        type="password"
                        id="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-2 bg-[#1E2337] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Se connecter
                    </button>
                  </form>

                  <div className="text-center">
                    <p className="text-gray-400">
                      Vous n'avez pas de compte ?{" "}
                      <Link
                        href="/signup"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Créer un compte
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthWrapper>
  );
}
