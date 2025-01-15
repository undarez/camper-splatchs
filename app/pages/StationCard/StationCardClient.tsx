"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Station, Review, Service } from "@prisma/client";
import {
  MapIcon,
  ViewColumnsIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/app/components/ui/button";
import { Skeleton } from "@/app/components/ui/skeleton";
import dynamic from "next/dynamic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import type { Map as LeafletMap } from "leaflet";
import {
  Icon,
  Circle as LeafletCircle,
  Marker as LeafletMarker,
} from "leaflet";

const StationCard = dynamic(
  () => import("@/app/components/StationCard/index"),
  {
    ssr: false,
  }
);

const MapView = dynamic(
  () =>
    import("@/app/pages/MapView/MapViewComponent").then(
      (mod) => mod.MapViewComponent
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] w-full rounded-lg" />,
  }
);

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

export function StationCardClient() {
  const [stations, setStations] = useState<StationWithDetails[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "map">("cards");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { data: sessionData } = useSession();
  const stationsPerPage = 6;
  const router = useRouter();
  const [isLocating, setIsLocating] = useState(false);
  const mapRef = useRef<LeafletMap | null>(null);
  const userMarkerRef = useRef<LeafletMarker | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const hasFullAccess = useCallback(() => {
    return !!sessionData?.user;
  }, [sessionData]);

  const handleLogin = useCallback(() => {
    router.push("/signin");
  }, [router]);

  const handleRetry = useCallback(() => {
    router.refresh();
  }, [router]);

  const handleGeolocation = useCallback(() => {
    if (!mapRef.current || !isMapReady) {
      toast({
        title: "Erreur",
        description: "Veuillez patienter pendant le chargement de la carte",
        variant: "destructive",
      });
      return;
    }

    setIsLocating(true);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        if (mapRef.current) {
          try {
            mapRef.current.invalidateSize();

            const zoomLevel = accuracy < 100 ? 16 : accuracy < 500 ? 14 : 13;
            mapRef.current.setView([latitude, longitude], zoomLevel);

            if (userMarkerRef.current) {
              userMarkerRef.current.remove();
            }

            const userIcon = new Icon({
              iconUrl: "/images/logo.png",
              iconSize: [40, 40],
              iconAnchor: [20, 20],
              className: "user-location-marker",
            });

            const newMarker = new LeafletMarker([latitude, longitude], {
              icon: userIcon,
              title: "Votre position",
              alt: "Votre position actuelle",
              zIndexOffset: 1000,
            });

            const precisionCircle = new LeafletCircle([latitude, longitude], {
              radius: accuracy,
              weight: 1,
              color: "#3B82F6",
              fillColor: "#3B82F6",
              fillOpacity: 0.1,
            });

            newMarker.addTo(mapRef.current);
            precisionCircle.addTo(mapRef.current);
            userMarkerRef.current = newMarker;

            toast({
              title: "Succès",
              description: `Position trouvée avec une précision de ${Math.round(
                accuracy
              )}m`,
              variant: "default",
            });
          } catch (error) {
            console.error("Erreur lors de la mise à jour de la carte:", error);
            toast({
              title: "Erreur",
              description: "Erreur lors de la mise à jour de la carte",
              variant: "destructive",
            });
          }
        }
        setIsLocating(false);
      },
      (error) => {
        let message = "Une erreur est survenue lors de la géolocalisation";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message =
              "L'accès à votre position a été refusé. Veuillez vérifier les permissions de votre navigateur.";
            break;
          case error.POSITION_UNAVAILABLE:
            message =
              "Impossible d'obtenir votre position. Vérifiez que votre GPS est activé et que vous êtes à l'extérieur.";
            break;
          case error.TIMEOUT:
            message =
              "La demande de localisation a expiré. Veuillez réessayer.";
            break;
        }

        toast({
          title: "Erreur de localisation",
          description: message,
          variant: "destructive",
        });
        setIsLocating(false);
      },
      options
    );
  }, [isMapReady]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const fetchStations = async () => {
      try {
        const response = await fetch(
          "/api/stations?include=parkingDetails,services,reviews"
        );
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des stations");
        }
        const data = await response.json();
        setStations(data);
        setTotalPages(Math.ceil(data.length / stationsPerPage));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [isMounted, stationsPerPage]);

  if (!isMounted) {
    return <LoadingScreen />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Erreur</h3>
          <p>{error}</p>
          <Button
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  const filteredStations = stations.filter((station) => {
    const statusMatch =
      statusFilter === "all" || station.status === statusFilter;
    const typeMatch = typeFilter === "all" || station.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const indexOfLastStation = currentPage * stationsPerPage;
  const indexOfFirstStation = indexOfLastStation - stationsPerPage;
  const currentStations = filteredStations.slice(
    indexOfFirstStation,
    indexOfLastStation
  );

  return (
    <div className="relative z-0 min-h-screen bg-[#1E2337]">
      {!hasFullAccess() && (
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
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row">
        {/* Bouton pour ouvrir la sidebar en mobile */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-white md:hidden"
          aria-label="Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1E2337] transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 md:w-72 lg:w-80 shadow-lg border-r border-gray-700/50`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-6 md:hidden">
              <h2 className="text-lg font-semibold text-white">Options</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Filtres
                </h3>
                <div className="space-y-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full bg-gray-700/50 text-gray-200 border-gray-600">
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all" className="text-gray-200">
                        Tous les statuts
                      </SelectItem>
                      <SelectItem value="active" className="text-gray-200">
                        Active
                      </SelectItem>
                      <SelectItem value="en_attente" className="text-gray-200">
                        En attente
                      </SelectItem>
                      <SelectItem value="inactive" className="text-gray-200">
                        Inactive
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full bg-gray-700/50 text-gray-200 border-gray-600">
                      <SelectValue placeholder="Filtrer par type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all" className="text-gray-200">
                        Tous les types
                      </SelectItem>
                      <SelectItem
                        value="STATION_LAVAGE"
                        className="text-gray-200"
                      >
                        Stations de lavage
                      </SelectItem>
                      <SelectItem value="PARKING" className="text-gray-200">
                        Parkings
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Mode d'affichage
                </h3>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => setViewMode("cards")}
                    variant={viewMode === "cards" ? "default" : "ghost"}
                    className={`justify-start w-full ${
                      viewMode === "cards"
                        ? "bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white"
                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                    }`}
                  >
                    <ViewColumnsIcon className="h-4 w-4 mr-2" />
                    <span className="flex-1">Vue Fiches Stations</span>
                  </Button>

                  {hasFullAccess() ? (
                    <>
                      <Button
                        onClick={() => setViewMode("map")}
                        variant={viewMode === "map" ? "default" : "ghost"}
                        className={`justify-start w-full ${
                          viewMode === "map"
                            ? "bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white"
                            : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                        }`}
                      >
                        <MapIcon className="h-4 w-4 mr-2" />
                        <span className="flex-1">Vue Map interactive</span>
                      </Button>

                      <Button
                        onClick={handleGeolocation}
                        disabled={isLocating}
                        className="w-full bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white"
                      >
                        {isLocating ? (
                          <svg
                            className="animate-spin h-4 w-4 mr-2"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        ) : (
                          <MapPin className="h-4 w-4 mr-2" />
                        )}
                        {isLocating ? "Localisation..." : "Me localiser"}
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      className="justify-start w-full text-gray-500 cursor-not-allowed"
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

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Légende des statuts
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-white">Validée</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-white">En attente</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-white">Non validée</span>
                  </div>
                </div>
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
                  <div key={station.id} className="relative group">
                    <StationCard station={station} />
                    {!hasFullAccess() && (
                      <div className="absolute inset-0 bg-[#1E2337]/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-center p-4">
                          <p className="text-white text-sm mb-3">
                            Connectez-vous pour voir les détails
                          </p>
                          <Button
                            onClick={handleLogin}
                            className="bg-blue-500 hover:bg-blue-600"
                          >
                            Se connecter gratuitement
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              hasFullAccess() && (
                <div className="relative h-[calc(100vh-180px)]">
                  <div className="h-full rounded-lg overflow-hidden shadow-lg">
                    <MapView
                      stations={filteredStations}
                      onInit={(map) => {
                        mapRef.current = map;
                      }}
                      onMapReady={(ready) => setIsMapReady(ready)}
                    />
                  </div>
                </div>
              )
            )}

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

      {/* Barre de navigation mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1E2337] border-t border-gray-700/50 z-[1000]">
        <div className="flex flex-col gap-2 p-4">
          {/* Légendes en version mobile */}
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 mb-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-white text-sm">Validée</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-white text-sm">En attente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-white text-sm">Non validée</span>
              </div>
            </div>
          </div>

          {/* Boutons de navigation */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => setViewMode("cards")}
              variant={viewMode === "cards" ? "default" : "ghost"}
              className={`${
                viewMode === "cards"
                  ? "bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
              }`}
            >
              <ViewColumnsIcon className="h-4 w-4 mr-2" />
              Fiches
            </Button>

            {hasFullAccess() ? (
              <Button
                onClick={() => setViewMode("map")}
                variant={viewMode === "map" ? "default" : "ghost"}
                className={`${
                  viewMode === "map"
                    ? "bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                }`}
              >
                <MapIcon className="h-4 w-4 mr-2" />
                Carte
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="text-gray-500 cursor-not-allowed"
                disabled
              >
                <MapIcon className="h-4 w-4 mr-2" />
                Carte
              </Button>
            )}
          </div>

          {viewMode === "map" && hasFullAccess() && (
            <Button
              onClick={handleGeolocation}
              disabled={isLocating}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white"
            >
              {isLocating ? (
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <MapPin className="h-4 w-4 mr-2" />
              )}
              {isLocating ? "Localisation..." : "Me localiser"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default StationCardClient;
