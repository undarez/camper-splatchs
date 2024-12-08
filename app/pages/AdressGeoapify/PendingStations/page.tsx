"use client";

import { useEffect, useState } from "react";
import { CamperWashStation } from "@/app/types/typesGeoapify";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Check, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      toast.error("Erreur lors du chargement des stations");
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
      toast.success(
        newStatus === "active"
          ? "Station validée avec succès"
          : "Station marquée comme inactive"
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
      toast.error("Erreur lors de la mise à jour");
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
      toast.success("Station supprimée avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
      toast.error("Erreur lors de la suppression");
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
              {Object.entries(station.services)
                .filter(([key]) => key !== "id")
                .map(
                  ([key, value]) =>
                    value && (
                      <Badge key={key} variant="outline">
                        {key}
                      </Badge>
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
