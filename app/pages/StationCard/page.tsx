"use client";
import { useState, useEffect } from "react";
import { Station, Review, Service } from "@prisma/client";
import { StarIcon } from "@heroicons/react/24/solid";
import {
  MapIcon,
  ViewColumnsIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Skeleton } from "@/app/components/ui/skeleton";
import ConnectYou from "../auth/connect-you/page";
import { useSession } from "next-auth/react";
import NavigationButton from "../MapComponent/NavigationGpsButton/NavigationButtonWrapper";
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

const renderServiceValue = (
  key: string,
  value: string | boolean | string[]
) => {
  if (key === "highPressure") {
    return serviceLabels.highPressure[value as string] || value;
  }
  if (key === "electricity") {
    return serviceLabels.electricity[value as string] || value;
  }
  if (key === "paymentMethods" && Array.isArray(value)) {
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
  return value ? "✓" : "✗";
};

const StationCard = ({ station }: { station: StationWithDetails }) => {
  const { status } = useSession();
  const averageRating = station.reviews?.length
    ? station.reviews.reduce((acc, review) => acc + review.rating, 0) /
      station.reviews.length
    : 0;

  if (status === "unauthenticated") {
    return <ConnectYou />;
  }

  if (status === "loading") {
    return <Skeleton className="h-[200px] rounded-lg" />;
  }

  return (
    <Link href={`/pages/StationDetail/${station.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-4">
        <h3 className="text-xl font-bold mb-2">{station.name}</h3>
        <p className="text-gray-600 mb-4">{station.address}</p>

        <div className="services mb-4">
          <h4 className="font-semibold mb-2">Services disponibles:</h4>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(station.services).map(
              ([key, value]) =>
                key !== "id" &&
                key !== "stationId" && (
                  <span key={key} className="text-sm">
                    <span className="font-medium">{key}: </span>
                    <span className="text-green-600">
                      {renderServiceValue(
                        key,
                        value as string | boolean | string[]
                      )}
                    </span>
                  </span>
                )
            )}
          </div>
        </div>

        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`h-5 w-5 ${
                star <= averageRating ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">
            ({station.reviews?.length || 0} avis)
          </span>
        </div>

        <div className="mt-4">
          <NavigationButton
            lat={station.latitude}
            lng={station.longitude}
            address={station.address}
          />
        </div>
      </div>
    </Link>
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
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <div
          className={`
            fixed md:relative inset-y-0 left-0 w-64 bg-white dark:bg-gray-800/90 shadow-lg transform transition-all duration-300 ease-in-out z-50 md:z-10
            ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }
          `}
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
                  className={`justify-start ${
                    viewMode === "cards"
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <ViewColumnsIcon className="h-4 w-4 mr-2" />
                  Vue cartes
                </Button>
                <Button
                  onClick={() => setViewMode("map")}
                  variant={viewMode === "map" ? "default" : "ghost"}
                  className={`justify-start ${
                    viewMode === "map"
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <MapIcon className="h-4 w-4 mr-2" />
                  Vue carte
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 md:ml-64">
          {/* Header mobile */}
          <div className="md:hidden bg-white dark:bg-gray-800/50 rounded-lg shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-700 dark:text-gray-300"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Stations
              </h1>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-4">
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentStations.map((station) => (
                  <StationCard key={station.id} station={station} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg overflow-hidden">
                <div className="h-[50vh] md:h-[calc(100vh-200px)] w-full rounded-lg overflow-hidden relative">
                  <div className="absolute inset-0">
                    <MapView
                      stations={filteredStations as unknown as Station[]}
                    />
                  </div>
                </div>
              </div>
            )}

            {filteredStations.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Aucune station ne correspond au filtre sélectionné
              </div>
            ) : (
              <div className="flex justify-center mt-8 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    className={`transition-all duration-200 ${
                      currentPage === i + 1
                        ? "bg-blue-500 dark:bg-blue-600 text-white transform scale-105"
                        : "hover:bg-blue-50 dark:hover:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    }`}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Overlay pour la sidebar mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Escape") setIsSidebarOpen(false);
            }}
            aria-label="Fermer le menu"
          />
        )}
      </div>
    </div>
  );
};

export default ValidatedStations;
