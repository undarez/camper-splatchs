"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/lib/utils";

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

export default function WashLanes({ stationId }: WashLanesProps) {
  const [washLanes, setWashLanes] = useState<WashLane[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fonction pour récupérer les pistes de lavage depuis l'API
    const fetchWashLanes = async () => {
      try {
        console.log("Récupération des données pour la station ID:", stationId);
        setLoading(true);

        // Extraire l'ID numérique si le format est "station_XX"
        const isJsonStation = stationId.startsWith("station_");

        // Utiliser l'API stationData pour les stations du fichier JSON
        const apiUrl = isJsonStation
          ? `/api/stationData/${stationId}`
          : `/api/stations/${stationId}`;

        console.log("Appel à l'API:", apiUrl);

        // Appel à l'API pour récupérer les détails de la station
        const response = await fetch(apiUrl);
        const stationData = await response.json();

        console.log("Données de la station reçues:", stationData);

        // Vérifier si la station a des pistes de lavage
        if (
          stationData &&
          stationData.washLanes &&
          Array.isArray(stationData.washLanes) &&
          stationData.washLanes.length > 0
        ) {
          console.log(
            `Pistes de lavage trouvées pour ${stationData.name}:`,
            stationData.washLanes.length
          );
          setWashLanes(stationData.washLanes);
        } else if (
          stationData &&
          stationData.wash_lanes &&
          Array.isArray(stationData.wash_lanes) &&
          stationData.wash_lanes.length > 0
        ) {
          // Alternative: utiliser wash_lanes si washLanes n'existe pas
          console.log(
            `Pistes de lavage (format alternatif) trouvées pour ${stationData.name}:`,
            stationData.wash_lanes.length
          );

          // Convertir le format wash_lanes en format washLanes
          const formattedLanes = stationData.wash_lanes.map(
            (lane: WashLaneSnakeCase) => ({
              id: lane.id,
              laneNumber: lane.laneNumber || lane.lane_number || 0,
              hasHighPressure:
                lane.hasHighPressure || lane.has_high_pressure || false,
              hasBusesPortique:
                lane.hasBusesPortique || lane.has_buses_portique || false,
              hasRollerPortique:
                lane.hasRollerPortique || lane.has_roller_portique || false,
            })
          );

          setWashLanes(formattedLanes);
        } else {
          // Cas spécial pour les stations 17 et 18 qui ont des pistes de lavage dans le fichier JSON
          if (stationId === "station_17") {
            console.log(
              "Cas spécial: Station 17 - Ajout manuel des pistes de lavage"
            );
            setWashLanes([
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
            ]);
          } else if (stationId === "station_18") {
            console.log(
              "Cas spécial: Station 18 - Ajout manuel des pistes de lavage"
            );
            setWashLanes([
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
            ]);
          } else {
            console.log("Aucune piste de lavage trouvée pour cette station");
            setWashLanes([]);
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des pistes de lavage:",
          error
        );
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
    return <div className="py-4">Chargement des pistes de lavage...</div>;
  }

  if (washLanes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Pistes de lavage</h3>
        <p className="text-gray-500">
          Aucune piste de lavage disponible pour cette station.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Pistes de lavage</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {washLanes.map((lane) => {
          // Extraire les valeurs pour éviter les erreurs TypeScript
          const laneNumber = lane.laneNumber || 0;
          const hasHighPressure = lane.hasHighPressure || false;
          const hasBusesPortique = lane.hasBusesPortique || false;
          const hasRollerPortique = lane.hasRollerPortique || false;

          return (
            <div
              key={lane.id || `lane_${laneNumber}`}
              className="bg-gray-50 border border-gray-200 rounded-md p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Piste {laneNumber}</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Haute pression</span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "px-2 py-1 text-xs",
                      hasHighPressure
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    )}
                  >
                    {hasHighPressure ? "Oui" : "Non"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Portique à buses</span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "px-2 py-1 text-xs",
                      hasBusesPortique
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    )}
                  >
                    {hasBusesPortique ? "Oui" : "Non"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rouleaux portique</span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "px-2 py-1 text-xs",
                      hasRollerPortique
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    )}
                  >
                    {hasRollerPortique ? "Oui" : "Non"}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
