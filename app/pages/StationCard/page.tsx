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
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import GoogleAdsense from "@/app/components/GoogleAdsense";

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
  const { theme, setTheme } = useTheme();
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
    <div className="relative min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                variant="ghost"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <AdjustmentsHorizontalIcon className="h-6 w-6" />
              </Button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Stations
              </h1>

              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Changer le thème</span>
              </Button>
            </div>

            <div
              className={`
                fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50
                md:relative md:transform-none md:w-auto md:h-auto md:shadow-none md:bg-transparent md:dark:bg-transparent
                ${
                  isSidebarOpen
                    ? "translate-x-0"
                    : "-translate-x-full md:translate-x-0"
                }
              `}
            >
              <div className="flex flex-col md:flex-row gap-4 p-4 md:p-0">
                <div className="flex items-center justify-between md:hidden mb-4">
                  <h2 className="text-lg font-semibold">Filtres</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </Button>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                  <Button
                    onClick={() => setViewMode("cards")}
                    variant={viewMode === "cards" ? "default" : "ghost"}
                    className={`flex items-center gap-2 transition-all duration-200 ${
                      viewMode === "cards"
                        ? "shadow-md transform scale-105"
                        : "hover:bg-white/50 dark:hover:bg-gray-600/50"
                    }`}
                  >
                    <ViewColumnsIcon className="h-5 w-5" />
                    Vue cartes
                  </Button>
                  <Button
                    onClick={() => setViewMode("map")}
                    variant={viewMode === "map" ? "default" : "ghost"}
                    className={`flex items-center gap-2 transition-all duration-200 ${
                      viewMode === "map"
                        ? "shadow-md transform scale-105"
                        : "hover:bg-white/50 dark:hover:bg-gray-600/50"
                    }`}
                  >
                    <MapIcon className="h-5 w-5" />
                    Vue carte
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <GoogleAdsense
            slot="1234567890"
            style={{ display: "block" }}
            format="auto"
            responsive={true}
          />
        </div>

        {/* Overlay pour la sidebar mobile */}
        {isSidebarOpen && (
          <button
            className="fixed inset-0 bg-black/50 z-40 md:hidden cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setIsSidebarOpen(false);
            }}
            aria-label="Fermer le menu"
            tabIndex={0}
          />
        )}

        <AnimatePresence mode="wait">
          {viewMode === "cards" ? (
            <motion.div
              key="cards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentStations.map((station, index) => (
                  <motion.div
                    key={station.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <StationCard station={station} />
                  </motion.div>
                ))}
              </div>

              {filteredStations.length > 0 && (
                <div className="my-8">
                  <GoogleAdsense
                    slot="9876543210"
                    style={{ display: "block" }}
                    format="auto"
                    responsive={true}
                  />
                </div>
              )}

              {filteredStations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
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
                          ? "bg-blue-500 text-white transform scale-105"
                          : "hover:bg-blue-50"
                      }`}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden relative z-10"
            >
              <div className="h-[calc(100vh-200px)] rounded-lg overflow-hidden">
                <MapView stations={filteredStations as unknown as Station[]} />
              </div>

              <div className="mt-8">
                <GoogleAdsense
                  slot="5432109876"
                  style={{ display: "block" }}
                  format="auto"
                  responsive={true}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ValidatedStations;
