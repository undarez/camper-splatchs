"use client";

import { useEffect, useState } from "react";
import { CamperWashStation, SERVICE_LABELS } from "@/app/types";
import { Button } from "@/app/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import NavigationButton from "@/app/pages/MapComponent/NavigationGpsButton/NavigationButtonWrapper";
import { Badge } from "@/app/components/ui/badge";
import { Loader2, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";

type Filters = {
  search: string;
  status: string;
  services: { [key: string]: boolean };
};

interface StationsListProps {
  adminView?: boolean;
}

const ITEMS_PER_PAGE = 9;

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

const StationsList = ({ adminView = false }: StationsListProps) => {
  const [stations, setStations] = useState<CamperWashStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
    services: Object.keys(SERVICE_LABELS).reduce(
      (acc, key) => ({
        ...acc,
        [key]: false,
      }),
      {}
    ),
  });
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session } = useSession();
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await fetch("/api/stationUpdapte/AdminStation");
      if (!response.ok) throw new Error("Erreur lors de la requête");
      const data = await response.json();
      setStations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur lors du chargement des stations", error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des stations",
        variant: "destructive",
      });
      setStations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (stationId: string) => {
    if (!isAdmin) return;
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette station ?")) return;

    try {
      const response = await fetch(
        `/api/stationUpdapte/AdminStation/${stationId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error();

      await fetchStations();
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

  const handleServiceChange = (service: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: checked,
      },
    }));
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "en_attente":
        return "secondary";
      case "inactive":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "en_attente":
        return "En attente";
      case "inactive":
        return "Inactive";
      default:
        return status;
    }
  };

  const filteredStations = (stations || []).filter((station) => {
    if (!station) return false;

    if (!adminView && station.status !== "active") {
      return false;
    }

    if (
      filters.search &&
      !station.name?.toLowerCase().includes(filters.search.toLowerCase()) &&
      !station.address?.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    // Filtre par status (seulement en mode admin)
    if (
      adminView &&
      filters.status !== "all" &&
      station.status !== filters.status
    ) {
      return false;
    }

    // Filtre par services
    return Object.entries(filters.services).every(
      ([service, isChecked]) =>
        !isChecked ||
        (station.services &&
          station.services[service as keyof typeof station.services])
    );
  });

  const paginatedStations = filteredStations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredStations.length / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">
          {adminView ? "Gestion des stations" : "Toutes les stations actives"}
        </h1>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une station..."
              className="pl-8"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtres</SheetTitle>
                <SheetDescription>
                  Affinez votre recherche de stations
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      setFilters({ ...filters, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="en_attente">En attente</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtre par services - C'est ici que va votre code */}
                <div className="space-y-2">
                  <Label>Services</Label>
                  <div className="space-y-2">
                    {Object.entries(SERVICE_LABELS).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={filters.services[key]}
                          onCheckedChange={(checked) =>
                            handleServiceChange(key, checked === true)
                          }
                        />
                        <Label htmlFor={key}>{label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedStations.map((station) => (
              <div
                key={station.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative h-48">
                  <Image
                    src={station.images[0] || "/images/default-station.jpg"}
                    alt={station.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold">{station.name}</h2>
                    <Badge variant={getStatusVariant(station.status)}>
                      {getStatusLabel(station.status)}
                    </Badge>
                  </div>

                  <div className="flex items-start gap-2 mb-4">
                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                    <p className="text-gray-600">{station.address}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {station.services &&
                      Object.entries(station.services).map(
                        ([key, value]) =>
                          key !== "id" &&
                          value && (
                            <div
                              key={key}
                              className="flex items-center space-x-2 text-sm"
                            >
                              <span className="font-medium">
                                {formatKey(key)}:
                              </span>
                              <span>{formatValue(value)}</span>
                            </div>
                          )
                      )}
                  </div>

                  <div className="flex justify-between items-center">
                    <NavigationButton
                      lat={station.latitude}
                      lng={station.longitude}
                      address={station.address}
                    />

                    {isAdmin && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(station.id)}
                      >
                        Supprimer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredStations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Aucune station ne correspond à vos critères
            </div>
          ) : (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
// Ajouter un export par défaut qui utilise le composant en mode normal
export default function DefaultStationsList() {
  return <StationsList adminView={false} />;
}
