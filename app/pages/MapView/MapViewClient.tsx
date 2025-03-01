/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { convertStationsToOptionalFields } from "@/app/components/localisationStation/LocalisationStation2";
import type { StationWithDetails } from "@/types/station";
import type { Icon as LeafletIcon } from "leaflet";

// Vérification immédiate pour éviter toute exécution côté serveur
if (typeof window === "undefined") {
  throw new Error("Ce composant ne peut être rendu que côté client");
}

// Définition des types pour les icônes
interface MarkerIcon {
  iconUrl: string;
  iconSize: [number, number];
  iconAnchor: [number, number];
  popupAnchor: [number, number];
}

// Import dynamique du composant Map pour éviter les erreurs côté serveur
const MapViewComponent = dynamic(
  () => import("./MapViewComponent").then((mod) => mod.MapViewComponent),
  { ssr: false }
);

export default function MapViewClient() {
  const [stations, setStations] = useState<StationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [icons, setIcons] = useState<{
    borneIcon: LeafletIcon;
    stationIcon: LeafletIcon;
  } | null>(null);

  useEffect(() => {
    // S'assurer que ce code ne s'exécute que côté client
    setIsMounted(true);

    // Importer Leaflet uniquement côté client
    import("leaflet").then(({ Icon }) => {
      setIcons({
        borneIcon: new Icon({
          iconUrl: "/markers/borne-marker.png",
          iconSize: [35, 35],
          iconAnchor: [17, 35],
          popupAnchor: [1, -34],
        }),
        stationIcon: new Icon({
          iconUrl: "/markers/station-marker.png",
          iconSize: [35, 35],
          iconAnchor: [17, 35],
          popupAnchor: [1, -34],
        }),
      });
    });
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    fetch("/api/stations")
      .then((res) => res.json())
      .then((data) => {
        const convertedStations = convertStationsToOptionalFields(data).map(
          (station) => ({
            ...station,
            services: station.services || null,
            parkingDetails: station.parkingDetails
              ? {
                  ...station.parkingDetails,
                  tarif: station.parkingDetails.tarif?.toString() || null,
                }
              : null,
            reviews:
              station.reviews?.map((review) => ({
                ...review,
                content: review.comment || "",
                encryptedContent: "",
                userId: review.authorId,
              })) || [],
            averageRating: station.reviews
              ? station.reviews.reduce(
                  (acc, review) => acc + review.rating,
                  0
                ) / station.reviews.length
              : 0,
            isDelisle: (station as { isDelisle?: boolean }).isDelisle ?? false,
          })
        ) as StationWithDetails[];
        setStations(convertedStations);
        setIsLoading(false);
      });
  }, [isMounted]);

  if (!isMounted || isLoading || !icons) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#1E2337]">
        <div className="text-white text-xl">Chargement des données...</div>
      </div>
    );
  }

  return (
    <MapViewComponent
      stations={stations.map((station) => ({
        ...station,
        isDelisle: (station as { isDelisle?: boolean }).isDelisle ?? false,
      }))}
      getMarkerIcon={async (station) => {
        // Utiliser un import dynamique au lieu de require
        if (typeof window === "undefined") return null;

        // Cette fonction ne sera appelée que côté client
        const createIcon = async (iconOptions: MarkerIcon) => {
          try {
            const { Icon } = await import("leaflet");
            return new Icon(iconOptions);
          } catch (error) {
            console.error("Erreur lors du chargement de Leaflet:", error);
            return null;
          }
        };

        try {
          if (station.type === "STATION_LAVAGE") {
            if (station.isDelisle) {
              return await createIcon({
                iconUrl: "/images/delisle/logo-delisle.png",
                iconSize: [35, 35],
                iconAnchor: [17, 35],
                popupAnchor: [1, -34],
              });
            } else {
              return await createIcon({
                iconUrl: "/images/article-lavatrans/lavatrans-logo.png",
                iconSize: [30, 30],
                iconAnchor: [15, 30],
                popupAnchor: [1, -30],
              });
            }
          }

          return icons.stationIcon;
        } catch (error) {
          console.error("Erreur lors de la création de l'icône:", error);
          return null;
        }
      }}
      onStationClick={(station) => console.log("Station clicked:", station)}
      selectedStation={null}
    />
  );
}
