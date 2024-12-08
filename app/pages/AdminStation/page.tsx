"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CamperWashStation } from "@/app/types/typesGeoapify";

const AdminStations = () => {
  const { data: session } = useSession();
  const [stations, setStations] = useState<CamperWashStation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await fetch("/api/AdminStation");
      const data = await response.json();
      setStations(data);
    } catch (error) {
      console.error("Erreur lors du chargement des stations", error);
      toast.error("Erreur lors du chargement des stations");
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
      toast.success("Statut mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut", error);
      toast.error("Erreur lors de la mise à jour du statut");
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
      toast.success("Station supprimée avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de la station", error);
      toast.error("Erreur lors de la suppression de la station");
    }
  };

  if (
    session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
    status === "unauthenticated"
  ) {
    return <div>Accès non autorisé</div>;
  }

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Gestion des stations</h1>

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
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(station.services).map(([key, value]) =>
                    key !== "id" && value ? (
                      <Badge key={key} variant="secondary">
                        {key}
                      </Badge>
                    ) : null
                  )}
                </div>
              </TableCell>
              <TableCell>
                <select
                  className="border rounded p-1"
                  value={station.status}
                  onChange={(e) =>
                    handleStatusUpdate(station.id, e.target.value)
                  }
                >
                  <option value="active">Active</option>
                  <option value="en_attente">En attente</option>
                  <option value="inactive">Inactive</option>
                </select>
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
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
  );
};

export default AdminStations;
