"use client";

import { useState, useEffect } from "react";
import { MapViewComponent } from "./MapViewComponent";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";
import { type Station } from "@prisma/client";

export default function MapViewPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetch("/api/stations");
        const data = await response.json();
        setStations(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des stations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return <MapViewComponent stations={stations} />;
}
