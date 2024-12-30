"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import {
  StationType,
  HighPressureType,
  ElectricityType,
  StationStatus,
} from "@prisma/client";
import AddStationModal from "@/app/components/Map/AddStationModal";
import { cn } from "@/lib/utils";
import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from "@geoapify/react-geocoder-autocomplete";
import { Icon } from "leaflet";

// Import dynamique de la carte complète
const MapComponent = dynamic(
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
    background: #252B43;
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 0.5rem;
    padding: 0.75rem;
    font-size: 0.875rem;
    width: 100%;
    color: white;
    transition: all 0.2s;
  }
  .geoapify-autocomplete-input:focus {
    outline: none;
    border-color: rgba(59, 130, 246, 0.5);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
  .geoapify-autocomplete-items {
    background: #252B43;
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: 0.5rem;
    margin-top: 0.25rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  .geoapify-autocomplete-item {
    padding: 0.75rem;
    cursor: pointer;
    color: #94A3B8;
  }
  .geoapify-autocomplete-item:hover {
    background-color: #2A3150;
    color: white;
  }
`;

// Interface pour l'élément HTML étendu
interface ExtendedHTMLElement extends HTMLElement {
  _leaflet_map?: {
    setView: (coords: [number, number], zoom: number) => void;
    locate: (options?: { setView?: boolean; maxZoom?: number }) => L.Map;
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
  const [stations, setStations] = useState<Station[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<StationData>(defaultFormData);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const { data: sessionData } = useSession();
  const [isLocating, setIsLocating] = useState(false);

  // Ajoutons un useEffect pour réinitialiser formData et uploadedImages quand le modal se ferme
  useEffect(() => {
    if (!isDialogOpen) {
      setFormData(defaultFormData);
      setUploadedImages([]);
    }
  }, [isDialogOpen]);

  const mapCenter: [number, number] = [46.603354, 1.888334];

  // Chargement des stations
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("/api/stations");
        if (response.ok) {
          const data = await response.json();
          console.log("Stations reçues de l'API:", data);
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

  const onFormDataChange = useCallback((updates: Partial<StationData>) => {
    console.log("Mise à jour du formulaire:", updates);
    setFormData((prev) => {
      const newData = { ...prev, ...updates };
      console.log("Nouveau formData:", newData);
      return newData;
    });
  }, []);

  const handleGeolocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const mapElement = document.querySelector(
            ".leaflet-container"
          ) as ExtendedHTMLElement;
          if (mapElement?._leaflet_map) {
            mapElement._leaflet_map.setView(
              [position.coords.latitude, position.coords.longitude],
              13
            );
          }
          setIsLocating(false);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          let message = "";
          switch (error.code) {
            case 1: // PERMISSION_DENIED
              message =
                "Vous devez autoriser l'accès à votre position dans les paramètres de votre navigateur pour utiliser cette fonctionnalité.";
              break;
            case 2: // POSITION_UNAVAILABLE
              message =
                "Votre position n'a pas pu être déterminée. Vérifiez que votre GPS est activé.";
              break;
            case 3: // TIMEOUT
              message = "La demande de position a expiré. Veuillez réessayer.";
              break;
            default:
              message = "Une erreur est survenue lors de la géolocalisation.";
          }
          toast({
            title: "Erreur de localisation",
            description: message,
            variant: "destructive",
          });
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // 10 secondes au lieu de 5
          maximumAge: 0,
        }
      );
    } else {
      toast({
        title: "Erreur",
        description:
          "La géolocalisation n'est pas supportée par votre navigateur",
        variant: "destructive",
      });
      setIsLocating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1E2337]">
      <style>{searchBarStyles}</style>

      <div className="flex">
        {/* Sidebar gauche */}
        <div className="w-80 bg-[#1E2337] border-r border-gray-700/50 p-4 h-screen fixed left-0">
          <div className="space-y-4">
            {/* Bouton de géolocalisation */}
            <button
              onClick={handleGeolocation}
              disabled={isLocating}
              className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 p-4 rounded-lg flex items-center justify-center gap-2 transition-all border border-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLocating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
                  Localisation...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Me localiser
                </>
              )}
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
                  countryCodes={["fr"]}
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
        <div className="flex-1 ml-80">
          <div className="h-screen">
            <MapComponent
              stations={stations}
              getMarkerIcon={getMarkerIcon}
              center={mapCenter}
              zoom={8}
            />
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
            console.log("Données avant envoi:", stationData); // Pour debug
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

            console.log("Données envoyées:", requestData); // Pour debug

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

            const responseData = await response.json();
            console.log("Réponse du serveur:", responseData); // Pour debug

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
            console.error("Erreur:", error);
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
