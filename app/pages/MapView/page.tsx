"use client";

import { useEffect, useRef, useState } from "react";
import { map, tileLayer, geoJSON, marker, icon, Map } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Station } from "@prisma/client";
// import { useRouter } from "next/navigation";

export default function MapView() {
  const mapRef = useRef<Map | null>(null);
  // const router = useRouter();
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Charger les stations
    fetch("/api/stations")
      .then((res) => res.json())
      .then((data) => {
        setStations(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des stations:", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      const mapInstance = map("map", {
        scrollWheelZoom: true,
        dragging: true,
        zoomControl: true,
      }).setView([46.603354, 1.888334], 6);

      mapRef.current = mapInstance;

      tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(mapInstance);

      // Charger les régions françaises
      fetch("/france-regions.geojson")
        .then((response) => response.json())
        .then((data) => {
          geoJSON(data, {
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

    // Ajouter les marqueurs si les stations sont chargées
    if (!isLoading && mapRef.current) {
      stations.forEach((station) => {
        const markerInstance = marker([station.latitude, station.longitude], {
          icon: icon({
            iconUrl: "/images/marker-icon.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: "/images/marker-shadow.png",
            shadowSize: [41, 41],
          }),
        }).addTo(mapRef.current!);

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

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [stations, isLoading]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Chargement de la carte...
      </div>
    );
  }

  return <div id="map" className="w-full h-full rounded-xl shadow-inner" />;
}
