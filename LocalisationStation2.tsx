"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSession, signIn } from "next-auth/react";
import {
  StationType,
  HighPressureType,
  ElectricityType,
  StationStatus,
  PaymentMethod,
} from "@prisma/client";
import AddStationModal from "@/app/components/Map/AddStationModal";
import { cn } from "@/lib/utils";
import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from "@geoapify/react-geocoder-autocomplete";
import {
  Icon,
  marker as LeafletMarker,
  Map,
  circle as LeafletCircle,
} from "leaflet";
import "leaflet/dist/leaflet.css";
import { useToast } from "@/hooks/use-toast";
import type {
  MapComponentProps,
  StationWithOptionalFields,
} from "@/app/components/Map/index";
import { checkGuestSession } from "./app/utils/guestSession";
import AuthDialog from "@/app/components/AuthDialog";

// Import dynamique de la carte complète
const MapComponent = dynamic<MapComponentProps>(
  () => import("@/app/components/Map").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center">
        <p>Chargement de la carte...</p>
      </div>
    ),
  }
);

interface GeoapifyProperties {
  lat: number;
  lon: number;
  formatted: string;
  address_line1?: string;
  city?: string;
  postcode?: string;
}

interface GeoapifyResult {
  properties: GeoapifyProperties;
}

interface StationData {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  lat: number | null;
  lng: number | null;
  type: StationType;
  highPressure: HighPressureType;
  tirePressure: boolean;
  vacuum: boolean;
  handicapAccess: boolean;
  wasteWater: boolean;
  waterPoint: boolean;
  wasteWaterDisposal: boolean;
  blackWaterDisposal: boolean;
  electricity: ElectricityType;
  maxVehicleLength: string;
  paymentMethods: string[];
  isPayant: boolean;
  tarif: string;
  commercesProches: string[];
}

interface Station {
  id: string;
  name: string;
  address: string;
  city: string | null;
  postalCode: string | null;
  latitude: number;
  longitude: number;
  status: StationStatus;
  type: StationType;
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
    hasElectricity: ElectricityType;
    commercesProches: string[];
    handicapAccess: boolean;
  } | null;
}

// Déplacer defaultFormData avant son utilisation
const defaultFormData = {
  name: "",
  address: "",
  city: "",
  postalCode: "",
  lat: null as number | null,
  lng: null as number | null,
  type: StationType.STATION_LAVAGE,
  highPressure: HighPressureType.NONE,
  tirePressure: false,
  vacuum: false,
  handicapAccess: false,
  wasteWater: false,
  waterPoint: false,
  wasteWaterDisposal: false,
  blackWaterDisposal: false,
  electricity: ElectricityType.NONE,
  maxVehicleLength: "",
  paymentMethods: [] as string[],
  isPayant: false,
  tarif: "",
  commercesProches: [] as string[],
};

// Correction pour les icônes Leaflet
interface IconDefaultPrototype extends Icon.Default {
  _getIconUrl?: () => string;
}

delete (Icon.Default.prototype as IconDefaultPrototype)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

// Styles pour la barre de recherche
const searchBarStyles = `
  .geoapify-autocomplete-input {
    background: #1E2337;
    border: 1px solid rgba(75, 85, 99, 0.5);
    color: white;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    width: 100%;
  }
  .geoapify-autocomplete-items {
    background: #252B43;
    border: 1px solid rgba(75, 85, 99, 0.5);
    border-radius: 0.5rem;
    margin-top: 0.5rem;
    color: white;
  }
  .geoapify-autocomplete-item {
    padding: 0.5rem 1rem;
  }
  .geoapify-autocomplete-item:hover {
    background: #2A3150;
  }
  .user-location-marker {
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    }
  }
  /* Styles pour les contrôles de la carte */
  .leaflet-control-container .leaflet-top,
  .leaflet-control-container .leaflet-bottom {
    z-index: 400;
  }
  .leaflet-control-zoom {
    border: none !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  }
  .leaflet-control-zoom a {
    background-color: #252B43 !important;
    color: white !important;
    border: 1px solid rgba(75, 85, 99, 0.5) !important;
    transition: all 0.2s !important;
  }
  .leaflet-control-zoom a:hover {
    background-color: #2A3150 !important;
  }
  .leaflet-control-attribution {
    background-color: rgba(37, 43, 67, 0.8) !important;
    color: white !important;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
  .leaflet-control-attribution a {
    color: #60A5FA !important;
  }
`;

