"use client";
import React from "react";
import Image from "next/image";
import AuthWrapper from "../../components/AuthWrapper";
import { SignUpForm } from "../../components/SignUpForm";

export default function SignUp() {
  return (
    <AuthWrapper>
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
                    Rejoignez notre communauté de camping-caristes
                  </p>
                  <p className="text-base text-white">
                    Créez votre compte pour accéder à toutes nos fonctionnalités
                    et contribuer à enrichir notre base de données.
                  </p>
                </blockquote>
              </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 bg-[#252B43] p-8 sm:p-12">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Créer un compte
                  </h1>
                  <p className="text-gray-400">
                    Inscrivez-vous avec Google ou créez un compte avec votre
                    email
                  </p>
                </div>

                <SignUpForm />
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthWrapper>
  );
}
