"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import LoadingMap from "@/app/pages/MapComponent/LoadingMap/page";
import { CamperWashStation, GeoapifyResult } from "@/app/types/typesGeoapify";
import AddStationModal from "@/app/pages/MapComponent/AddStation_modal/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ConnectYou from "@/app/pages/auth/connect-you/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdressGeoapifyWithNoSSR = dynamic(
  () =>
    import("@/app/components/AdressGeoapify/page").then((mod) => mod.default),
  { ssr: false, loading: () => <LoadingMap /> }
);

const STATUS_DISPLAY: Record<string, string> = {
  active: "Active",
  en_attente: "En attente",
  inactive: "Inactive",
};

const LocalisationStation = () => {
  const { data: session } = useSession();
  const [existingLocations, setExistingLocations] = useState<
    CamperWashStation[]
  >([]);
  const [selectedLocation, setSelectedLocation] =
    useState<GeoapifyResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Charger les stations existantes
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("/api/stationUpdapte");
        if (!response.ok)
          throw new Error("Erreur lors du chargement des stations");
        const data = await response.json();
        setExistingLocations(data);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Impossible de charger les stations");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStations();
  }, []);
  if (!session) {
    return <ConnectYou />;
  }

  const handleAddressSelect = (formatted: string, lat: number, lon: number) => {
    setSelectedLocation({
      properties: { formatted, lat, lon },
    });
    setIsModalOpen(true);
  };

  const handleAddStation = async (
    station: Omit<CamperWashStation, "id" | "createdAt">
  ) => {
    try {
      const response = await fetch("/api/stationUpdapte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(station),
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajout de la station");

      const newStation = await response.json();
      setExistingLocations([newStation, ...existingLocations]);
      toast.success("Station ajoutée avec succès");
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Impossible d'ajouter la station");
      throw error;
    }
  };

  const filteredLocations = existingLocations.filter((location) => {
    const matchesSearch =
      (location.name &&
        location.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (location.address &&
        location.address.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || location.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeStations = filteredLocations.filter(
    (location) => location.status === "active"
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Chargement des stations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Carte des stations CamperWash</h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-sm">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-sm">En attente</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-sm">Inactive</span>
          </div>
        </div>
      </div>
      {/* Filtres */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Rechercher une station..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="en_attente">En attente</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="h-[600px] rounded-lg overflow-hidden border border-border">
            <AdressGeoapifyWithNoSSR
              onAddressSelect={handleAddressSelect}
              errors={{}}
              existingLocations={filteredLocations as CamperWashStation[]}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-card rounded-lg border border-border">
            <h2 className="text-lg font-semibold mb-4">Statistiques</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-background rounded-md">
                <p className="text-sm text-muted-foreground">Total stations</p>
                <p className="text-2xl font-bold">{filteredLocations.length}</p>
              </div>
              <div className="p-3 bg-background rounded-md">
                <p className="text-sm text-muted-foreground">Actives</p>
                <p className="text-2xl font-bold text-green-500">
                  {activeStations.length}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-card rounded-lg border border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Stations récentes</h2>
              {session?.user?.email === "florianmtl@outlook.fr" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = "/admin/stations")}
                >
                  Gérer les stations
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {filteredLocations.slice(0, 5).map((location) => (
                <div
                  key={location.id}
                  className="p-3 bg-background rounded-md space-y-1"
                >
                  <p className="font-medium">{location.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {location.address}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        location.status === "active"
                          ? "bg-green-500"
                          : location.status === "en_attente"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                    <span className="text-xs text-muted-foreground">
                      {STATUS_DISPLAY[location.status || "inactive"]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddStationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedLocation={selectedLocation}
        onAddStation={handleAddStation}
      />
    </div>
  );
};

export default LocalisationStation;
