import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import { signIn } from "next-auth/react";

interface AuthDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AuthDialog({
  isOpen = true,
  onClose,
}: AuthDialogProps) {
  const handleGuestContinue = async () => {
    try {
      const response = await fetch("/api/guest-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAgent: navigator.userAgent,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la session invité");
      }

      const { sessionId } = await response.json();
      sessionStorage.setItem("guestSessionId", sessionId);
      if (onClose) onClose();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-sm">
        <div className="bg-[#252B43] rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden">
          {/* En-tête avec logo */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 relative">
            <div className="absolute inset-0 bg-[url('/logo.png')] opacity-5 bg-center bg-no-repeat bg-contain"></div>
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white text-center">
                Authentification requise
              </h2>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6">
            <p className="text-gray-300 text-center mb-6">
              Pour accéder à toutes les fonctionnalités, veuillez vous connecter
              ou continuer en tant qu'invité.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => signIn()}
                className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Se connecter
              </button>
              <button
                onClick={handleGuestContinue}
                className="w-full px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Continuer en tant qu'invité
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
