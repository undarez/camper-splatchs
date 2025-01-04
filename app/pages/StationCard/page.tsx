"use client";
import { useState, useEffect } from "react";
import { Station, Review, Service, PaymentMethod } from "@prisma/client";
import { StarIcon } from "@heroicons/react/24/solid";
import {
  MapIcon,
  ViewColumnsIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Skeleton } from "@/app/components/ui/skeleton";
import ConnectYou from "../auth/connect-you/page";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

// Import dynamique de la carte pour éviter les problèmes de SSR
const MapView = dynamic(() => import("@/app/pages/MapView/MapView"), {
  ssr: false,
  loading: () => <Skeleton className="h-[600px] w-full rounded-lg" />,
});

interface StationWithDetails extends Station {
  services: Service | null;
  parkingDetails: {
    isPayant: boolean;
    tarif: number | null;
    taxeSejour: number | null;
    hasElectricity: string;
    commercesProches: string[];
    handicapAccess: boolean;
    totalPlaces: number;
    hasWifi: boolean;
    hasChargingPoint: boolean;
  } | null;
  reviews: Review[];
  averageRating?: number;
}

const serviceLabels: { [key: string]: { [key: string]: string } } = {
  highPressure: {
    NONE: "Aucune haute pression",
    PASSERELLE: "Passerelle",
    ECHAFAUDAGE: "Échafaudage",
    PORTIQUE: "Portique",
  },
  electricity: {
    NONE: "Pas d'électricité",
    AMP_8: "8 Ampères",
    AMP_15: "15 Ampères",
  },
};

type ServiceValueType =
  | string
  | number
  | boolean
  | Date
  | PaymentMethod[]
  | string[]
  | null
  | undefined;

