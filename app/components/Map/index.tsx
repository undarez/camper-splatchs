"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import {
  divIcon,
  marker,
  Map as LeafletMap,
  Icon,
  IconOptions,
  LatLngExpression,
} from "leaflet";
import "leaflet/dist/leaflet.css";
import { useGeolocation } from "@/app/hooks/useGeolocation";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import type {
  StationWithOptionalFields,
  StationStatus,
  StationType,
} from "@/app/types/station";

// Réexporter le type pour qu'il soit disponible
export type { StationWithOptionalFields };

// Déclaration du type global pour window.signIn
declare global {
  interface Window {
    signIn: () => void;
  }
}

export interface MapComponentProps {
  stations: StationWithOptionalFields[];
  getMarkerIcon: (
    status: StationStatus,
    type: StationType
  ) => Icon<IconOptions>;
  center: LatLngExpression;
  zoom: number;
  onMapReady?: (map: LeafletMap) => void;
  createPopupContent: (station: StationWithOptionalFields) => string;
  onGeolocation?: () => void;
  isLocating?: boolean;
}

export interface MapViewComponentProps {
  stations: StationWithOptionalFields[];
  getMarkerIcon: (station: StationWithOptionalFields) => Icon<IconOptions>;
  center?: LatLngExpression;
  zoom?: number;
  onMapReady?: (ready: boolean) => void;
  createPopupContent?: (station: StationWithOptionalFields) => string;
  onGeolocation?: () => void;
  isLocating?: boolean;
  onInit?: (map: LeafletMap) => void;
  onStationClick?: (station: StationWithOptionalFields) => void;
  selectedStation?: StationWithOptionalFields | null;
}

function MapEvents({ onMapReady }: { onMapReady?: (map: LeafletMap) => void }) {
  const map = useMap();

  useEffect(() => {
    if (map && onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
}

export function MapComponent({
  stations,
  getMarkerIcon,
  center,
  zoom,
  onMapReady,
  createPopupContent,
  onGeolocation,
  isLocating,
}: MapComponentProps): JSX.Element {
  const mapRef = useRef<LeafletMap | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const { latitude, longitude } = useGeolocation();
  const markers = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (latitude && longitude && mapRef.current) {
      const userPosition: L.LatLngExpression = [latitude, longitude];

      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }

      const userIcon = divIcon({
        className: "user-location-marker",
        html: '<div class="pulse"></div>',
        iconSize: [20, 20],
      });

      userMarkerRef.current = marker(userPosition, { icon: userIcon }).addTo(
        mapRef.current
      );

      mapRef.current.setView(userPosition, 13);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    // Nettoyer les marqueurs existants
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    stations.forEach((station) => {
      const markerIcon = getMarkerIcon(station.status, station.type);
      const newMarker = marker([station.latitude, station.longitude], {
        icon: markerIcon,
        riseOnHover: true, // L'icône s'élève au survol
      });

      // Configurer le popup
      const popupContent = createPopupContent(station);
      newMarker.bindPopup(popupContent, {
        className: "station-popup",
        maxWidth: 300,
        closeButton: true,
        closeOnClick: false, // Empêche la fermeture au clic sur la carte
        autoPan: true, // Centre la carte sur le popup
      });

      // Ajouter des événements
      newMarker.on("click", () => {
        newMarker.openPopup();
      });

      if (mapRef.current) {
        newMarker.addTo(mapRef.current);
        markers.current.push(newMarker);
      }
    });

    return () => {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
    };
  }, [stations, getMarkerIcon, createPopupContent]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.signIn = () => {
        signIn(undefined, { callbackUrl: "/localisationStation2" });
      };
    }
  }, []);

  return (
    <div className="relative h-full w-full">
      {onGeolocation && (
        <div className="absolute top-4 right-4 z-[1000]">
          <button
            onClick={onGeolocation}
            disabled={isLocating}
            className={cn(
              "px-4 py-2 bg-[#252B43] text-white rounded-lg shadow-lg",
              "hover:bg-[#2A3150] transition-colors",
              "flex items-center gap-2 border border-gray-700/50",
              isLocating && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLocating ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                Localisation...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
                Me localiser
              </>
            )}
          </button>
        </div>
      )}
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        ref={(map) => {
          if (map) {
            mapRef.current = map;
            onMapReady?.(map);
          }
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
            icon={getMarkerIcon(station.status, station.type)}
          >
            <Popup className="custom-popup">
              <div
                dangerouslySetInnerHTML={{
                  __html: createPopupContent(station),
                }}
              />
            </Popup>
          </Marker>
        ))}
        <MapEvents onMapReady={onMapReady} />
      </MapContainer>
      <style>
        {`
          .custom-popup .leaflet-popup-content-wrapper {
            background: #1E2337;
            color: white;
            border-radius: 12px;
            padding: 0;
            min-width: 320px;
            max-width: 320px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }

          .custom-popup .leaflet-popup-content {
            margin: 0;
            width: 100% !important;
          }

          .custom-popup .leaflet-popup-tip {
            background: #1E2337;
          }

          .custom-popup .leaflet-popup-close-button {
            color: #40E0D0 !important;
            padding: 8px !important;
            width: 32px !important;
            height: 32px !important;
            font-size: 24px !important;
            line-height: 24px !important;
          }

          .custom-popup .leaflet-popup-close-button:hover {
            color: #3BC7B7 !important;
            background: none !important;
          }

          .custom-popup .service-card {
            background: rgba(64, 224, 208, 0.15);
            transition: all 0.2s ease-in-out;
          }

          .custom-popup .service-card:hover {
            background: rgba(64, 224, 208, 0.25);
            transform: translateY(-1px);
          }

          .user-location-marker {
            animation: pulse 2s infinite;
          }

          @keyframes pulse {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
            }
            70% {
              transform: scale(1);
              box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
            }
            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default MapComponent;
