import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ValidateStationButtonProps {
  stationId: string;
  onValidationSuccess?: () => void;
}

export default function ValidateStationButton({
  stationId,
  onValidationSuccess,
}: ValidateStationButtonProps) {
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const handleValidation = async () => {
    try {
      setIsValidating(true);
      const response = await fetch("/api/stations/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stationId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la validation");
      }

      toast({
        title: "Succès",
        description: "La station a été validée et l'utilisateur a été notifié",
      });

      if (onValidationSuccess) {
        onValidationSuccess();
      }
    } catch (error) {
      console.error("Erreur lors de la validation:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la validation de la station",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Button
      onClick={handleValidation}
      disabled={isValidating}
      className="bg-amber-500 hover:bg-amber-600 text-white"
    >
      {isValidating ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Validation...
        </div>
      ) : (
        "Valider la station"
      )}
    </Button>
  );
}
