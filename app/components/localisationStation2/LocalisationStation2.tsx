"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSession, signIn } from "next-auth/react";
import { StationType, HighPressureType, ElectricityType } from "@prisma/client";
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
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";
import {
  checkGuestSession,
  createGuestSession,
} from "@/app/utils/guestSession";
import Image from "next/image";
import type {
  StationStatus,
  StationWithOptionalFields,
} from "@/app/types/station";
import { StationData } from "./types";
import type { MapProps } from "@/app/components/Map/index";

// Import dynamique de la carte complète
const DynamicMap = dynamic<MapProps>(
  () => import("@/app/components/Map/index").then((mod) => mod.MapComponent),
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

const defaultFormData: StationData = {
  name: "",
  address: "",
  city: "",
  postalCode: "",
  lat: null,
  lng: null,
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
  hasElectricity: ElectricityType.NONE,
  maxVehicleLength: "",
  paymentMethods: [],
  isPayant: false,
  tarif: "",
  commercesProches: [],
  taxeSejour: "",
  totalPlaces: 0,
  hasWifi: false,
  hasChargingPoint: false,
  phoneNumber: "",
  description: "",
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

// Modifier les styles de la barre de recherche
const searchBarStyles = `
  .geoapify-autocomplete-input {
    background: #1E2337;
    border: 1px solid rgba(75, 85, 99, 0.5);
    color: white;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    width: 100%;
    font-size: 0.875rem;
    line-height: 1.25rem;
    text-align: center;
  }
  .geoapify-close-button {
    display: none !important;
  }
  .geoapify-autocomplete-items {
    background: #252B43;
    border: 1px solid rgba(75, 85, 99, 0.5);
    border-radius: 0.5rem;
    margin-top: 0.5rem;
    color: white;
    text-align: left;
  }
  .geoapify-autocomplete-item {
    padding: 0.75rem 1rem;
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
  const [stations, setStations] = useState<StationWithOptionalFields[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const { data: sessionData, status } = useSession();
  const mapRef = useRef<Map | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isValidGuest, setIsValidGuest] = useState(false);
  const [filters, setFilters] = useState<StationType[]>([]);

  // Déplacement de la fonction hasFullAccess ici
  const hasFullAccess = () => {
    return !!sessionData?.user;
  };

  useEffect(() => {
    async function checkSession() {
      const isValid = await checkGuestSession();
      setIsValidGuest(isValid);
    }
    checkSession();
  }, []);

  // Dialog d'authentification
  const AuthDialog = () => (
    <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
      <DialogContent className="sm:max-w-[425px] bg-[#1E2337] text-white">
        <DialogHeader>
          <DialogTitle>Authentification requise</DialogTitle>
          <DialogDescription className="text-gray-400">
            Connectez-vous pour accéder à toutes les fonctionnalités ou
            continuez en tant qu'invité.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Button
            onClick={() => signIn()}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Se connecter
          </Button>
          <Button
            onClick={async () => {
              const sessionId = await createGuestSession();
              if (sessionId) {
                setIsValidGuest(true);
                setShowAuthDialog(false);
              }
            }}
            variant="outline"
            className="w-full"
          >
            Continuer en tant qu'invité
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Tous les hooks doivent être appelés avant les conditions
  const onFormDataChange = useCallback((updates: Partial<StationData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!sessionData) {
      setShowAuthDialog(true);
    }
  }, [sessionData, status]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = searchBarStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (!isDialogOpen) {
      setFormData(defaultFormData);
      setUploadedImages([]);
    }
  }, [isDialogOpen]);

  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/stations");
        if (response.ok) {
          const data = await response.json();
          setStations(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des stations:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    fetchStations();
  }, []);

  useEffect(() => {
    if (isMapReady) {
      console.log("La carte est prête à être utilisée");
    }
  }, [isMapReady]);

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

        // S'assurer que la carte est toujours valide
        if (mapRef.current && mapRef.current.getContainer()) {
          try {
            // Invalider la taille de la carte pour forcer une mise à jour
            mapRef.current.invalidateSize();

            // Attendre un court instant pour s'assurer que la carte est prête
            setTimeout(() => {
              if (mapRef.current) {
                // Ajuster le zoom en fonction de la précision
                const zoomLevel =
                  accuracy < 100 ? 16 : accuracy < 500 ? 14 : 13;
                mapRef.current.setView([latitude, longitude], zoomLevel);

                // Supprimer l'ancien marqueur s'il existe
                if (userMarkerRef.current) {
                  userMarkerRef.current.remove();
                }

                // Créer un marqueur personnalisé pour la position de l'utilisateur
                const userIcon = new Icon({
                  iconUrl: "/images/logo.png",
                  iconSize: [40, 40],
                  iconAnchor: [20, 20],
                  className: "user-location-marker",
                });

                const newMarker = LeafletMarker([latitude, longitude], {
                  icon: userIcon,
                  title: "Votre position",
                  alt: "Votre position actuelle",
                  zIndexOffset: 1000,
                });

                // Ajouter un cercle de précision
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

  if (loading) {
    return <LoadingScreen />;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#1E2337] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!sessionData && !isValidGuest) {
    return <AuthDialog />;
  }

  const getMarkerIcon = (
    status: StationStatus,
    type: StationType,
    station: StationWithOptionalFields
  ): Icon => {
    let iconUrl = "/images/logo.png";

    if (type === StationType.PARKING) {
      iconUrl = "/images/logo.png";
    } else if (station.isLavaTrans) {
      iconUrl = "/images/article-lavatrans/lavatransicon-article.webp";
    } else if (station.isDelisle) {
      iconUrl = "/images/delisle/logo-delisle.png";
    } else if (type === StationType.STATION_LAVAGE) {
      iconUrl = "/images/logo.png";
    }

    return new Icon({
      iconUrl,
      iconRetinaUrl: iconUrl,
      shadowUrl: "/images/marker-shadow.png",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
      shadowSize: [41, 41],
      className: `station-marker ${status} ${
        type === StationType.PARKING
          ? "parking-marker"
          : "station-marker-normal"
      }`,
    });
  };

  // Convertir les stations au type Station
  const convertedStations: StationWithOptionalFields[] = stations.map(
    (station) => ({
      ...station,
      phoneNumber: station.phoneNumber || null,
      description: station.description || null,
      iconType: station.iconType || null,
      isLavaTrans: station.isLavaTrans || false,
      status: station.status || "inactive",
      services: station.services
        ? {
            id: station.services.id,
            createdAt: station.services.createdAt || new Date(),
            stationId: station.services.stationId || station.id,
            highPressure: station.services.highPressure as HighPressureType,
            tirePressure: station.services.tirePressure || false,
            vacuum: station.services.vacuum || false,
            handicapAccess: station.services.handicapAccess || false,
            wasteWater: station.services.wasteWater || false,
            waterPoint: station.services.waterPoint || false,
            wasteWaterDisposal: station.services.wasteWaterDisposal || false,
            blackWaterDisposal: station.services.blackWaterDisposal || false,
            electricity: station.services.electricity as ElectricityType,
            maxVehicleLength: station.services.maxVehicleLength || null,
            maxVehicleHeight: station.services.maxVehicleHeight || null,
            maxVehicleWidth: station.services.maxVehicleWidth || null,
            paymentMethods: station.services.paymentMethods || [],
          }
        : null,
      parkingDetails: station.parkingDetails
        ? {
            id: station.parkingDetails.id,
            createdAt: station.parkingDetails.createdAt || new Date(),
            stationId: station.parkingDetails.stationId || station.id,
            isPayant: station.parkingDetails.isPayant || false,
            tarif: station.parkingDetails.tarif || null,
            taxeSejour: station.parkingDetails.taxeSejour || null,
            hasElectricity: station.parkingDetails
              .hasElectricity as ElectricityType,
            commercesProches: station.parkingDetails.commercesProches || [],
            handicapAccess: station.parkingDetails.handicapAccess || false,
            totalPlaces: station.parkingDetails.totalPlaces || 0,
            hasWifi: station.parkingDetails.hasWifi || false,
            hasChargingPoint: station.parkingDetails.hasChargingPoint || false,
            waterPoint: station.parkingDetails.waterPoint || false,
            wasteWater: station.parkingDetails.wasteWater || false,
            wasteWaterDisposal:
              station.parkingDetails.wasteWaterDisposal || false,
            blackWaterDisposal:
              station.parkingDetails.blackWaterDisposal || false,
            hasCctv: station.parkingDetails.hasCctv || false,
            hasBarrier: station.parkingDetails.hasBarrier || false,
            maxDuration: station.parkingDetails.maxDuration || null,
            maxVehicleHeight: station.parkingDetails.maxVehicleHeight || null,
            maxVehicleLength: station.parkingDetails.maxVehicleLength || null,
            maxVehicleWidth: station.parkingDetails.maxVehicleWidth || null,
          }
        : null,
    })
  );

  const createPopupContent = (station: StationWithOptionalFields) => {
    const isAuthenticated = sessionData !== null;

    if (!isAuthenticated) {
      return `
        <div class="p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-white">${station.name}</h3>
            <span class="px-3 py-1 text-xs bg-[#40E0D0] text-[#1E2337] rounded-full font-medium">
              ${
                station.type === "STATION_LAVAGE"
                  ? station.isLavaTrans
                    ? "LavaTrans"
                    : "Station"
                  : "Parking"
              }
            </span>
          </div>
          <div class="mt-6 text-center">
            <p class="text-white mb-4">Connectez-vous pour voir l'adresse exacte et les détails complets</p>
            <button onclick="window.signIn()" class="w-full px-4 py-2 bg-[#40E0D0] text-[#1E2337] rounded-lg text-sm font-medium hover:bg-[#3BC7B7] transition-all transform hover:scale-105">
              Se connecter
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-white">${station.name}</h3>
          <span class="px-3 py-1 text-xs rounded-full bg-[#40E0D0] text-[#1E2337] font-medium">
            ${station.type === "STATION_LAVAGE" ? "Station" : "Parking"}
          </span>
        </div>

        <div class="space-y-3 mb-4">
          <div class="flex items-center gap-3 bg-[#252B43] p-3 rounded-lg">
            <svg class="w-5 h-5 text-[#40E0D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <p class="text-sm text-white">${station.address}</p>
          </div>

          ${
            station.phoneNumber
              ? `
            <div class="flex items-center gap-3 bg-[#252B43] p-3 rounded-lg">
              <svg class="w-5 h-5 text-[#40E0D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <p class="text-sm text-white">${station.phoneNumber}</p>
            </div>
          `
              : ""
          }

          ${
            station.description
              ? `
            <div class="flex items-start gap-3 bg-[#252B43] p-3 rounded-lg">
              <svg class="w-5 h-5 text-[#40E0D0] mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-sm text-white">${station.description}</p>
            </div>
          `
              : ""
          }

          <div class="flex items-start gap-3 bg-[#252B43] p-3 rounded-lg">
            <svg class="w-5 h-5 text-[#40E0D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
            <div class="text-sm text-white">
              <p>Lat: ${station.latitude.toFixed(6)}</p>
              <p>Long: ${station.longitude.toFixed(6)}</p>
            </div>
          </div>
        </div>

        ${
          station.type === StationType.STATION_LAVAGE && station.services
            ? `
            <div class="border-t border-gray-700 pt-4 mt-4">
              <h4 class="text-sm font-bold text-white mb-3">Services disponibles</h4>
              <div class="grid grid-cols-2 gap-3">
                ${
                  station.services.highPressure !== "NONE"
                    ? `
                    <div class="service-card rounded-lg p-3">
                      <span class="text-sm text-[#40E0D0] font-medium">Haute pression</span>
                      <p class="text-xs text-white mt-1">${station.services.highPressure}</p>
                    </div>`
                    : ""
                }
                ${
                  station.services.tirePressure
                    ? `
                    <div class="service-card rounded-lg p-3">
                      <span class="text-sm text-[#40E0D0] font-medium">Gonflage pneus</span>
                    </div>`
                    : ""
                }
                ${
                  station.services.vacuum
                    ? `
                    <div class="service-card rounded-lg p-3">
                      <span class="text-sm text-[#40E0D0] font-medium">Aspirateur</span>
                    </div>`
                    : ""
                }
                ${
                  station.services.waterPoint
                    ? `
                    <div class="service-card rounded-lg p-3">
                      <span class="text-sm text-[#40E0D0] font-medium">Point d'eau</span>
                    </div>`
                    : ""
                }
                ${
                  station.services.wasteWater
                    ? `
                    <div class="service-card rounded-lg p-3">
                      <span class="text-sm text-[#40E0D0] font-medium">Eaux usées</span>
                    </div>`
                    : ""
                }
                ${
                  station.services.wasteWaterDisposal
                    ? `
                    <div class="service-card rounded-lg p-3">
                      <span class="text-sm text-[#40E0D0] font-medium">Vidange eaux usées</span>
                    </div>`
                    : ""
                }
                ${
                  station.services.blackWaterDisposal
                    ? `
                    <div class="service-card rounded-lg p-3">
                      <span class="text-sm text-[#40E0D0] font-medium">Vidange eaux noires</span>
                    </div>`
                    : ""
                }
                ${
                  station.services.electricity !== "NONE"
                    ? `
                    <div class="service-card rounded-lg p-3">
                      <span class="text-sm text-[#40E0D0] font-medium">Électricité</span>
                      <p class="text-xs text-white mt-1">${station.services.electricity}</p>
                    </div>`
                    : ""
                }
                ${
                  station.services.maxVehicleLength
                    ? `
                    <div class="service-card rounded-lg p-3">
                      <span class="text-sm text-[#40E0D0] font-medium">Longueur max.</span>
                      <p class="text-xs text-white mt-1">${station.services.maxVehicleLength}m</p>
                    </div>`
                    : ""
                }
                ${
                  station.services.handicapAccess
                    ? `
                    <div class="service-card rounded-lg p-3">
                      <span class="text-sm text-[#40E0D0] font-medium">Accès PMR</span>
                    </div>`
                    : ""
                }
              </div>
            </div>
            `
            : ""
        }

        ${
          station.type === StationType.PARKING && station.parkingDetails
            ? `
            <div class="border-t border-gray-700 pt-4 mt-4">
              <h4 class="text-sm font-bold text-white mb-3">Services disponibles</h4>
              <div class="grid grid-cols-2 gap-3">
                <div class="service-card rounded-lg p-3">
                  <span class="text-sm text-[#40E0D0] font-medium">Tarif</span>
                  <p class="text-xs text-white mt-1">${
                    station.parkingDetails.isPayant
                      ? `${station.parkingDetails.tarif}€/jour`
                      : "Gratuit"
                  }</p>
                </div>
                ${
                  station.parkingDetails.totalPlaces
                    ? `
                    <div class="service-card rounded-lg p-3">
                      <span class="text-sm text-[#40E0D0] font-medium">Places</span>
                      <p class="text-xs text-white mt-1">${station.parkingDetails.totalPlaces} places</p>
                    </div>`
                    : ""
                }
                ${
                  station.parkingDetails.waterPoint
                    ? `
                    <div class="service-card rounded-lg p-3">
                      <span class="text-sm text-[#40E0D0] font-medium">Point d'eau</span>
                      <p class="text-xs text-white mt-1">Disponible</p>
                    </div>`
                    : ""
                }
                ${
                  station.parkingDetails.wasteWater
                    ? `
                    <div class="service-card rounded-lg p-3">
                      <span class="text-sm text-[#40E0D0] font-medium">Vidange eaux usées</span>
                      <p class="text-xs text-white mt-1">Disponible</p>
                    </div>`
                    : ""
                }
                ${
                  station.parkingDetails.wasteWaterDisposal
                    ? `
                    <div class="service-card rounded-lg p-3">
                      <span class="text-sm text-[#40E0D0] font-medium">Évacuation eaux usées</span>
                      <p class="text-xs text-white mt-1">Disponible</p>
                    </div>`
                    : ""
                }
                ${
                  station.parkingDetails.blackWaterDisposal
                    ? `
                    <div class="service-card rounded-lg p-3">
                      <span class="text-sm text-[#40E0D0] font-medium">Évacuation eaux noires</span>
                      <p class="text-xs text-white mt-1">Disponible</p>
                    </div>`
                    : ""
                }
                ${
                  station.parkingDetails.hasWifi
                    ? `
                    <div class="service-card rounded-lg p-3">
                      <span class="text-sm text-[#40E0D0] font-medium">WiFi</span>
                      <p class="text-xs text-white mt-1">Disponible</p>
                    </div>`
                    : ""
                }
                ${
                  station.parkingDetails.hasChargingPoint
                    ? `
                    <div class="service-card rounded-lg p-3">
                      <span class="text-sm text-[#40E0D0] font-medium">Point de recharge</span>
                      <p class="text-xs text-white mt-1">Disponible</p>
                    </div>`
                    : ""
                }
                ${
                  station.parkingDetails.handicapAccess
                    ? `
                    <div class="service-card rounded-lg p-3">
                      <span class="text-sm text-[#40E0D0] font-medium">Accès handicapé</span>
                      <p class="text-xs text-white mt-1">Disponible</p>
                    </div>`
                    : ""
                }
                ${
                  station.parkingDetails.hasElectricity !== "NONE"
                    ? `
                    <div class="service-card rounded-lg p-3">
                      <span class="text-sm text-[#40E0D0] font-medium">Électricité</span>
                      <p class="text-xs text-white mt-1">${station.parkingDetails.hasElectricity.replace(
                        "AMP_",
                        ""
                      )}A</p>
                    </div>`
                    : ""
                }
                ${
                  station.parkingDetails.commercesProches &&
                  station.parkingDetails.commercesProches.length > 0
                    ? `
                    <div class="service-card rounded-lg p-3 col-span-2">
                      <span class="text-sm text-[#40E0D0] font-medium">Commerces à proximité</span>
                      <p class="text-xs text-white mt-1">${station.parkingDetails.commercesProches.join(
                        ", "
                      )}</p>
                    </div>`
                    : ""
                }
              </div>
            </div>
            `
            : ""
        }
      </div>
    `;
  };

  return (
    <div className="min-h-screen bg-[#1E2337]">
      <style
        dangerouslySetInnerHTML={{
          __html: `
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

        .map-blur-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          backdrop-filter: blur(5px);
          background: rgba(30, 35, 55, 0.85);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
          color: white;
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

        .station-marker {
          transition: all 0.2s ease;
          z-index: 400;
        }
        .station-marker img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .station-marker.active {
          opacity: 1;
        }
        .station-marker.en_attente {
          opacity: 0.9;
        }
        .station-marker.inactive {
          opacity: 0.7;
        }
        .station-marker:hover {
          transform: scale(1.1);
          z-index: 1000 !important;
        }
        
        /* Styles spécifiques pour les marqueurs de parking */
        .parking-marker {
          filter: drop-shadow(0 0 4px #8B00FF);
        }
        
        /* Styles spécifiques pour les marqueurs de station */
        .station-marker-normal {
          filter: drop-shadow(0 0 4px #40E0D0);
        }
      `,
        }}
      />

      {/* Barre de navigation sous le header */}
      <div className="fixed top-20 left-0 right-0 bg-[#252B43] border-b border-gray-700/50 p-4 z-[1002]">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo et titre */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">
              Stations & Parkings
            </h1>
          </div>

          {/* Barre de recherche centrée */}
          <div className="flex-1 max-w-xl mx-4">
            <GeoapifyContext apiKey={process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}>
              <GeoapifyGeocoderAutocomplete
                placeholder="Ajouter une adresse..."
                lang="fr"
                limit={5}
                debounceDelay={300}
                filterByCountryCode={["fr"]}
                placeSelect={(value: GeoapifyResult | null) => {
                  if (!hasFullAccess()) {
                    toast({
                      title: "Accès limité",
                      description:
                        "Vous devez être connecté pour ajouter une station",
                      variant: "destructive",
                    });
                    return;
                  }
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
      </div>

      <div className="flex flex-col md:flex-row relative pt-36">
        {/* Sidebar pour desktop */}
        <div className="hidden md:block w-80 bg-[#1E2337] border-r border-gray-700/50 p-4 h-[calc(100vh-5rem)] fixed left-0 z-50 overflow-y-auto">
          <div className="space-y-4">
            {/* Filtres de type */}
            <div className="bg-[#252B43] rounded-lg p-4 shadow-lg">
              <h3 className="text-white font-semibold mb-3">Type</h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-gray-200">
                  <input
                    type="radio"
                    name="type"
                    value={StationType.STATION_LAVAGE}
                    checked={filters.includes(StationType.STATION_LAVAGE)}
                    onChange={() => setFilters([StationType.STATION_LAVAGE])}
                    className="form-radio text-blue-500"
                  />
                  Stations de lavage
                </label>
                <label className="flex items-center gap-2 text-gray-200">
                  <input
                    type="radio"
                    name="type"
                    value={StationType.PARKING}
                    checked={filters.includes(StationType.PARKING)}
                    onChange={() => setFilters([StationType.PARKING])}
                    className="form-radio text-blue-500"
                  />
                  Parkings
                </label>
                <label className="flex items-center gap-2 text-gray-200">
                  <input
                    type="radio"
                    name="type"
                    value="all"
                    checked={filters.length === 0}
                    onChange={() => setFilters([])}
                    className="form-radio text-blue-500"
                  />
                  Tous
                </label>
              </div>
            </div>

            {/* Légende */}
            <div className="bg-[#252B43] rounded-lg p-4 shadow-lg">
              <h3 className="text-white font-semibold mb-3">Légende</h3>
              <div className="space-y-3">
                {/* Types de stations */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#40E0D0]/20 rounded-lg">
                      <Image
                        src="/images/article-lavatrans/lavatransicon-article.webp"
                        alt="Station LavaTrans"
                        width={35}
                        height={35}
                        className="filter drop-shadow-[0_0_4px_#40E0D0]"
                      />
                    </div>
                    <span className="text-gray-300 text-sm">
                      Station LavaTrans
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#40E0D0]/20 rounded-lg">
                      <Image
                        src="/images/delisle/logo-delisle.png"
                        alt="Station Delisle"
                        width={45}
                        height={45}
                        className="filter drop-shadow-[0_0_4px_#40E0D0]"
                      />
                    </div>
                    <span className="text-gray-300 text-sm">
                      Station Delisle
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#40E0D0]/20 rounded-lg">
                      <Image
                        src="/images/logo.png"
                        alt="Station de lavage"
                        width={30}
                        height={30}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-gray-300 text-sm">
                      Station de lavage
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#8B00FF]/20 rounded-lg">
                      <Image
                        src="/images/logo.png"
                        alt="Parking"
                        width={45}
                        height={45}
                        className="filter drop-shadow-[0_0_4px_#8B00FF]"
                      />
                    </div>
                    <span className="text-gray-300 text-sm">Parking</span>
                  </div>
                </div>

                {/* Statuts */}
                <div className="pt-2 border-t border-gray-700/50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    <span className="text-gray-300 text-sm">Active</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <span className="text-gray-300 text-sm">En attente</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <span className="text-gray-300 text-sm">Inactive</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des stations */}
            <div className="space-y-3">
              {stations
                .filter(
                  (station) =>
                    filters.length === 0 || filters.includes(station.type)
                )
                .map((station) => (
                  <button
                    key={station.id}
                    className="w-full text-left bg-[#252B43] p-4 rounded-lg hover:bg-[#2A3150] transition-all border border-gray-700/50"
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
                          ? station.isLavaTrans
                            ? "Station LavaTrans"
                            : "Station de lavage"
                          : "Parking"}
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Contenu principal avec la carte */}
        <div className="flex-1 md:ml-80">
          <div className="h-[calc(100vh-5rem)] bg-[#1E2337]">
            <div className="w-full h-full rounded-xl overflow-hidden border border-gray-700/50 shadow-xl relative">
              <DynamicMap
                stations={convertedStations.filter(
                  (station) =>
                    filters.length === 0 || filters.includes(station.type)
                )}
                getMarkerIcon={getMarkerIcon}
                center={mapCenter}
                zoom={8}
                onMapReady={(map: L.Map) => {
                  mapRef.current = map;
                  setIsMapReady(true);
                }}
                createPopupContent={createPopupContent}
                onGeolocation={handleGeolocation}
                isLocating={isLocating}
              />
              {!hasFullAccess() && (
                <div className="map-blur-overlay">
                  <div className="bg-[#252B43] p-8 rounded-xl shadow-2xl border border-gray-700/50 max-w-md w-full">
                    <h2 className="text-3xl font-bold text-white mb-6">
                      Mode Invité
                    </h2>
                    <p className="text-lg text-gray-200 mb-8">
                      Pour voir les détails des stations et la carte complète,
                      veuillez vous connecter
                    </p>
                    <button
                      onClick={() =>
                        signIn(undefined, {
                          callbackUrl: "/localisationStation2",
                        })
                      }
                      className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-lg"
                    >
                      Se connecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Version mobile simplifiée */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#252B43] border-t border-gray-700/50 p-4 z-[1000]">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <button
                className={cn(
                  "flex-1 px-3 py-2 rounded-lg text-sm font-medium",
                  filters.includes(StationType.STATION_LAVAGE)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300"
                )}
                onClick={() => setFilters([StationType.STATION_LAVAGE])}
              >
                Stations
              </button>
              <button
                className={cn(
                  "flex-1 px-3 py-2 rounded-lg text-sm font-medium",
                  filters.includes(StationType.PARKING)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300"
                )}
                onClick={() => setFilters([StationType.PARKING])}
              >
                Parkings
              </button>
              <button
                className={cn(
                  "flex-1 px-3 py-2 rounded-lg text-sm font-medium",
                  filters.length === 0
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300"
                )}
                onClick={() => setFilters([])}
              >
                Tous
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Modification de la condition */}
      {hasFullAccess() && (
        <AddStationModal
          isOpen={isDialogOpen}
          onClose={() => {
            console.log("Fermeture de la modal");
            setIsDialogOpen(false);
            setFormData(defaultFormData);
            setUploadedImages([]);
          }}
          formData={formData}
          onFormDataChange={onFormDataChange}
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
          onSubmit={async (stationData) => {
            if (!hasFullAccess()) {
              toast({
                title: "Accès refusé",
                description:
                  "Vous devez être connecté pour effectuer cette action",
                variant: "destructive",
              });
              return;
            }
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
                        taxeSejour: formData.taxeSejour
                          ? Number(formData.taxeSejour)
                          : null,
                        hasElectricity:
                          formData.hasElectricity || formData.electricity,
                        commercesProches: formData.commercesProches || [],
                        handicapAccess: formData.handicapAccess,
                        totalPlaces: Number(formData.totalPlaces) || 0,
                        hasWifi: Boolean(formData.hasWifi),
                        hasChargingPoint: Boolean(formData.hasChargingPoint),
                        waterPoint: formData.waterPoint,
                        wasteWater: formData.wasteWater,
                        wasteWaterDisposal: formData.wasteWaterDisposal,
                        blackWaterDisposal: formData.blackWaterDisposal,
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
      )}
    </div>
  );
}
