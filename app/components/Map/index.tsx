"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, Map as LeafletMap, marker, divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  StationType,
  StationStatus,
  HighPressureType,
  ElectricityType,
} from "@prisma/client";
import { toast } from "sonner";

export type MapComponentProps = {
  stations: {
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
  }[];
  getMarkerIcon: (status: StationStatus, type: StationType) => string;
  center: [number, number];
  zoom: number;
  onMapReady?: (map: LeafletMap) => void;
};

// Ajout des styles pour le marqueur de géolocalisation
const userMarkerStyle = `
  .user-location-marker {
    width: 24px !important;
    height: 24px !important;
    border-radius: 50%;
    background: rgba(239, 68, 68, 0.6);
    border: 2px solid white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
    }
    70% {
      transform: scale(1.2);
      box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    }
  }
`;

// Composant pour gérer la géolocalisation
function LocationMarker() {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);

  const handleLocationFound = useCallback(
    (e: L.LocationEvent) => {
      map.flyTo(e.latlng, 13);

      if (markerRef.current) {
        markerRef.current.remove();
      }

      const newMarker = marker(e.latlng, {
        icon: divIcon({
          className: "user-location-marker",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      }).addTo(map);

      markerRef.current = newMarker;
    },
    [map]
  );

  const handleLocationError = useCallback((e: L.ErrorEvent) => {
    console.error("Erreur de géolocalisation:", e);
    toast("Erreur de localisation", {
      description: "Impossible de vous localiser. Vérifiez vos permissions.",
    });
  }, []);

  // Ajouter le style et initialiser la géolocalisation
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = userMarkerStyle;
    document.head.appendChild(styleElement);

    if (map) {
      // Ajouter les écouteurs d'événements
      map.on("locationfound", handleLocationFound);
      map.on("locationerror", handleLocationError);

      // Lancer la géolocalisation
      map.locate({ setView: true, maxZoom: 13 });
    }

    return () => {
      if (map) {
        map.off("locationfound", handleLocationFound);
        map.off("locationerror", handleLocationError);
      }
      document.head.removeChild(styleElement);
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [map, handleLocationFound, handleLocationError]);

  const getLocation = useCallback(() => {
    if (!map) return;
    map.locate({ setView: true, maxZoom: 13 });
  }, [map]);

  // Ajouter le bouton de géolocalisation
  useEffect(() => {
    const button = document.createElement("button");
    button.className =
      "leaflet-bar leaflet-control bg-white p-2 rounded-lg shadow-lg hover:bg-gray-100";
    button.innerHTML = `
      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    `;
    button.onclick = getLocation;

    const controlDiv = document.createElement("div");
    controlDiv.className = "leaflet-control-container";
    controlDiv.style.position = "absolute";
    controlDiv.style.zIndex = "1000";
    controlDiv.style.right = "10px";
    controlDiv.style.top = "10px";
    controlDiv.appendChild(button);

    map.getContainer().appendChild(controlDiv);

    return () => {
      map.getContainer().removeChild(controlDiv);
    };
  }, [map, getLocation]);

  return null;
}

function MapEvents({ onMapReady }: { onMapReady?: (map: LeafletMap) => void }) {
  const map = useMap();
  useEffect(() => {
    console.log("Carte initialisée");
    onMapReady?.(map);
  }, [map, onMapReady]);
  return null;
}

const Map: React.FC<MapComponentProps> = ({
  stations,
  getMarkerIcon,
  center,
  zoom,
  onMapReady,
}) => {
  console.log("Rendu du composant Map");

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden shadow-xl border border-gray-700/50">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        style={{ background: "#1a1f37" }}
        whenReady={() => {
          console.log("MapContainer est prêt");
          // Trouver et supprimer le message de chargement s'il existe
          const loadingMessage = document.querySelector(".loading-message");
          if (loadingMessage) {
            loadingMessage.remove();
          }
        }}
      >
        <MapEvents onMapReady={onMapReady} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        <LocationMarker />

        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
            icon={
              new Icon({
                iconUrl: getMarkerIcon(station.status, station.type),
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32],
              })
            }
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-lg mb-2">{station.name}</h3>
                <p className="text-sm text-gray-600">{station.address}</p>
                <div className="mt-2 flex gap-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      station.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : station.status === "en_attente"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {station.status === "active"
                      ? "Active"
                      : station.status === "en_attente"
                      ? "En attente"
                      : "Inactive"}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      station.type === "STATION_LAVAGE"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {station.type === "STATION_LAVAGE"
                      ? "Station de lavage"
                      : "Parking"}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