// Interface pour l'élément HTML étendu
interface ExtendedHTMLElement extends HTMLElement {
  _leaflet_map?: {
    setView: (coords: [number, number], zoom: number) => void;
    locate: (options?: { setView?: boolean; maxZoom?: number }) => L.Map;
    invalidateSize: () => void;
  };
}

// Fonction pour gérer le clic sur la carte
const handleMapClick = (
  mapElement: ExtendedHTMLElement | null,
  latitude: number,
  longitude: number
) => {
  if (mapElement?._leaflet_map) {
    mapElement._leaflet_map.setView([latitude, longitude], 15);
  }
};

export default function LocalisationStation2() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<StationData>(defaultFormData);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const mapCenter: [number, number] = [46.603354, 1.888334];
  const [stations, setStations] = useState<Station[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const { data: sessionData, status } = useSession();
  const mapRef = useRef<Map | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [guestSessionId, setGuestSessionId] = useState<string | null>(null);

  // Tous les hooks doivent être appelés avant les conditions
  const onFormDataChange = useCallback((updates: Partial<StationData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleGeolocation = useCallback(() => {
    const map = mapRef.current;
    if (!map) {
      toast({
        title: "Erreur",
        description: "La carte n'est pas encore chargée",
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

        if (mapRef.current && mapRef.current.getContainer()) {
          try {
            mapRef.current.invalidateSize();

            setTimeout(() => {
              if (mapRef.current) {
                const zoomLevel =
                  accuracy < 100 ? 16 : accuracy < 500 ? 14 : 13;
                mapRef.current.setView([latitude, longitude], zoomLevel);

                if (userMarkerRef.current) {
                  userMarkerRef.current.remove();
                }

                const userIcon = new Icon({
                  iconUrl: "/markers/user-location.svg",
                  iconSize: [32, 32],
                  iconAnchor: [16, 16],
                  className: "user-location-marker",
                });

                const newMarker = LeafletMarker([latitude, longitude], {
                  icon: userIcon,
                  title: "Votre position",
                  alt: "Votre position actuelle",
                  zIndexOffset: 1000,
                });

                const precisionCircle = LeafletCircle([latitude, longitude], {
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
              }
            }, 100);
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
  }, [toast]);

  // Vérifier la session au chargement
  useEffect(() => {
    const checkSession = async () => {
      const sessionId = sessionStorage.getItem("guestSessionId");
      if (sessionId) {
        const isValid = await checkGuestSession();
        if (isValid) {
          setGuestSessionId(sessionId);
          setIsGuest(true);
          setShowAuthDialog(false);
        } else {
          sessionStorage.removeItem("guestSessionId");
          setShowAuthDialog(true);
        }
      }
    };

    checkSession();
  }, []);

  // Sauvegarder la session dans sessionStorage quand elle est créée
  useEffect(() => {
    if (guestSessionId) {
      sessionStorage.setItem("guestSessionId", guestSessionId);
    }
  }, [guestSessionId]);

  // Ajouter signIn à l'objet window
  useEffect(() => {
    const signInFunction = signIn;
    (window as Window & { signIn?: typeof signIn }).signIn = signInFunction;
    return () => {
      delete (window as Window & { signIn?: typeof signIn }).signIn;
    };
  }, []);

  // Vérifier le statut d'authentification
  useEffect(() => {
    if (status === "loading") return;
    if (!sessionData && !isGuest) {
      setShowAuthDialog(true);
    }
  }, [sessionData, status, isGuest]);

  // Charger les stations
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("/api/stations");
        if (response.ok) {
          const data = await response.json();
          setStations(
            data.map((station: Station) => ({
              ...station,
              services: station.services || null,
              parkingDetails: station.parkingDetails || null,
            }))
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des stations:", error);
      }
    };

    fetchStations();
  }, []);

  // Vérifier si la carte est prête
  useEffect(() => {
    if (isMapReady) {
      console.log("La carte est prête à être utilisée");
    }
  }, [isMapReady]);

  // Gérer le chargement
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#1E2337] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Afficher la modale d'authentification si nécessaire
  if (!sessionData && !isGuest && showAuthDialog) {
    return (
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />
    );
  }

  const getMarkerIcon = (status: StationStatus, type: StationType) => {
    if (type === StationType.PARKING) {
      return "/markers/parking.svg";
    }

    switch (status) {
      case "active":
        return "/markers/station-active.svg";
      case "en_attente":
        return "/markers/station-waiting.svg";
      case "inactive":
        return "/markers/station-inactive.svg";
      default:
        return "/markers/station-active.svg";
    }
  };

  // Fonction pour créer le contenu du popup
  const createPopupContent = (station: StationWithOptionalFields) => {
    const isAuthenticated = sessionData !== null;

    if (!isAuthenticated) {
      return `
        <div class="p-4 max-w-xs">
          <h3 class="text-lg font-semibold mb-2">${station.name}</h3>
          <p class="text-sm text-gray-600">Type: ${
            station.type === "STATION_LAVAGE" ? "Station de lavage" : "Parking"
          }</p>
          <div class="mt-2">
            <p class="text-sm text-gray-600 italic">Connectez-vous pour voir l'adresse exacte et les détails complets</p>
            <button onclick="window.signIn()" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors w-full">
              Se connecter
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div class="p-4 max-w-xs">
        <h3 class="text-lg font-semibold mb-2">${station.name}</h3>
        <p class="text-sm text-gray-600 mb-2">${station.address}</p>
        <p class="text-sm mb-2">Coordonnées : ${station.latitude.toFixed(
          6
        )}, ${station.longitude.toFixed(6)}</p>
        ${
          station.services
            ? `
          <div class="mt-2 text-sm">
            <p class="font-semibold">Services disponibles :</p>
            <ul class="list-disc pl-4">
              ${
                station.services.tirePressure
                  ? "<li>Gonflage des pneus</li>"
                  : ""
              }
              ${station.services.vacuum ? "<li>Aspirateur</li>" : ""}
              ${station.services.waterPoint ? "<li>Point d'eau</li>" : ""}
            </ul>
          </div>
        `
            : ""
        }
      </div>
    `;
  };

  // Convertir les stations au type StationWithOptionalFields
  const convertedStations: StationWithOptionalFields[] = stations.map(
    (station) => ({
      id: station.id,
      name: station.name,
      address: station.address,
      city: station.city,
      postalCode: station.postalCode,
      latitude: station.latitude,
      longitude: station.longitude,
      status: station.status as StationStatus,
      type: station.type as StationType,
      services: station.services
        ? {
            id: station.services.id,
            highPressure: station.services.highPressure as HighPressureType,
            tirePressure: station.services.tirePressure,
            vacuum: station.services.vacuum,
            handicapAccess: station.services.handicapAccess,
            wasteWater: station.services.wasteWater,
            waterPoint: station.services.waterPoint,
            wasteWaterDisposal: station.services.wasteWaterDisposal,
            blackWaterDisposal: station.services.blackWaterDisposal,
            electricity: station.services.electricity as ElectricityType,
            maxVehicleLength: station.services.maxVehicleLength,
            paymentMethods: station.services.paymentMethods as PaymentMethod[],
          }
        : null,
      parkingDetails: station.parkingDetails
        ? {
            id: station.parkingDetails.id,
            isPayant: station.parkingDetails.isPayant,
            tarif: station.parkingDetails.tarif,
            hasElectricity: station.parkingDetails
              .hasElectricity as ElectricityType,
            commercesProches: station.parkingDetails.commercesProches,
            handicapAccess: station.parkingDetails.handicapAccess,
          }
        : null,
    })
  );

  return (
    <div className="min-h-screen bg-[#1E2337]">
      <style>
        {`
          ${searchBarStyles}
          
          .user-location-marker {
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
            }
            70% {
              transform: scale(1);
              box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
            }
            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
            }
          }

          /* Ajout du style pour le curseur */
          .leaflet-container {
            cursor: grab;
          }
          .leaflet-container:active {
            cursor: grabbing;
          }
          .leaflet-dragging .leaflet-container {
            cursor: grabbing;
          }
          .leaflet-control-zoom {
            cursor: pointer;
          }
        `}
      </style>

      <div className="flex flex-col md:flex-row relative pt-16">
        {/* Sidebar pour desktop */}
        <div className="hidden md:block w-80 bg-[#1E2337] border-r border-gray-700/50 p-4 h-screen fixed left-0 z-50">
          <div className="space-y-4">
            {/* Bouton de géolocalisation */}
            <button
              onClick={handleGeolocation}
              disabled={isLocating}
              className={cn(
                "w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isLocating ? (
                <svg
                  className="w-5 h-5 text-gray-400 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
              {isLocating ? "Localisation..." : "Me localiser"}
            </button>

            {/* Titre */}
            <h2 className="text-xl font-bold text-white mb-6">Filtres</h2>

            {/* Barre de recherche avec contexte */}
            <div className="bg-[#252B43] rounded-lg p-4 shadow-lg">
              <GeoapifyContext
                apiKey={process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}
              >
                <GeoapifyGeocoderAutocomplete
                  placeholder="Rechercher une adresse..."
                  lang="fr"
                  limit={5}
                  debounceDelay={300}
                  filterByCountryCode={["fr"]}
                  placeSelect={(value: GeoapifyResult | null) => {
                    if (value?.properties) {
                      const {
                        lat,
                        lon,
                        formatted,
                        address_line1,
                        city,
                        postcode,
                      } = value.properties;
                      setFormData((prev) => ({
                        ...prev,
                        lat,
                        lng: lon,
                        address: address_line1 || formatted,
                        city: city || "",
                        postalCode: postcode || "",
                      }));
                      setIsDialogOpen(true);
                    }
                  }}
                />
              </GeoapifyContext>
            </div>

            {/* Liste des stations */}
            <div className="space-y-3 mt-6 overflow-y-auto max-h-[calc(100vh-250px)]">
              {stations.map((station) => (
                <div
                  key={station.id}
                  className="bg-[#252B43] p-4 rounded-lg hover:bg-[#2A3150] transition-all cursor-pointer border border-gray-700/50"
                  onClick={() => {
                    const mapElement = document.getElementById(
                      "map"
                    ) as ExtendedHTMLElement;
                    handleMapClick(
                      mapElement,
                      station.latitude,
                      station.longitude
                    );
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      const mapElement = document.getElementById(
                        "map"
                      ) as ExtendedHTMLElement;
                      handleMapClick(
                        mapElement,
                        station.latitude,
                        station.longitude
                      );
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <h3 className="font-semibold text-white">{station.name}</h3>
                  <p className="text-sm text-gray-400">{station.address}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={cn(
                        "px-2 py-1 text-xs rounded-full flex items-center gap-1",
                        station.status === "active"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : station.status === "en_attente"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-red-500/20 text-red-400"
                      )}
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          station.status === "active"
                            ? "bg-emerald-400"
                            : station.status === "en_attente"
                            ? "bg-amber-400"
                            : "bg-red-400"
                        )}
                      />
                      {station.status === "active"
                        ? "Active"
                        : station.status === "en_attente"
                        ? "En attente"
                        : "Inactive"}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        station.type === StationType.STATION_LAVAGE
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-purple-500/20 text-purple-400"
                      )}
                    >
                      {station.type === StationType.STATION_LAVAGE
                        ? "Station de lavage"
                        : "Parking"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contenu principal avec la carte */}
        <div className="flex-1 md:ml-80">
          <div className="h-[calc(100vh-4rem)] p-4 bg-[#1E2337]">
            <div className="w-full h-full rounded-xl overflow-hidden border border-gray-700/50 shadow-xl relative">
              <MapComponent
                stations={convertedStations}
                getMarkerIcon={getMarkerIcon}
                center={mapCenter}
                zoom={8}
                onMapReady={(map) => {
                  mapRef.current = map;
                  setIsMapReady(true);
                }}
                createPopupContent={createPopupContent}
              />
            </div>
          </div>
        </div>

        {/* Barre de filtres mobile en bas */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1E2337] border-t border-gray-700/50 z-[1000]">
          {/* Barre de contrôle toujours visible */}
          <div className="flex items-center justify-between p-3 bg-[#252B43]">
            <button
              onClick={handleGeolocation}
              disabled={isLocating}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isLocating ? (
                <svg
                  className="w-5 h-5 text-gray-400 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
              {isLocating ? "Localisation..." : "Me localiser"}
            </button>

            <div className="flex-1 mx-4">
              <GeoapifyContext
                apiKey={process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}
              >
                <GeoapifyGeocoderAutocomplete
                  placeholder="Rechercher..."
                  lang="fr"
                  limit={5}
                  debounceDelay={300}
                  filterByCountryCode={["fr"]}
                  placeSelect={(value: GeoapifyResult | null) => {
                    if (value?.properties) {
                      const {
                        lat,
                        lon,
                        formatted,
                        address_line1,
                        city,
                        postcode,
                      } = value.properties;
                      setFormData((prev) => ({
                        ...prev,
                        lat,
                        lng: lon,
                        address: address_line1 || formatted,
                        city: city || "",
                        postalCode: postcode || "",
                      }));
                      setIsDialogOpen(true);
                    }
                  }}
                />
              </GeoapifyContext>
            </div>
          </div>

          {/* Liste des stations en version mobile */}
          <div className="overflow-y-auto max-h-[40vh] bg-[#1E2337] p-3 space-y-2">
            {stations.map((station) => (
              <button
                key={station.id}
                className="w-full bg-[#252B43] p-3 rounded-lg flex items-center justify-between hover:bg-[#2A3150] transition-all text-left"
                onClick={() => {
                  const mapElement = document.getElementById(
                    "map"
                  ) as ExtendedHTMLElement;
                  handleMapClick(
                    mapElement,
                    station.latitude,
                    station.longitude
                  );
                }}
                aria-label={`Voir la station ${station.name} sur la carte`}
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-sm">
                    {station.name}
                  </h3>
                  <p className="text-xs text-gray-400">{station.address}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      station.status === "active"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : station.status === "en_attente"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-red-500/20 text-red-400"
                    )}
                  >
                    {station.status === "active"
                      ? "Active"
                      : station.status === "en_attente"
                      ? "En attente"
                      : "Inactive"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AddStationModal
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setFormData(defaultFormData);
          setUploadedImages([]);
        }}
        formData={formData}
        onFormDataChange={onFormDataChange}
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
        onSubmit={async (stationData) => {
          try {
            const requestData = {
              name: stationData.name,
              address: stationData.address,
              city: stationData.city,
              postalCode: stationData.postalCode,
              latitude:
                Number(stationData.latitude) || Number(stationData.lat) || 0,
              longitude:
                Number(stationData.longitude) || Number(stationData.lng) || 0,
              type: stationData.type,
              images: uploadedImages,
              services:
                stationData.type === "STATION_LAVAGE"
                  ? {
                      highPressure: formData.highPressure,
                      tirePressure: formData.tirePressure,
                      vacuum: formData.vacuum,
                      handicapAccess: formData.handicapAccess,
                      wasteWater: formData.wasteWater,
                      waterPoint: formData.waterPoint,
                      wasteWaterDisposal: formData.wasteWaterDisposal,
                      blackWaterDisposal: formData.blackWaterDisposal,
                      electricity: formData.electricity,
                      maxVehicleLength: formData.maxVehicleLength
                        ? Number(formData.maxVehicleLength)
                        : null,
                      paymentMethods: formData.paymentMethods,
                    }
                  : undefined,
              parkingDetails:
                stationData.type === "PARKING"
                  ? {
                      isPayant: formData.isPayant,
                      tarif: formData.tarif ? Number(formData.tarif) : null,
                      hasElectricity: formData.electricity,
                      commercesProches: formData.commercesProches,
                      handicapAccess: formData.handicapAccess,
                    }
                  : undefined,
              author: {
                name: sessionData?.user?.name || "",
                email: sessionData?.user?.email || "",
              },
            };

            const response = await fetch("/api/AdminStation", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestData),
            });

            if (!response.ok) {
              throw new Error("Erreur lors de la création de la station");
            }

            await response.json();

            // Rafraîchir la liste des stations après l'ajout
            const updatedStationsResponse = await fetch("/api/stations");
            if (updatedStationsResponse.ok) {
              const updatedStations = await updatedStationsResponse.json();
              setStations(updatedStations);
            }

            toast({
              title: "Succès",
              description: "Station ajoutée avec succès",
            });
            setIsDialogOpen(false);
          } catch (error) {
            console.error("Erreur lors de la création de la station:", error);
            toast({
              title: "Erreur",
              description:
                "Une erreur est survenue lors de la création de la station",
              variant: "destructive",
            });
          }
        }}
      />
    </div>
  );
}
