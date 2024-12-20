"use client";

import { useEffect, useRef } from "react";
import type { Map } from "leaflet";
import "leaflet/dist/leaflet.css";

interface Station {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  images: string[];
  status: string;
  validatedAt: Date | null;
  validatedBy: string;
  encryptedAddress: string | null;
}

interface MapViewComponentProps {
  stations: Station[];
}

export function MapViewComponent({ stations }: MapViewComponentProps) {
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        if (!mapRef.current) {
          const mapInstance = L.map("map", {
            scrollWheelZoom: true,
            dragging: true,
            zoomControl: true,
          }).setView([46.603354, 1.888334], 6);

          mapRef.current = mapInstance;

          L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
            {
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
              subdomains: "abcd",
              maxZoom: 19,
            }
          ).addTo(mapInstance);

          fetch("/france-regions.geojson")
            .then((response) => response.json())
            .then((data) => {
              L.geoJSON(data, {
                style: {
                  color: "#2ABED9",
                  weight: 1.5,
                  opacity: 0.6,
                  fillOpacity: 0.1,
                  fillColor: "#2ABED9",
                },
              }).addTo(mapInstance);
            });
        }

        if (mapRef.current && stations) {
          stations.forEach((station) => {
            const markerInstance = L.marker(
              [station.latitude, station.longitude],
              {
                icon: L.icon({
                  iconUrl: "/images/marker-icon.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowUrl: "/images/marker-shadow.png",
                  shadowSize: [41, 41],
                }),
              }
            ).addTo(mapRef.current!);

            markerInstance.bindPopup(
              `
              <div class="p-4 min-w-[200px]">
                <h3 class="text-lg font-bold mb-2 text-blue-600">${station.name}</h3>
                <p class="text-gray-600 mb-3">${station.address}</p>
                <button
                  class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium shadow-sm"
                  onclick="window.location.href='/pages/StationDetail/${station.id}'"
                >
                  Voir les détails
                </button>
              </div>
            `,
              {
                className: "rounded-lg shadow-xl",
              }
            );
          });
        }
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [stations]);

  return <div id="map" className="w-full h-full rounded-xl shadow-inner" />;
}
