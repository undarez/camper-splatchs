"use client";

import { useEffect, useState } from "react";
import { CamperWashStation } from "@/app/types";
import { Button } from "@/app/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { Badge } from "@/app/components/ui/badge";
import { Loader2, MapPin, Check, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

type ServiceValue = boolean | string | string[] | number | null;

const formatKey = (key: string): string => {
  const keyMap: Record<string, string> = {
    highPressure: "Haute pression",
    tirePressure: "Gonflage pneus",
    vacuum: "Aspirateur",
    handicapAccess: "Accès handicapé",
    wasteWater: "Eaux usées",
    waterPoint: "Point d'eau",
    wasteWaterDisposal: "Évacuation eaux usées",
    blackWaterDisposal: "Évacuation eaux noires",
    electricity: "Électricité",
    maxVehicleLength: "Longueur max",
    paymentMethods: "Paiement",
  };
  return keyMap[key] || key;
};

const formatValue = (value: ServiceValue): string => {
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  if (Array.isArray(value)) return value.join(", ");
  if (value === null) return "Non spécifié";
  return value.toString();
};

const PendingStations = () => {
  const [stations, setStations] = useState<CamperWashStation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingStations();
  }, []);

  const fetchPendingStations = async () => {
    try {
      const response = await fetch("/api/AdminStation");
      const data = await response.json();
      // Filtrer pour n'avoir que les stations en attente
      setStations(
        data.filter((s: CamperWashStation) => s.status === "en_attente")
      );
    } catch (error) {
      console.error("Erreur lors du chargement des stations", error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des stations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    stationId: string,
    newStatus: "active" | "inactive"
  ) => {
    try {
      const response = await fetch(`/api/AdminStation/${stationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          validatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error();

      await fetchPendingStations();
      toast({
        title: "Succès",
        description:
          newStatus === "active"
            ? "Station validée avec succès"
            : "Station marquée comme inactive",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (stationId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette station ?")) return;

    try {
      const response = await fetch(`/api/AdminStation/${stationId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      await fetchPendingStations();
      toast({
        title: "Succès",
        description: "Station supprimée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Aucune station en attente de validation
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {stations.map((station) => (
        <Card key={station.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{station.name}</span>
              <Badge variant="secondary">En attente</Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="relative h-48 rounded-md overflow-hidden">
              <Image
                src={station.images[0] || "/images/default-station.jpg"}
                alt={station.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">{station.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {station.services &&
                Object.entries(station.services)
                  .filter(([key]) => key !== "id")
                  .map(
                    ([key, value]) =>
                      typeof value !== "undefined" && (
                        <div
                          key={key}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <span className="font-medium">{formatKey(key)}:</span>
                          <span>{formatValue(value)}</span>
                        </div>
                      )
                  )}
            </div>

            <div className="text-sm text-muted-foreground">
              Ajoutée par: {station.author.name || station.author.email}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleStatusUpdate(station.id, "active")}
              >
                <Check className="h-4 w-4 mr-1" />
                Valider
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(station.id)}
              >
                <X className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PendingStations;
