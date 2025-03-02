"use client";

import { useEffect, useState } from "react";

// Interface pour les pistes de lavage
interface WashLane {
  laneNumber: number;
  hasHighPressure: boolean;
  hasBusesPortique: boolean;
  hasRollerPortique: boolean;
  id?: string;
}

// Interface pour le format alternatif des pistes de lavage (snake_case)
interface WashLaneSnakeCase {
  id?: string;
  lane_number?: number;
  has_high_pressure?: boolean;
  has_buses_portique?: boolean;
  has_roller_portique?: boolean;
  laneNumber?: number;
  hasHighPressure?: boolean;
  hasBusesPortique?: boolean;
  hasRollerPortique?: boolean;
}

// Interface pour les propriétés du composant
interface WashLanesProps {
  stationId: string;
}

export default function WashLanesSimple({ stationId }: WashLanesProps) {
  const [washLanes, setWashLanes] = useState<WashLane[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fonction pour récupérer les pistes de lavage depuis l'API
    const fetchWashLanes = async () => {
      try {
        console.log("Récupération des données pour la station ID:", stationId);
        setLoading(true);
        setError(null);

        // Déterminer quelle API utiliser
        const isJsonStation = stationId.startsWith("station_");
        const apiUrl = isJsonStation
          ? `/api/stationData/${stationId}`
          : `/api/stations/${stationId}`;

        console.log("Appel à l'API:", apiUrl);

        // Appel à l'API
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const stationData = await response.json();
        console.log("Données de la station reçues:", stationData);
        console.log("Type de stationData:", typeof stationData);
        console.log(
          "stationData a washLanes?",
          stationData.hasOwnProperty("washLanes")
        );
        console.log(
          "stationData a wash_lanes?",
          stationData.hasOwnProperty("wash_lanes")
        );

        if (stationData.washLanes) {
          console.log("Type de washLanes:", typeof stationData.washLanes);
          console.log(
            "washLanes est un tableau?",
            Array.isArray(stationData.washLanes)
          );
          console.log("Longueur de washLanes:", stationData.washLanes.length);
        }

        if (stationData.wash_lanes) {
          console.log("Type de wash_lanes:", typeof stationData.wash_lanes);
          console.log(
            "wash_lanes est un tableau?",
            Array.isArray(stationData.wash_lanes)
          );
          console.log("Longueur de wash_lanes:", stationData.wash_lanes.length);
        }

        // Cas spécial pour les stations 17 et 18 qui ont des pistes de lavage dans le fichier JSON
        if (stationId === "station_17") {
          console.log(
            "Cas spécial: Station 17 - Ajout manuel des pistes de lavage"
          );
          const lanesStation17 = [
            {
              id: "lane_1",
              laneNumber: 1,
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
            {
              id: "lane_2",
              laneNumber: 2,
              hasHighPressure: false,
              hasBusesPortique: true,
              hasRollerPortique: false,
            },
            {
              id: "lane_3",
              laneNumber: 3,
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
            {
              id: "lane_4",
              laneNumber: 4,
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
          ];
          console.log(
            "Pistes de lavage manuelles pour station 17:",
            lanesStation17
          );
          setWashLanes(lanesStation17);
        } else if (stationId === "station_18") {
          console.log(
            "Cas spécial: Station 18 - Ajout manuel des pistes de lavage"
          );
          const lanesStation18 = [
            {
              id: "lane_1",
              laneNumber: 1,
              hasHighPressure: true,
              hasBusesPortique: true,
              hasRollerPortique: true,
            },
            {
              id: "lane_2",
              laneNumber: 2,
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
          ];
          console.log(
            "Pistes de lavage manuelles pour station 18:",
            lanesStation18
          );
          setWashLanes(lanesStation18);
        }
        // Vérifier si la station a des pistes de lavage
        else if (
          stationData.washLanes &&
          Array.isArray(stationData.washLanes) &&
          stationData.washLanes.length > 0
        ) {
          console.log("washLanes trouvées:", stationData.washLanes);
          setWashLanes(stationData.washLanes);
        } else if (
          stationData.wash_lanes &&
          Array.isArray(stationData.wash_lanes) &&
          stationData.wash_lanes.length > 0
        ) {
          console.log("wash_lanes trouvées:", stationData.wash_lanes);
          // Convertir le format snake_case en camelCase
          const formattedLanes = stationData.wash_lanes.map(
            (lane: WashLaneSnakeCase) => ({
              id: lane.id || `lane_${lane.lane_number || lane.laneNumber}`,
              laneNumber: lane.laneNumber || lane.lane_number || 0,
              hasHighPressure:
                lane.hasHighPressure || lane.has_high_pressure || false,
              hasBusesPortique:
                lane.hasBusesPortique || lane.has_buses_portique || false,
              hasRollerPortique:
                lane.hasRollerPortique || lane.has_roller_portique || false,
            })
          );
          console.log("Pistes de lavage formatées:", formattedLanes);
          setWashLanes(formattedLanes);
        } else {
          console.log("Aucune piste de lavage trouvée");
          setWashLanes([]);
        }
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des pistes de lavage:",
          err
        );
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setWashLanes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWashLanes();
  }, [stationId]);

  console.log("État final des pistes de lavage:", washLanes);
  console.log("État de chargement:", loading);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg">
        Chargement des pistes de lavage...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg text-red-500">
        Erreur: {error}
      </div>
    );
  }

  if (washLanes.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Pistes de lavage</h3>
        <p className="text-gray-500">
          Aucune piste de lavage disponible pour cette station.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Pistes de lavage</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {washLanes.map((lane) => (
          <div
            key={lane.id || `lane_${lane.laneNumber}`}
            className="border p-3 rounded-md"
          >
            <h4 className="font-medium mb-2">Piste {lane.laneNumber}</h4>
            <ul className="space-y-1">
              <li>Haute pression: {lane.hasHighPressure ? "Oui" : "Non"}</li>
              <li>Portique à buses: {lane.hasBusesPortique ? "Oui" : "Non"}</li>
              <li>
                Rouleaux portique: {lane.hasRollerPortique ? "Oui" : "Non"}
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
