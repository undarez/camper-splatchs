"use client";

import Image from "next/image";
import Link from "next/link";
import AuthWrapper from "@/app/components/AuthWrapper";
import { AuthForm } from "@/app/components/AuthForm";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
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

      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-primary" />
          <Image
            src="/images/A_realistic_camping_cars_station.png"
            alt="Station de lavage camping-car"
            layout="fill"
            objectFit="cover"
            className="opacity-40"
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Logo"
                className="h-8 w-8 mr-2"
                width={500}
                height={500}
                priority
              />
            </Link>
            CampingCar Wash
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                Rejoignez notre communauté de camping-caristes
              </p>
              <p className="text-base">
                Créez votre compte pour accéder à toutes nos fonctionnalités et
                partager vos découvertes.
              </p>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Créer un compte
              </h1>
              <p className="text-sm text-muted-foreground">
                Inscrivez-vous avec Google, Facebook ou Instagram
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                En créant un compte, vous acceptez notre{" "}
                <Link
                  href="/pages/Juridique/regles-de-confidentialite"
                  className="underline hover:text-primary"
                >
                  politique de confidentialité
                </Link>
              </p>
            </div>
            <AuthForm />
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
