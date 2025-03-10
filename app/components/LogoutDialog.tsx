import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import { useState } from "react";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutDialog({ isOpen, onClose }: LogoutDialogProps) {
  const [preventAutoLogin, setPreventAutoLogin] = useState(true);

  const handleLogout = () => {
    // Marquer que l'utilisateur vient de se déconnecter
    sessionStorage.setItem("just-logged-out", "true");

    // Activer le mode invité lors de la déconnexion
    localStorage.setItem("guest-mode", "true");

    // Si l'utilisateur a choisi de ne pas être reconnecté automatiquement
    if (preventAutoLogin) {
      localStorage.setItem("prevent-auto-login", "true");
    }

    // Faire une requête pour synchroniser le localStorage avec les cookies
    fetch("/api/auth/sync-cookies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        preventAutoLogin: preventAutoLogin,
        guestMode: true,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("LogoutDialog: Réponse de sync-cookies:", data);

        // Rediriger vers la page de déconnexion forcée
        window.location.href = "/logout";
      })
      .catch((error) => {
        console.error(
          "LogoutDialog: Erreur lors de la synchronisation des cookies:",
          error
        );

        // Rediriger vers la page de déconnexion forcée même en cas d'erreur
        window.location.href = "/logout";
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-sm">
        <div className="bg-[#252B43] rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden">
          {/* En-tête avec logo */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 relative">
            <div className="absolute inset-0 bg-[url('/images/logo.png')] opacity-5 bg-center bg-no-repeat bg-contain"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white text-center">
                Déconnexion
              </h2>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6">
            <p className="text-gray-300 text-center mb-6">
              Êtes-vous sûr de vouloir vous déconnecter ? Vous n'aurez plus
              accès aux fonctionnalités avancées.
            </p>

            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="preventAutoLogin"
                checked={preventAutoLogin}
                onCheckedChange={(checked) =>
                  setPreventAutoLogin(checked as boolean)
                }
                className="data-[state=checked]:bg-blue-600"
              />
              <Label
                htmlFor="preventAutoLogin"
                className="text-sm text-gray-300 cursor-pointer"
              >
                Empêcher la reconnexion automatique (recommandé)
              </Label>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Se déconnecter
              </button>
              <button
                onClick={onClose}
                className="w-full px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
