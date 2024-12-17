"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "AccessDenied":
        return "Accès refusé. Veuillez vérifier vos autorisations.";
      case "Configuration":
        return "Erreur de configuration. Veuillez réessayer plus tard.";
      case "OAuthSignin":
        return "Erreur lors de la connexion. Veuillez réessayer.";
      default:
        return "Une erreur s'est produite lors de la connexion.";
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 flex flex-col items-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-red-600">
          Erreur d'authentification
        </h1>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-muted-foreground">
          {getErrorMessage(error || "")}
        </p>
        <div className="flex justify-center">
          <Link href="/pages/auth/connect-you">
            <Button variant="default">Retourner à la page de connexion</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AuthError() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Suspense
        fallback={
          <Card className="w-full max-w-md p-6">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </Card>
        }
      >
        <ErrorContent />
      </Suspense>
    </div>
  );
}
