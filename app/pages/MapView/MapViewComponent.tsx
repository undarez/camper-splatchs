"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  Map,
  map as createMap,
  tileLayer,
  Marker,
  marker,
  DivIcon,
} from "leaflet";
import "leaflet/dist/leaflet.css";
import { type Station } from "@prisma/client";
import Image from "next/image";

interface MapViewComponentProps {
  stations: Station[];
  onInit?: (map: Map) => void;
  onMapReady?: (isReady: boolean) => void;
}

export function MapViewComponent({
  stations,
  onInit,
  onMapReady,
}: MapViewComponentProps) {
  const mapRef = useRef<Map | null>(null);

  const getMarkerIcon = useCallback((type: string) => {
    const color = type === "STATION_LAVAGE" ? "#40E0D0" : "#8B00FF";
    return new DivIcon({
      html: `
        <div class="marker-container">
          <img src="/images/logo.png" alt="marker" style="filter: drop-shadow(0 0 4px ${color}) drop-shadow(0 0 8px ${color});" />
        </div>
      `,
      className: "station-marker",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  }, []);

  const updateMarkers = useCallback(
    (filteredStations: Station[]) => {
      if (!mapRef.current) return;

      // Supprimer tous les marqueurs existants
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof Marker) {
          layer.remove();
        }
      });

      // Ajouter les nouveaux marqueurs filtrés
      filteredStations.forEach((station) => {
        const markerIcon = getMarkerIcon(station.type);

        marker([station.latitude, station.longitude], {
          icon: markerIcon,
        }).addTo(mapRef.current!).bindPopup(`
        <div class="p-2">
          <h3 class="font-bold">${station.name}</h3>
          <p class="text-sm text-gray-600">${
            station.type === "STATION_LAVAGE" ? "Station de lavage" : "Parking"
          }</p>
          <p class="text-sm mt-1">
            <span class="inline-block px-2 py-1 rounded-full text-xs ${
              station.status === "active"
                ? "bg-green-100 text-green-800"
                : station.status === "en_attente"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }">
              ${
                station.status === "active"
                  ? "Active"
                  : station.status === "en_attente"
                  ? "En attente"
                  : "Inactive"
              }
            </span>
          </p>
        </div>
      `);
      });
    },
    [getMarkerIcon]
  );

  useEffect(() => {
    if (!mapRef.current) {
      const map = createMap("map", {
        zoomControl: true,
        attributionControl: true,
      }).setView([46.603354, 1.888334], 6);

      tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapRef.current = map;

      // Attendre que la carte soit complètement chargée
      map.whenReady(() => {
        if (onInit) {
          onInit(map);
        }
        if (onMapReady) {
          onMapReady(true);
        }
      });
    }

    // Mettre à jour les marqueurs avec les stations filtrées
    updateMarkers(stations);
  }, [stations, onInit, updateMarkers, onMapReady]);

  return (
    <>
      <style id="map-markers-style">
        {`
        .station-marker {
          background: none !important;
        }
        .marker-container {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }
        .marker-container:hover {
          transform: scale(1.1);
        }
        .marker-container img {
          width: 35px;
          height: 35px;
          object-fit: contain;
          transition: filter 0.3s ease;
        }
        .marker-container:hover img {
          filter: brightness(1.2) !important;
        }
        .map-legend {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: rgba(30, 35, 55, 0.95);
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          z-index: 1000;
          border: 1px solid rgba(75, 85, 99, 0.5);
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 4px 0;
        }
        .legend-color {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .legend-color img {
          width: 16px;
          height: 16px;
          object-fit: contain;
        }
        `}
      </style>
      <div id="map" className="w-full h-full" />
      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-color">
            <Image
              src="/images/logo.png"
              alt="Station de lavage"
              width={16}
              height={16}
              className="object-contain"
              style={{
                filter:
                  "drop-shadow(0 0 4px #40E0D0) drop-shadow(0 0 8px #40E0D0)",
              }}
            />
          </div>
          <span className="text-sm text-white">Station de lavage</span>
        </div>
        <div className="legend-item">
          <div className="legend-color">
            <Image
              src="/images/logo.png"
              alt="Parking"
              width={16}
              height={16}
              className="object-contain"
              style={{
                filter:
                  "drop-shadow(0 0 4px #8B00FF) drop-shadow(0 0 8px #8B00FF)",
              }}
            />
          </div>
          <span className="text-sm text-white">Parking</span>
        </div>
      </div>
    </>
  );
}
