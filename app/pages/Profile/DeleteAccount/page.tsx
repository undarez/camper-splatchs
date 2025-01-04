"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function DeleteAccountPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDeleteAccount = async () => {
    if (!session?.user?.email) return;

    try {
      setIsDeleting(true);
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du compte");
      }

      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès",
      });

      router.push("/");
    } catch (error) {
      console.log(error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du compte",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Veuillez vous connecter pour accéder à cette page</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600">
            Supprimer mon compte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-800 font-medium">Attention !</p>
              <p className="text-red-600 mt-2">
                La suppression de votre compte est irréversible. Toutes vos
                données seront définitivement effacées.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting
                  ? "Suppression en cours..."
                  : "Confirmer la suppression"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.back()}
                disabled={isDeleting}
              >
                Annuler
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
