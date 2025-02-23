"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "";
  switch (error) {
    case "AccessDenied":
      errorMessage = "Accès refusé. Veuillez vérifier vos identifiants.";
      break;
    case "Verification":
      errorMessage = "Le lien de vérification a expiré ou est invalide.";
      break;
    default:
      errorMessage = "Une erreur s'est produite lors de l'authentification.";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E2337] px-4">
      <div className="max-w-md w-full space-y-8 bg-[#252b43] p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-500 mb-2">
            Erreur d'authentification
          </h2>
          <p className="text-gray-300 mb-6">{errorMessage}</p>
          <div className="space-y-4">
            <Link
              href="/(auth)/signin"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-300"
            >
              Retour à la connexion
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors duration-300"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
