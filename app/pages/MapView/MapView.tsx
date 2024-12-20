"use client";

import { useEffect, useState } from "react";
import { MapViewComponent } from "./MapViewComponent";

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

interface MapViewProps {
  stations?: Station[];
}

export default function MapView({
  stations: initialStations,
}: MapViewProps = {}) {
  const [stations, setStations] = useState<Station[]>(initialStations || []);
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
    }
  }, [initialStations]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Chargement de la carte...
      </div>
    );
  }

  return <MapViewComponent stations={stations} />;
}
