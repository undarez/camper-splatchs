"use client";
import { useState, useEffect } from "react";
import { Station, Review, Service, PaymentMethod } from "@prisma/client";
import { StarIcon } from "@heroicons/react/24/solid";
import {
  MapIcon,
  ViewColumnsIcon,
  Bars3Icon,
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
  services: Service;
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
      default:
        return typeof value === "boolean" ? (value ? "✓" : "✗") : String(value);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {station.address}
          </h3>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-5 w-5 ${
                  i < (station.averageRating || 0)
                    ? "text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
              ({station.reviews?.length || 0} avis)
            </span>
          </div>
        </div>

        <div className="space-y-2 text-gray-700 dark:text-gray-200">
          {station.services &&
            Object.entries(station.services).map(([key, value]) => {
              if (key === "id" || key === "stationId") return null;
              const displayValue = renderValue(key, value);
              return (
                <div key={key} className="flex items-center gap-2">
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
                  <span className="text-gray-800 dark:text-gray-200">
                    {displayValue}
                  </span>
                </div>
              );
            })}
        </div>

        <div className="mt-4 flex justify-end">
          {session ? (
            <Link href={`/pages/StationDetail/${station.id}`}>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
                size="sm"
              >
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
        const response = await fetch("/api/traking_User_API");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setStations(data.stations);
          setTotalPages(Math.ceil(data.stations.length / stationsPerPage));
        } else {
          throw new Error(data.error || "Une erreur est survenue");
        }
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

  const filteredStations = stations.filter(
    (station) => statusFilter === "all" || station.status === statusFilter
  );

  const indexOfLastStation = currentPage * stationsPerPage;
  const indexOfFirstStation = indexOfLastStation - stationsPerPage;
  const currentStations = filteredStations.slice(
    indexOfFirstStation,
    indexOfLastStation
  );

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
          className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0`}
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
                  <span className="flex-1">Vue cartes</span>
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
                  <span className="flex-1">Vue carte</span>
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
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <div className="flex gap-4 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className={`
                    ${
                      viewMode === "cards"
                        ? "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }
                    border-gray-200 dark:border-gray-700
                  `}
                >
                  Vue cartes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className={`
                    ${
                      viewMode === "map"
                        ? "bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }
                    border-gray-200 dark:border-gray-700
                  `}
                >
                  Vue carte
                </Button>
              </div>
            </div>

            {/* Contenu de la vue */}
            <div
              className={`w-full transition-all duration-300 ${
                isSidebarOpen ? "md:pl-4" : ""
              }`}
            >
              {viewMode === "cards" ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                    {currentStations.map((station) => (
                      <div
                        className="w-full max-w-sm transform transition-all duration-200 hover:scale-[1.02]"
                        key={station.id}
                      >
                        <StationCard station={station} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {filteredStations.length > stationsPerPage && (
                    <div className="flex justify-center mt-8 gap-2">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <Button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          variant={
                            currentPage === i + 1 ? "default" : "outline"
                          }
                          className={`transition-all duration-200 ${
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

                  {filteredStations.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg">
                      Aucune station ne correspond au filtre sélectionné
                    </div>
                  )}
                </>
              ) : (
                <div
                  className={`w-full h-[calc(100vh-200px)] rounded-lg overflow-hidden transition-opacity duration-300 ${
                    isSidebarOpen ? "opacity-0 md:opacity-100" : "opacity-100"
                  }`}
                >
                  <MapView stations={stations} />
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
