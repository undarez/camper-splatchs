"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ConnectYou from "@/app/pages/auth/connect-you/page";

const DeleteAccount = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);

  if (status === "loading") {
    return <div>Chargement...</div>;
  }

  if (!session) {
    return <ConnectYou />;
  }

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible."
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du compte");
      }

      toast.success("Votre compte a été supprimé avec succès");
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de la suppression du compte:", error);
      toast.error("Erreur lors de la suppression du compte");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-lg mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="text-red-600">Supprimer mon compte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-gray-700">
              <h2 className="font-semibold mb-2">
                Avant de supprimer votre compte :
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cette action est irréversible</li>
                <li>Toutes vos données personnelles seront supprimées</li>
                <li>Vous perdrez l'accès à tous vos contenus et préférences</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1"
              >
                {isDeleting ? "Suppression..." : "Supprimer mon compte"}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.back()}
                disabled={isDeleting}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteAccount;
