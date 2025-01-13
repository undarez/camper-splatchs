"use client";

import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CamperWashStation, GeoapifyResult } from "@/app/types";
import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from "@geoapify/react-geocoder-autocomplete";
import { icon } from "leaflet";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Configuration des icônes Leaflet selon le statut
const createIcon = (status: string) => {
  const iconUrl =
    status === "active"
      ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png"
      : status === "en_attente"
      ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png"
      : status === "inactive"
      ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png"
      : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png";

  return icon({
    iconUrl,
    shadowUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

interface AddressProps {
  onAddressSelect: (location: Partial<CamperWashStation>) => void;
  existingLocations?: CamperWashStation[];
  isModalOpen?: boolean;
  persistSearchBar?: boolean;
}

export default function AdressGeoapify({
  onAddressSelect,
  existingLocations = [],
  isModalOpen = false,
  persistSearchBar = false,
}: AddressProps) {
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [searchBarVisible, setSearchBarVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const defaultCenter: [number, number] = [46.603354, 1.888334]; // Centre de la France

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!persistSearchBar) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setSearchBarVisible(false);
      }
    };

    const handleMapClick = () => {
      if (!isModalOpen) {
        setSearchBarVisible(true);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("mousemove", handleMapClick);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("mousemove", handleMapClick);
    };
  }, [persistSearchBar, isModalOpen]);

  // Masquer la barre de recherche quand la modale est ouverte
  useEffect(() => {
    if (isModalOpen) {
      setSearchBarVisible(false);
    }
  }, [isModalOpen]);

  const handlePlaceSelect = (value: GeoapifyResult | null) => {
    if (!value) return;

    const { lat, lon, formatted, address_line1, city, postcode } =
      value.properties;

    const newLocation: Partial<CamperWashStation> = {
      latitude: lat,
      longitude: lon,
      address: address_line1 || formatted,
      city: city || null,
      postalCode: postcode || null,
    };

    onAddressSelect(newLocation);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-500 inline-block" />;
      case "en_attente":
        return <Clock className="h-4 w-4 text-yellow-500 inline-block" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500 inline-block" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Validée";
      case "en_attente":
        return "En attente";
      default:
        return "Non validée";
    }
  };

  const formatServices = (services: CamperWashStation["services"]) => {
    const servicesList = [];
    if (!services) return [];

    if (services.highPressure && services.highPressure !== "NONE") {
      servicesList.push(
        `Haute pression: ${services.highPressure.toLowerCase()}`
      );
    }
    if (services.tirePressure) servicesList.push("Pression des pneus");
    if (services.vacuum) servicesList.push("Aspirateur");
    if (services.waterPoint) servicesList.push("Point d'eau");
    if (services.wasteWaterDisposal) servicesList.push("Vidange eaux usées");
    if (services.blackWaterDisposal) servicesList.push("Vidange eaux noires");
    if (services.electricity && services.electricity !== "NONE") {
      servicesList.push(
        `Électricité: ${services.electricity.replace("AMP_", "")} ampères`
      );
    }

    return servicesList;
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-4">
      {!isModalOpen && persistSearchBar && (
        <div
          ref={searchBarRef}
          className="geoapify-geocoder-container"
          style={{
            display: searchBarVisible && !isModalOpen ? "block" : "none",
          }}
        >
          <GeoapifyContext apiKey={process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}>
            <GeoapifyGeocoderAutocomplete
              placeholder="Rechercher une adresse..."
              lang="fr"
              limit={5}
              debounceDelay={300}
              countryCodes={["fr"]}
              placeSelect={(value) => {
                if (value) {
                  handlePlaceSelect(value as GeoapifyResult);
                }
              }}
            />
          </GeoapifyContext>
        </div>
      )}

      {!isModalOpen && (
        <div className="h-[calc(100vh-250px)] w-full relative">
          <MapContainer
            center={defaultCenter}
            zoom={6}
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {existingLocations.map((location) => {
              // Vérifier que les coordonnées sont valides
              if (
                typeof location.latitude !== "number" ||
                typeof location.longitude !== "number"
              ) {
                console.warn(
                  "Coordonnées invalides pour la localisation:",
                  location
                );
                return null;
              }
              return (
                <Marker
                  key={location.id}
                  position={[location.latitude, location.longitude]}
                  icon={createIcon(location.status)}
                >
                  <Popup className="station-popup">
                    <div className="p-2 max-w-xs">
                      <h3 className="font-semibold text-base">
                        {location.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {location.address}
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-500">
                          Coordonnées: {location.latitude.toFixed(6)},{" "}
                          {location.longitude.toFixed(6)}
                        </p>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(location.status)}
                          <span className="text-sm">
                            {getStatusText(location.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                  <Tooltip
                    direction="top"
                    offset={[0, -20]}
                    className="station-tooltip"
                  >
                    <div className="bg-white p-2 rounded-lg shadow-lg max-w-xs">
                      <div className="flex items-center gap-2 mb-2">
                        <strong className="text-sm">{location.name}</strong>
                        {getStatusIcon(location.status)}
                      </div>
                      <div className="space-y-1">
                        {formatServices(location.services).map(
                          (service, index) => (
                            <div key={index} className="text-xs">
                              • {service}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </Tooltip>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
