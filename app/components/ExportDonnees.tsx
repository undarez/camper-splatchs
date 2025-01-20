import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function ExportDonnees() {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/data-export");

      if (!response.ok) {
        throw new Error("Erreur lors de l'export des données");
      }

      const data = await response.json();

      // Créer un fichier JSON pour le téléchargement
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mes-donnees-splashcamper-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Vos données ont été exportées avec succès");
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      toast.error("Une erreur est survenue lors de l'export de vos données");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg">
      <h3 className="text-lg font-medium text-white mb-4 flex items-center">
        <Download className="w-5 h-5 mr-2 text-teal-500" />
        Exporter mes données
      </h3>
      <p className="text-gray-300 text-sm mb-4">
        Téléchargez une copie de toutes vos données personnelles au format JSON.
        Cela inclut vos informations de profil, notes, avis et stations
        ajoutées.
      </p>
      <Button
        onClick={handleExport}
        disabled={isLoading}
        className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
      >
        {isLoading ? (
          <>
            <span className="animate-spin mr-2">⭮</span>
            Export en cours...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Télécharger mes données
          </>
        )}
      </Button>
    </div>
  );
}
