"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { convertStationsToOptionalFields } from "@/app/components/localisationStation/LocalisationStation2";
import type { StationWithDetails } from "@/types/station";
import { Icon, type Icon as LeafletIcon } from "leaflet";

// Import dynamique du composant Map pour éviter les erreurs côté serveur
const MapViewComponent = dynamic(
  () => import("./MapViewComponent").then((mod) => mod.MapViewComponent),
  { ssr: false }
);

export default function MapViewPage() {
  const [stations, setStations] = useState<StationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [icons, setIcons] = useState<{
    borneIcon: LeafletIcon;
    stationIcon: LeafletIcon;
  } | null>(null);

  useEffect(() => {
    setIsMounted(true);
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
    return <div>Chargement...</div>;
  }

  return (
    <MapViewComponent
      stations={stations.map((station) => ({
        ...station,
        isDelisle: (station as { isDelisle?: boolean }).isDelisle ?? false,
      }))}
      getMarkerIcon={(station) =>
        station.type === "STATION_LAVAGE"
          ? station.isDelisle
            ? new Icon({
                iconUrl: "/images/delisle/logo-delisle.png",
                iconSize: [35, 35],
                iconAnchor: [17, 35],
                popupAnchor: [1, -34],
              })
            : new Icon({
                iconUrl: "/images/article-lavatrans/lavatrans-logo.png",
                iconSize: [30, 30],
                iconAnchor: [15, 30],
                popupAnchor: [1, -30],
              })
          : icons.stationIcon
      }
      onStationClick={(station) => console.log("Station clicked:", station)}
      selectedStation={null}
    />
  );
}
