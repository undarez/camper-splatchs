"use client";

import Image from "next/image";
import Link from "next/link";
import AuthWrapper from "@/app/components/AuthWrapper";
import { SignUpForm } from "@/app/components/SignUpForm";

export default function SignUpPage() {
  return (
    <AuthWrapper>
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
                Créez votre compte pour accéder à toutes nos fonctionnalités
              </p>
              <p className="text-base">
                Rejoignez notre communauté et partagez vos découvertes de
                stations de lavage
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
                Entrez vos informations pour créer votre compte
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
            <SignUpForm />
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
