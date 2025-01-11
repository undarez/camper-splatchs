"use client";

import { useState, useEffect } from "react";
import { Station, Review, Service } from "@prisma/client";
import {
  MapIcon,
  ViewColumnsIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Skeleton } from "@/app/components/ui/skeleton";
import { useSession, signIn } from "next-auth/react";
import dynamic from "next/dynamic";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";
import StationCard from "@/app/components/StationCard";

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
    waterPoint: boolean;
    wasteWater: boolean;
    wasteWaterDisposal: boolean;
    blackWaterDisposal: boolean;
  } | null;
  reviews: Review[];
  averageRating?: number;
}

const StationCardPage = () => {
  const [stations, setStations] = useState<StationWithDetails[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "map">("cards");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const stationsPerPage = 6;

  const fetchStations = async () => {
    try {
      const response = await fetch("/api/stations");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des stations");
      }
      const data = await response.json();
      setStations(data);
      setTotalPages(Math.ceil(data.length / stationsPerPage));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  const filteredStations = stations.filter((station) => {
    return statusFilter === "all" || station.status === statusFilter;
  });

  const indexOfLastStation = currentPage * stationsPerPage;
  const indexOfFirstStation = indexOfLastStation - stationsPerPage;
  const currentStations = filteredStations.slice(
    indexOfFirstStation,
    indexOfLastStation
  );

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
    <div className="relative z-0 min-h-screen bg-[#1E2337]">
      {!session && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 mb-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-full">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Mode Invité</p>
                <p className="text-sm text-white/80">
                  Connectez-vous pour accéder à toutes les fonctionnalités
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => signIn("google")}
                className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                </svg>
                Se connecter
              </button>
            </div>
          </div>
        </div>
      )}

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
                {session ? (
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
                ) : (
                  <Button
                    variant="ghost"
                    className="justify-start w-full text-gray-400 cursor-not-allowed"
                    disabled
                  >
                    <MapIcon className="h-4 w-4 mr-2" />
                    <span className="flex-1">
                      Vue Map interactive (Connexion requise)
                    </span>
                  </Button>
                )}
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
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {currentStations.map((station) => (
                  <StationCard key={station.id} station={station} />
                ))}
              </div>
            ) : session ? (
              <div className="h-[calc(100vh-180px)] rounded-lg overflow-hidden shadow-lg">
                <MapView
                  stations={stations.map((station) => ({
                    ...station,
                    validatedBy: station.validatedBy || "",
                  }))}
                />
              </div>
            ) : null}

            {/* Pagination */}
            {viewMode === "cards" &&
              filteredStations.length > stationsPerPage && (
                <div className="flex justify-center mt-4 sm:mt-6 gap-1 sm:gap-2 flex-wrap">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      variant={currentPage === i + 1 ? "default" : "outline"}
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default StationCardPage;
