"use client";

import { useEffect, useState } from "react";

interface StationDebugProps {
  stationId: string;
}

interface WashLane {
  id?: string;
  laneNumber?: number;
  lane_number?: number;
  hasHighPressure?: boolean;
  has_high_pressure?: boolean;
  hasBusesPortique?: boolean;
  has_buses_portique?: boolean;
  hasRollerPortique?: boolean;
  has_roller_portique?: boolean;
}

interface Station {
  id: string;
  name: string;
  type?: string;
  isDelisle?: boolean;
  washLanes?: WashLane[];
  wash_lanes?: WashLane[];
  [key: string]: string | number | boolean | WashLane[] | undefined;
}

export default function StationDebug({ stationId }: StationDebugProps) {
  const [stationData, setStationData] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStationData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Déterminer quelle API utiliser
        const isJsonStation = stationId.startsWith("station_");
        const apiUrl = isJsonStation
          ? `/api/stationData/${stationId}`
          : `/api/stations/${stationId}`;

        console.log("Appel à l'API pour débogage:", apiUrl);

        // Appel à l'API
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Données brutes de la station:", data);
        setStationData(data);
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des données de la station:",
          err
        );
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchStationData();
  }, [stationId]);

  if (loading) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        Chargement des données...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 rounded-lg text-red-700">
        Erreur: {error}
      </div>
    );
  }

  if (!stationData) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">Aucune donnée disponible</div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">
        Données brutes de la station
      </h3>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Informations générales</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>ID: {stationData.id}</li>
          <li>Nom: {stationData.name}</li>
          <li>Type: {stationData.type}</li>
          <li>isDelisle: {stationData.isDelisle ? "Oui" : "Non"}</li>
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Pistes de lavage (washLanes)</h4>
        {stationData.washLanes &&
        Array.isArray(stationData.washLanes) &&
        stationData.washLanes.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {stationData.washLanes.map((lane: WashLane, index: number) => (
              <li key={index}>
                Piste {lane.laneNumber || lane.lane_number}: HP:{" "}
                {lane.hasHighPressure || lane.has_high_pressure ? "Oui" : "Non"}
                , Buses:{" "}
                {lane.hasBusesPortique || lane.has_buses_portique
                  ? "Oui"
                  : "Non"}
                , Rouleaux:{" "}
                {lane.hasRollerPortique || lane.has_roller_portique
                  ? "Oui"
                  : "Non"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            Aucune piste de lavage (washLanes) trouvée
          </p>
        )}
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Pistes de lavage (wash_lanes)</h4>
        {stationData.wash_lanes &&
        Array.isArray(stationData.wash_lanes) &&
        stationData.wash_lanes.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {stationData.wash_lanes.map((lane: WashLane, index: number) => (
              <li key={index}>
                Piste {lane.laneNumber || lane.lane_number}: HP:{" "}
                {lane.hasHighPressure || lane.has_high_pressure ? "Oui" : "Non"}
                , Buses:{" "}
                {lane.hasBusesPortique || lane.has_buses_portique
                  ? "Oui"
                  : "Non"}
                , Rouleaux:{" "}
                {lane.hasRollerPortique || lane.has_roller_portique
                  ? "Oui"
                  : "Non"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            Aucune piste de lavage (wash_lanes) trouvée
          </p>
        )}
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer font-medium">
          Afficher toutes les données JSON
        </summary>
        <pre className="mt-2 p-2 bg-gray-800 text-white rounded-md overflow-auto text-xs">
          {JSON.stringify(stationData, null, 2)}
        </pre>
      </details>
    </div>
  );
}
