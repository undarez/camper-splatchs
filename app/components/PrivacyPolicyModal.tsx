import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";

export default function PrivacyPolicyModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasAcceptedPolicy = localStorage.getItem("privacyPolicyAccepted");
    if (!hasAcceptedPolicy) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("privacyPolicyAccepted", "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-[#1E2337] text-white">
        <DialogHeader>
          <DialogTitle>Règles de Confidentialité</DialogTitle>
          <DialogDescription className="text-gray-400">
            En utilisant notre service, vous acceptez notre politique de
            confidentialité et nos conditions d'utilisation.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4 text-sm text-gray-300">
          <p>
            Nous collectons et utilisons vos données personnelles pour améliorer
            votre expérience utilisateur et nos services.
          </p>
          <p>
            Vos données sont stockées de manière sécurisée et ne sont jamais
            partagées avec des tiers sans votre consentement.
          </p>
        </div>
        <DialogFooter className="mt-6">
          <Button
            onClick={handleAccept}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            J'accepte
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
