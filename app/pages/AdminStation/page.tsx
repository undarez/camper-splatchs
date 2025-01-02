"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { StationType, HighPressureType, ElectricityType } from "@prisma/client";

interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  type: StationType;
  status: string;
  services: {
    id: string;
    highPressure: HighPressureType;
    tirePressure: boolean;
    vacuum: boolean;
    handicapAccess: boolean;
    wasteWater: boolean;
    waterPoint: boolean;
    wasteWaterDisposal: boolean;
    blackWaterDisposal: boolean;
    electricity: ElectricityType;
    maxVehicleLength: number | null;
    paymentMethods: string[];
  } | null;
  parkingDetails: {
    id: string;
    isPayant: boolean;
    tarif: number | null;
    taxeSejour: number | null;
    hasElectricity: ElectricityType;
    commercesProches: string[];
    handicapAccess: boolean;
    totalPlaces: number;
    hasWifi: boolean;
    hasChargingPoint?: boolean;
  } | null;
}

const AdminStations = () => {
  const { data: session } = useSession();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await fetch("/api/AdminStation");
      const data = await response.json();
      console.log("Stations reçues:", data);
      setStations(data);
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

  const handleStatusUpdate = async (stationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/AdminStation/${stationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");

      await fetchStations();
      toast({
        title: "Succès",
        description: "Statut mis à jour avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du statut",
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

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      await fetchStations();
      toast({
        title: "Succès",
        description: "Station supprimée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la station", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la station",
        variant: "destructive",
      });
    }
  };

  const renderServices = (station: Station) => {
    if (station.type === "PARKING" && station.parkingDetails) {
      console.log("Détails du parking:", station.parkingDetails);
      return (
        <TableCell>
          <div className="flex flex-wrap gap-2">
            {/* Tarif */}
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                station.parkingDetails.isPayant && station.parkingDetails.tarif
                  ? "bg-purple-500/20 text-purple-400"
                  : "bg-gray-500/20 text-gray-400"
              }`}
            >
              {station.parkingDetails.isPayant && station.parkingDetails.tarif
                ? `${station.parkingDetails.tarif}€/jour`
                : "Gratuit"}
            </span>

            {/* Nombre de places */}
            <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-full">
              {station.parkingDetails.totalPlaces} places
            </span>

            {/* Taxe de séjour */}
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                station.parkingDetails.taxeSejour &&
                station.parkingDetails.taxeSejour > 0
                  ? "bg-purple-500/20 text-purple-400"
                  : "bg-gray-500/20 text-gray-400"
              }`}
            >
              Taxe séjour: {station.parkingDetails.taxeSejour || 0}€/jour
            </span>

            {/* WiFi */}
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                station.parkingDetails.hasWifi
                  ? "bg-purple-500/20 text-purple-400"
                  : "bg-gray-500/20 text-gray-400"
              }`}
            >
              WiFi {station.parkingDetails.hasWifi ? "✓" : "✗"}
            </span>

            {/* Électricité */}
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                station.parkingDetails.hasElectricity !== "NONE"
                  ? "bg-purple-500/20 text-purple-400"
                  : "bg-gray-500/20 text-gray-400"
              }`}
            >
              Électricité{" "}
              {station.parkingDetails.hasElectricity !== "NONE"
                ? station.parkingDetails.hasElectricity === "AMP_8"
                  ? "8A"
                  : "15A"
                : "✗"}
            </span>

            {/* Accès handicapé */}
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                station.parkingDetails.handicapAccess
                  ? "bg-purple-500/20 text-purple-400"
                  : "bg-gray-500/20 text-gray-400"
              }`}
            >
              Accès handicapé{" "}
              {station.parkingDetails.handicapAccess ? "✓" : "✗"}
            </span>

            {/* Point de recharge */}
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                station.parkingDetails.hasChargingPoint
                  ? "bg-purple-500/20 text-purple-400"
                  : "bg-gray-500/20 text-gray-400"
              }`}
            >
              Point de recharge{" "}
              {station.parkingDetails.hasChargingPoint ? "✓" : "✗"}
            </span>

            {/* Commerces */}
            <div className="w-full mt-1">
              <div className="flex flex-wrap gap-1">
                {[
                  "NOURRITURE",
                  "BANQUE",
                  "CENTRE_VILLE",
                  "STATION_SERVICE",
                  "LAVERIE",
                  "GARAGE",
                ].map((commerce) => (
                  <span
                    key={commerce}
                    className={`px-2 py-1 text-xs rounded-full ${
                      station.parkingDetails?.commercesProches?.includes(
                        commerce
                      )
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {commerce.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </TableCell>
      );
    }

    if (station.type === "STATION_LAVAGE") {
      return (
        <TableCell>
          <div className="flex flex-wrap gap-2">
            {station.services && (
              <>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    station.services.highPressure !== "NONE"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  Haute pression{" "}
                  {station.services.highPressure !== "NONE"
                    ? `(${station.services.highPressure.toLowerCase()})`
                    : "✗"}
                </span>

                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    station.services.waterPoint
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  Point d'eau {station.services.waterPoint ? "✓" : "✗"}
                </span>

                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    station.services.wasteWater
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  Vidange eaux usées {station.services.wasteWater ? "✓" : "✗"}
                </span>

                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    station.services.wasteWaterDisposal
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  Évacuation eaux usées{" "}
                  {station.services.wasteWaterDisposal ? "✓" : "✗"}
                </span>

                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    station.services.vacuum
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  Aspirateur {station.services.vacuum ? "✓" : "✗"}
                </span>

                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    station.services.tirePressure
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  Pression des pneus {station.services.tirePressure ? "✓" : "✗"}
                </span>

                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    station.services.handicapAccess
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  Accès handicapé {station.services.handicapAccess ? "✓" : "✗"}
                </span>

                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    station.services.electricity !== "NONE"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  Électricité{" "}
                  {station.services.electricity !== "NONE"
                    ? station.services.electricity === "AMP_8"
                      ? "8A"
                      : "15A"
                    : "✗"}
                </span>

                {station.services.maxVehicleLength && (
                  <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                    Max {station.services.maxVehicleLength}m
                  </span>
                )}

                {station.services.paymentMethods && (
                  <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                    Paiement: {station.services.paymentMethods.join(", ")}
                  </span>
                )}
              </>
            )}
          </div>
        </TableCell>
      );
    }

    return <TableCell />;
  };

  if (session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return <div>Accès non autorisé</div>;
  }

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Gestion des stations</h1>

        <div className="bg-gray-800 rounded-lg p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stations.map((station) => (
                <TableRow key={station.id}>
                  <TableCell>{station.name}</TableCell>
                  <TableCell>{station.address}</TableCell>
                  {renderServices(station)}
                  <TableCell>
                    <select
                      value={station.status}
                      onChange={(e) =>
                        handleStatusUpdate(station.id, e.target.value)
                      }
                      className="bg-gray-700 text-white rounded px-2 py-1"
                    >
                      <option value="active">Active</option>
                      <option value="en_attente">En attente</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(station.id)}
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminStations;
