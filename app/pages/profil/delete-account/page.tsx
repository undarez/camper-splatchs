"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function DeleteAccountPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
      )
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Erreur lors de la suppression du compte"
        );
      }

      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès.",
      });

      // Déconnexion et redirection
      await signOut({ redirect: false });
      router.push("/signin");
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description:
          error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Supprimer votre compte
        </h1>
        <div className="bg-destructive/10 p-4 rounded-lg">
          <p className="text-sm text-destructive mb-4">
            Attention : La suppression de votre compte est irréversible. Toutes
            vos données seront définitivement effacées.
          </p>
        </div>
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleDeleteAccount}
          disabled={isLoading}
        >
          {isLoading ? "Suppression en cours..." : "Supprimer mon compte"}
        </Button>
      </div>
    </div>
  );
}
