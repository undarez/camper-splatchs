"use client";

import { useEffect, useState } from "react";
import { MapViewComponent } from "./MapViewComponent";
import { Station } from "@prisma/client";

export default function MapView() {
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Chargement de la carte...
      </div>
    );
  }

  return <MapViewComponent stations={stations} />;
}
