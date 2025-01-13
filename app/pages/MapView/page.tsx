"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";
import { type Station } from "@prisma/client";

// Import dynamique du composant Map pour éviter les erreurs côté serveur
const MapViewComponent = dynamic(
  () => import("./MapViewComponent").then((mod) => mod.MapViewComponent),
  { ssr: false }
);

export default function MapViewPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

    if (isMounted) {
      fetchStations();
    }
  }, [isMounted]);

  if (!isMounted || loading) {
    return <LoadingScreen />;
  }

  return <MapViewComponent stations={stations} />;
}