const StationCard = ({ station }: { station: StationWithDetails }) => {
  const { data: session } = useSession();

  if (!station) return null;

  const renderValue = (key: string, value: ServiceValueType): string => {
    if (value === null || value === undefined) return "";

    switch (key) {
      case "highPressure":
        return serviceLabels.highPressure[value as string] || String(value);
      case "electricity":
      case "hasElectricity":
        return serviceLabels.electricity[value as string] || String(value);
      case "paymentMethods":
        if (Array.isArray(value)) {
          return value
            .map((method) => {
              switch (method) {
                case "JETON":
                  return "Jeton";
                case "ESPECES":
                  return "Espèces";
                case "CARTE_BANCAIRE":
                  return "Carte bancaire";
                default:
                  return method;
              }
            })
            .join(", ");
        }
        return String(value);
      case "commercesProches":
        if (Array.isArray(value)) {
          const labels: Record<string, string> = {
            NOURRITURE: "Alimentation",
            BANQUE: "Banque",
            CENTRE_VILLE: "Centre-ville",
            STATION_SERVICE: "Station-service",
            LAVERIE: "Laverie",
            GARAGE: "Garage",
          };
          return value
            .map((commerce) => labels[commerce as string] || commerce)
            .join(", ");
        }
        return String(value);
      case "isPayant":
        return typeof value === "boolean"
          ? value
            ? "Payant"
            : "Gratuit"
          : String(value);
      case "tarif":
        return value ? `${value}€/jour` : "Gratuit";
      case "taxeSejour":
        return value ? `${value}€/jour` : "0€/jour";
      case "totalPlaces":
        return value ? `${value} places` : "Non spécifié";
      case "waterPoint":
      case "wasteWaterDisposal":
      case "blackWaterDisposal":
      case "hasWifi":
      case "hasChargingPoint":
      case "handicapAccess":
        return typeof value === "boolean" ? (value ? "✓" : "✗") : String(value);
      default:
        return typeof value === "boolean" ? (value ? "✓" : "✗") : String(value);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-3">
        <div className="mb-2">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {station.address}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${
                  i < (station.averageRating || 0)
                    ? "text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
            <span className="text-xs text-gray-600 dark:text-gray-300 ml-1">
              ({station.reviews?.length || 0})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-200">
          {station.type === "STATION_LAVAGE" &&
            station.services &&
            Object.entries(station.services)
              .filter(([key]) => key !== "id" && key !== "stationId")
              .map(([key, value]) => {
                if (key === "id" || key === "stationId") return null;
                const displayValue = renderValue(key, value);
                if (!displayValue) return null;
                return (
                  <div key={key} className="flex items-center gap-1 text-xs">
                    <span
                      className={`${
                        typeof value === "boolean"
                          ? value
                            ? "text-green-500"
                            : "text-red-500"
                          : ""
                      }`}
                    >
                      {typeof value === "boolean" ? (value ? "✓" : "✗") : ""}
                    </span>
                    <span className="truncate">{displayValue}</span>
                  </div>
                );
              })}
          {station.type === "PARKING" &&
            station.parkingDetails &&
            Object.entries(station.parkingDetails)
              .filter(([key]) => key !== "id" && key !== "stationId")
              .map(([key, value]) => {
                if (key === "id" || key === "stationId") return null;
                const displayValue = renderValue(key, value);
                if (!displayValue) return null;
                return (
                  <div key={key} className="flex items-center gap-1 text-xs">
                    <span
                      className={`${
                        typeof value === "boolean"
                          ? value
                            ? "text-green-500"
                            : "text-red-500"
                          : ""
                      }`}
                    >
                      {typeof value === "boolean" ? (value ? "✓" : "✗") : ""}
                    </span>
                    <span className="truncate">{displayValue}</span>
                  </div>
                );
              })}
        </div>

        <div className="mt-3 flex justify-end">
          {session ? (
            <Link href={`/pages/StationDetail/${station.id}`}>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 h-7">
                Y aller
              </Button>
            </Link>
          ) : (
            <ConnectYou />
          )}
        </div>
      </div>
    </div>
  );
};

const ValidatedStations = () => {
  const [stations, setStations] = useState<StationWithDetails[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "map">("cards");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const stationsPerPage = 6;

  useEffect(() => {
    async function fetchStations() {
      try {
        setError(null);
        const response = await fetch("/api/stations");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Stations reçues:", data);
        setStations(data);
        setTotalPages(Math.ceil(data.length / stationsPerPage));
      } catch (error) {
        console.error("Erreur lors de la récupération des stations:", error);
        setError(
          error instanceof Error ? error.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchStations();
  }, []);

  const filteredStations = stations.filter((station) => {
    console.log("Filtrage station:", station.status, statusFilter);
    return statusFilter === "all" || station.status === statusFilter;
  });

  const indexOfLastStation = currentPage * stationsPerPage;
  const indexOfFirstStation = indexOfLastStation - stationsPerPage;
  const currentStations = filteredStations.slice(
    indexOfFirstStation,
    indexOfLastStation
  );

  console.log("Stations filtrées:", filteredStations);
  console.log("Stations actuelles:", currentStations);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Erreur</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-0 min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 md:w-72 lg:w-80 shadow-lg`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-6 md:hidden">
              <h2 className="text-lg font-semibold dark:text-white">Filtres</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full bg-white dark:bg-gray-800/80 dark:text-gray-100 dark:border-gray-700">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem
                    value="all"
                    className="dark:text-gray-100 dark:focus:bg-gray-700"
                  >
                    Tous les statuts
                  </SelectItem>
                  <SelectItem
                    value="active"
                    className="dark:text-gray-100 dark:focus:bg-gray-700"
                  >
                    Active
                  </SelectItem>
                  <SelectItem
                    value="en_attente"
                    className="dark:text-gray-100 dark:focus:bg-gray-700"
                  >
                    En attente
                  </SelectItem>
                  <SelectItem
                    value="inactive"
                    className="dark:text-gray-100 dark:focus:bg-gray-700"
                  >
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setViewMode("cards")}
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  className={`justify-start w-full ${
                    viewMode === "cards"
                      ? "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <ViewColumnsIcon className="h-4 w-4 mr-2" />
                  <span className="flex-1">Vue Fiches Stations</span>
                </Button>
                <Button
                  onClick={() => setViewMode("map")}
                  variant={viewMode === "map" ? "default" : "ghost"}
                  className={`justify-start w-full ${
                    viewMode === "map"
                      ? "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <MapIcon className="h-4 w-4 mr-2" />
                  <span className="flex-1">Vue Map interactive</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay pour mobile */}
        {isSidebarOpen && (
          <button
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Fermer la sidebar"
          />
        )}

        {/* Contenu principal */}
        <main className="flex-1 min-h-screen">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg mb-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 shadow-lg border border-white/20 transition-all duration-200 flex items-center gap-2"
                aria-label="Ouvrir les filtres"
              >
                <FunnelIcon className="h-5 w-5 text-white" />
                <span className="text-white text-sm hidden sm:inline">
                  Filtres
                </span>
              </button>
              <div className="flex-1 flex justify-center">
                <h1 className="text-lg sm:text-xl font-bold text-white">
                  Stations
                </h1>
              </div>
            </div>

            {/* Vue des cartes */}
            <div
              className={`w-full transition-all duration-300 ${
                isSidebarOpen ? "md:pl-4" : ""
              }`}
            >
              {viewMode === "cards" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                    {currentStations.map((station) => (
                      <div
                        className="w-full transform transition-all duration-200 hover:scale-[1.02]"
                        key={station.id}
                      >
                        <StationCard station={station} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination avec meilleur responsive */}
                  {filteredStations.length > stationsPerPage && (
                    <div className="flex justify-center mt-4 sm:mt-6 gap-1 sm:gap-2 flex-wrap">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <Button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          variant={
                            currentPage === i + 1 ? "default" : "outline"
                          }
                          size="sm"
                          className={`min-w-[2.5rem] h-8 px-2 sm:px-3 ${
                            currentPage === i + 1
                              ? "bg-blue-500 dark:bg-blue-600 text-white transform scale-105 shadow-lg"
                              : "hover:bg-blue-50 dark:hover:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                          }`}
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="h-[calc(100vh-180px)] rounded-lg overflow-hidden shadow-lg">
                  <MapView
                    stations={stations.map((station) => ({
                      ...station,
                      validatedBy: station.validatedBy || "",
                    }))}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ValidatedStations;
