import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import {
  StationType,
  HighPressureType,
  ElectricityType,
  StationStatus,
} from "@prisma/client";
import AddPointModal from "@/app/components/AddPointModal";
import { cn } from "@/lib/utils";
import { GeoapifyGeocoderAutocomplete } from "@geoapify/react-geocoder-autocomplete";
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

interface StationFormData {
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
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 12px;
    font-size: 16px;
    width: 100%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .geoapify-autocomplete-items {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-top: 4px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  .geoapify-autocomplete-item {
    padding: 10px;
    cursor: pointer;
  }
  .geoapify-autocomplete-item:hover {
    background-color: #f5f5f5;
  }
`;

// Interface pour l'élément HTML étendu
interface ExtendedHTMLElement extends HTMLElement {
  _leaflet_map?: {
    setView: (coords: [number, number], zoom: number) => void;
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
  const [formData, setFormData] = useState<StationFormData>(defaultFormData);
  const { data: sessionData } = useSession();
  const router = useRouter();

  const mapCenter: [number, number] = [46.603354, 1.888334];

  // Chargement des stations
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("/api/stations");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des stations");
        }
        const data = await response.json();
        setStations(data);
      } catch (error) {
        console.error("Erreur:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors de la récupération des stations",
          variant: "destructive",
        });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.lat || !formData.lng) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une adresse valide",
        variant: "destructive",
      });
      return;
    }

    try {
      const requestData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        latitude: formData.lat,
        longitude: formData.lng,
        type: formData.type,
        services:
          formData.type === "STATION_LAVAGE"
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
                  ? parseFloat(formData.maxVehicleLength)
                  : null,
                paymentMethods: formData.paymentMethods,
              }
            : null,
        parkingDetails:
          formData.type === "PARKING"
            ? {
                isPayant: formData.isPayant,
                tarif: formData.tarif ? parseFloat(formData.tarif) : null,
                hasElectricity: formData.electricity,
                commercesProches: formData.commercesProches,
                handicapAccess: formData.handicapAccess,
              }
            : null,
      };

      const response = await fetch("/api/notify-new-station", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...requestData,
          author: {
            name: sessionData?.user?.name || null,
            email: sessionData?.user?.email || null,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la station");
      }

      toast({
        title: "Succès",
        description: "Point d'intérêt ajouté avec succès",
      });
      setIsDialogOpen(false);
      setFormData(defaultFormData);
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la création de la station:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative h-screen">
      <style>{searchBarStyles}</style>

      {/* Barre de recherche */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-96">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Ajouter un point d'intérêt</h2>
          <GeoapifyGeocoderAutocomplete
            placeSelect={(value: GeoapifyResult | null) => {
              if (value?.properties) {
                const { lat, lon, formatted, address_line1, city, postcode } =
                  value.properties;
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
        </div>
      </div>

      {/* Liste des stations */}
      <div className="absolute top-32 right-4 z-[1000] w-96">
        <div className="bg-white p-4 rounded-lg shadow-lg max-h-[calc(100vh-160px)] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Points d'intérêt</h2>
          <div className="space-y-4">
            {stations.map((station) => (
              <div
                key={station.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-all duration-200"
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
                <h3 className="font-semibold">{station.name}</h3>
                <p className="text-sm text-gray-600">{station.address}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      station.status === "active"
                        ? "bg-green-100 text-green-800"
                        : station.status === "en_attente"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    )}
                  >
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
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
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

      {/* Carte */}
      <div className="h-full">
        <MapComponent
          stations={stations}
          getMarkerIcon={getMarkerIcon}
          center={mapCenter}
          zoom={12}
        />
      </div>

      {/* Modal */}
      <AddPointModal
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        formData={formData}
        onFormDataChange={(newData: Partial<StationFormData>) => {
          setFormData((prev) => ({
            ...prev,
            ...newData,
            type: newData.type ?? prev.type,
          }));
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
