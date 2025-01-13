"use client";

import { useEffect, useState } from "react";
import { MapViewComponent } from "./MapViewComponent";
import { Map } from "leaflet";
import { type Station as PrismaStation } from "@prisma/client";

type Station = PrismaStation & {
  city: string | null;
  postalCode: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string | null;
};

interface MapViewProps {
  stations: Station[];
  onInit?: (map: Map) => void;
}

export default function MapView({
  stations: initialStations,
  onInit,
}: MapViewProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(!initialStations);

  useEffect(() => {
    if (!initialStations) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stations`)
        .then((res) => res.json())
        .then((data) => {
          setStations(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Erreur lors du chargement des stations:", error);
          setIsLoading(false);
        });
    } else {
      setStations(initialStations);
    }
  }, [initialStations]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Chargement de la carte...
      </div>
    );
  }

  return <MapViewComponent stations={stations} onInit={onInit} />;
}
