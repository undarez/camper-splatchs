"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = () => {
    switch (error) {
      case "missing_token":
        return "Le lien de vérification est invalide ou a expiré.";
      case "search_failed":
        return "Une erreur est survenue lors de la vérification de votre compte.";
      case "invalid_token":
        return "Le lien de vérification est invalide ou a déjà été utilisé.";
      case "update_failed":
        return "Une erreur est survenue lors de l'activation de votre compte.";
      default:
        return "Une erreur inattendue s'est produite.";
    }
  };

  return (
    <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8 text-center">
      <h1 className="text-2xl font-bold text-white mb-4">Erreur</h1>
      <p className="text-gray-300 mb-6">{getErrorMessage()}</p>
      <div className="space-y-4">
        <Link href="/signin">
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Retour à la connexion
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="w-full">
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <h2 className="text-white mt-4">Chargement...</h2>
          </div>
        }
      >
        <ErrorContent />
      </Suspense>
    </div>
  );
}
