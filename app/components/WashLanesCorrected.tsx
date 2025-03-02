"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/lib/utils";

// Interface pour les pistes de lavage
interface WashLane {
  laneNumber?: number;
  lane_number?: number;
  hasHighPressure?: boolean;
  has_high_pressure?: boolean;
  hasBusesPortique?: boolean;
  has_buses_portique?: boolean;
  hasRollerPortique?: boolean;
  has_roller_portique?: boolean;
  id?: string;
}

// Interface pour les propriétés du composant
interface WashLanesProps {
  stationId: string;
}

export default function WashLanesCorrected({ stationId }: WashLanesProps) {
  const [washLanes, setWashLanes] = useState<WashLane[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fonction pour récupérer les pistes de lavage depuis l'API
    const fetchWashLanes = async () => {
      try {
        console.log(
          "[WashLanesCorrected] Récupération des données pour la station ID:",
          stationId
        );
        setLoading(true);
        setError(null);

        // Déterminer quelle API utiliser
        const isJsonStation = stationId.startsWith("station_");
        const apiUrl = isJsonStation
          ? `/api/stationData/${stationId}`
          : `/api/stations/${stationId}`;

        console.log("[WashLanesCorrected] Appel à l'API:", apiUrl);

        // Appel à l'API
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const stationData = await response.json();
        console.log(
          "[WashLanesCorrected] Données de la station reçues:",
          stationData
        );

        // Vérifier explicitement si washLanes ou wash_lanes existent et ont des éléments
        const hasWashLanes =
          stationData.washLanes &&
          Array.isArray(stationData.washLanes) &&
          stationData.washLanes.length > 0;

        const hasWashLanesSnakeCase =
          stationData.wash_lanes &&
          Array.isArray(stationData.wash_lanes) &&
          stationData.wash_lanes.length > 0;

        console.log("[WashLanesCorrected] hasWashLanes:", hasWashLanes);
        console.log(
          "[WashLanesCorrected] hasWashLanesSnakeCase:",
          hasWashLanesSnakeCase
        );

        if (hasWashLanes) {
          console.log(
            "[WashLanesCorrected] Utilisation des pistes définies (washLanes):",
            JSON.stringify(stationData.washLanes)
          );
          setWashLanes(stationData.washLanes);
          setLoading(false);
          return;
        }

        if (hasWashLanesSnakeCase) {
          console.log(
            "[WashLanesCorrected] Utilisation des pistes définies (wash_lanes):",
            JSON.stringify(stationData.wash_lanes)
          );

          // Convertir le format snake_case en format standard
          const formattedLanes = stationData.wash_lanes.map(
            (lane: WashLane) => ({
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

          setWashLanes(formattedLanes);
          setLoading(false);
          return;
        }

        // Cas spécial pour la station 17 (Delisle la ferté-Gaucher) si aucune piste n'est définie
        const isStation17 =
          stationId === "station_17" ||
          (stationData.id && stationData.id === "cm7qq44pi000vs5xc0a3mxzso") ||
          (stationData.name && stationData.name === "Delisle la Ferté-Gaucher");

        // Cas spécial pour la station 18 (Bollene) si aucune piste n'est définie
        const isStation18 =
          stationId === "station_18" ||
          (stationData.id && stationData.id === "cm7qq44pi000vs5xc0a3mxzs1") ||
          (stationData.name && stationData.name === "Delisle Bollene");

        // Cas spécial pour la station 19 (Lillebonne)
        const isStation19 =
          stationId === "station_19" ||
          (stationData.id && stationData.id === "cm7rg03v8000zs5x036ss07bh") ||
          (stationData.name && stationData.name === "Delisle Lillebonne");

        // Cas spécial pour la station 20 (Connantre)
        const isStation20 =
          stationId === "station_20" ||
          (stationData.name && stationData.name === "Delisle Connantre");

        // Cas spécial pour la station 21 (Courlaoux)
        const isStation21 =
          stationId === "station_21" ||
          (stationData.name && stationData.name === "Delisle Courlaoux");

        // Cas spécial pour la station 22 (Dissay)
        const isStation22 =
          stationId === "station_22" ||
          (stationData.name && stationData.name === "Delisle Dissay");

        // Cas spécial pour la station 23 (Fagnieres)
        const isStation23 =
          stationId === "station_23" ||
          (stationData.name && stationData.name === "Delisle Fagnieres");

        // Cas spécial pour la station 24 (Guer)
        const isStation24 =
          stationId === "station_24" ||
          (stationData.name && stationData.name === "Delisle Guer");

        // Cas spécial pour la station 25 (Guilberville)
        const isStation25 =
          stationId === "station_25" ||
          (stationData.name && stationData.name === "Delisle Guilberville");

        // Cas spécial pour la station 26 (Lisieux)
        const isStation26 =
          stationId === "station_26" ||
          (stationData.name && stationData.name === "Delisle Lisieux");

        // Cas spécial pour la station 27 (Rosières-aux-Salines)
        const isStation27 =
          stationId === "station_27" ||
          (stationData.name &&
            stationData.name === "Delisle Rosières-aux-Salines");

        // Cas spécial pour la station 28 (Saint-Soupplets)
        const isStation28 =
          stationId === "station_28" ||
          (stationData.name && stationData.name === "Delisle Saint-Soupplets");

        // Cas spécial pour la station 29 (Saran)
        const isStation29 =
          stationId === "station_29" ||
          (stationData.name && stationData.name === "Delisle Saran");

        // Cas spécial pour la station 30 (Tilloy-lès-Mofflaines)
        const isStation30 =
          stationId === "station_30" ||
          (stationData.name &&
            stationData.name === "Delisle Tilloy-lès-Mofflaines");

        // Cas spécial pour la station 31 (Torcy-le-Grand)
        const isStation31 =
          stationId === "station_31" ||
          (stationData.name && stationData.name === "Delisle Torcy-le-Grand");

        // Cas spécial pour la station 32 (Verdun)
        const isStation32 =
          stationId === "station_32" ||
          (stationData.name && stationData.name === "Delisle Verdun");

        if (isStation17) {
          console.log(
            "[WashLanesCorrected] Cas spécial: Station 17 (Delisle la ferté-Gaucher) - Ajout manuel des 4 pistes de lavage par défaut"
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
            "[WashLanesCorrected] Pistes de lavage manuelles pour station 17:",
            lanesStation17
          );
          setWashLanes(lanesStation17);
          setLoading(false);
          return; // Sortir de la fonction pour éviter l'appel API
        }

        // Cas spécial pour la station 18
        if (isStation18) {
          console.log(
            "[WashLanesCorrected] Cas spécial: Station 18 (Bollene) - Ajout manuel des 3 pistes de lavage"
          );
          const lanesStation18 = [
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
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
            {
              id: "lane_3",
              laneNumber: 3,
              hasHighPressure: false,
              hasBusesPortique: true,
              hasRollerPortique: false,
            },
          ];
          console.log(
            "[WashLanesCorrected] Pistes de lavage manuelles pour station 18:",
            lanesStation18
          );
          setWashLanes(lanesStation18);
          setLoading(false);
          return; // Sortir de la fonction pour éviter l'appel API
        }

        // Cas spécial pour la station 19 (Lillebonne)
        if (isStation19) {
          console.log(
            "[WashLanesCorrected] Cas spécial: Station 19 (Lillebonne) - Ajout manuel des 2 pistes de lavage"
          );
          const lanesStation19 = [
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
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
          ];
          console.log(
            "[WashLanesCorrected] Pistes de lavage manuelles pour station 19:",
            lanesStation19
          );
          setWashLanes(lanesStation19);
          setLoading(false);
          return;
        }

        // Cas spécial pour la station 20 (Connantre)
        if (isStation20) {
          console.log(
            "[WashLanesCorrected] Cas spécial: Station 20 (Connantre) - Ajout manuel des 3 pistes de lavage"
          );
          const lanesStation20 = [
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
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
            {
              id: "lane_3",
              laneNumber: 3,
              hasHighPressure: false,
              hasBusesPortique: false,
              hasRollerPortique: true,
            },
          ];
          console.log(
            "[WashLanesCorrected] Pistes de lavage manuelles pour station 20:",
            lanesStation20
          );
          setWashLanes(lanesStation20);
          setLoading(false);
          return;
        }

        // Cas spécial pour la station 21 (Courlaoux)
        if (isStation21) {
          console.log(
            "[WashLanesCorrected] Cas spécial: Station 21 (Courlaoux) - Ajout manuel des 2 pistes de lavage"
          );
          const lanesStation21 = [
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
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
          ];
          console.log(
            "[WashLanesCorrected] Pistes de lavage manuelles pour station 21:",
            lanesStation21
          );
          setWashLanes(lanesStation21);
          setLoading(false);
          return;
        }

        // Cas spécial pour la station 22 (Dissay)
        if (isStation22) {
          console.log(
            "[WashLanesCorrected] Cas spécial: Station 22 (Dissay) - Ajout manuel des 2 pistes de lavage"
          );
          const lanesStation22 = [
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
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
          ];
          console.log(
            "[WashLanesCorrected] Pistes de lavage manuelles pour station 22:",
            lanesStation22
          );
          setWashLanes(lanesStation22);
          setLoading(false);
          return;
        }

        // Cas spécial pour la station 23 (Fagnieres)
        if (isStation23) {
          console.log(
            "[WashLanesCorrected] Cas spécial: Station 23 (Fagnieres) - Ajout manuel des 6 pistes de lavage"
          );
          const lanesStation23 = [
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
              hasHighPressure: true,
              hasBusesPortique: false,
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
            {
              id: "lane_5",
              laneNumber: 5,
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
            {
              id: "lane_6",
              laneNumber: 6,
              hasHighPressure: false,
              hasBusesPortique: true,
              hasRollerPortique: false,
            },
          ];
          console.log(
            "[WashLanesCorrected] Pistes de lavage manuelles pour station 23:",
            lanesStation23
          );
          setWashLanes(lanesStation23);
          setLoading(false);
          return;
        }

        // Cas spécial pour la station 24 (Guer)
        if (isStation24) {
          console.log(
            "[WashLanesCorrected] Cas spécial: Station 24 (Guer) - Ajout manuel des 2 pistes de lavage"
          );
          const lanesStation24 = [
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
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
          ];
          console.log(
            "[WashLanesCorrected] Pistes de lavage manuelles pour station 24:",
            lanesStation24
          );
          setWashLanes(lanesStation24);
          setLoading(false);
          return;
        }

        // Cas spécial pour la station 25 (Guilberville)
        if (isStation25) {
          console.log(
            "[WashLanesCorrected] Cas spécial: Station 25 (Guilberville) - Ajout manuel des 2 pistes de lavage"
          );
          const lanesStation25 = [
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
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
          ];
          console.log(
            "[WashLanesCorrected] Pistes de lavage manuelles pour station 25:",
            lanesStation25
          );
          setWashLanes(lanesStation25);
          setLoading(false);
          return;
        }

        // Cas spécial pour la station 26 (Lisieux)
        if (isStation26) {
          console.log(
            "[WashLanesCorrected] Cas spécial: Station 26 (Lisieux) - Ajout manuel des 2 pistes de lavage"
          );
          const lanesStation26 = [
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
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
          ];
          console.log(
            "[WashLanesCorrected] Pistes de lavage manuelles pour station 26:",
            lanesStation26
          );
          setWashLanes(lanesStation26);
          setLoading(false);
          return;
        }

        // Cas spécial pour la station 27 (Rosières-aux-Salines)
        if (isStation27) {
          console.log(
            "[WashLanesCorrected] Cas spécial: Station 27 (Rosières-aux-Salines) - Ajout manuel des 3 pistes de lavage"
          );
          const lanesStation27 = [
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
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
            {
              id: "lane_3",
              laneNumber: 3,
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
          ];
          console.log(
            "[WashLanesCorrected] Pistes de lavage manuelles pour station 27:",
            lanesStation27
          );
          setWashLanes(lanesStation27);
          setLoading(false);
          return;
        }

        // Cas spécial pour la station 28 (Saint-Soupplets)
        if (isStation28) {
          console.log(
            "[WashLanesCorrected] Cas spécial: Station 28 (Saint-Soupplets) - Ajout manuel des 2 pistes de lavage"
          );
          const lanesStation28 = [
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
              hasBusesPortique: false,
              hasRollerPortique: true,
            },
          ];
          console.log(
            "[WashLanesCorrected] Pistes de lavage manuelles pour station 28:",
            lanesStation28
          );
          setWashLanes(lanesStation28);
          setLoading(false);
          return;
        }

        // Cas spécial pour la station 29 (Saran)
        if (isStation29) {
          console.log(
            "[WashLanesCorrected] Cas spécial: Station 29 (Saran) - Ajout manuel des 3 pistes de lavage"
          );
          const lanesStation29 = [
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
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
            {
              id: "lane_3",
              laneNumber: 3,
              hasHighPressure: false,
              hasBusesPortique: false,
              hasRollerPortique: true,
            },
          ];
          console.log(
            "[WashLanesCorrected] Pistes de lavage manuelles pour station 29:",
            lanesStation29
          );
          setWashLanes(lanesStation29);
          setLoading(false);
          return;
        }

        // Cas spécial pour la station 30 (Tilloy-lès-Mofflaines)
        if (isStation30) {
          console.log(
            "[WashLanesCorrected] Cas spécial: Station 30 (Tilloy-lès-Mofflaines) - Ajout manuel des 2 pistes de lavage"
          );
          const lanesStation30 = [
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
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
          ];
          console.log(
            "[WashLanesCorrected] Pistes de lavage manuelles pour station 30:",
            lanesStation30
          );
          setWashLanes(lanesStation30);
          setLoading(false);
          return;
        }

        // Cas spécial pour la station 31 (Torcy-le-Grand)
        if (isStation31) {
          console.log(
            "[WashLanesCorrected] Cas spécial: Station 31 (Torcy-le-Grand) - Ajout manuel des 2 pistes de lavage"
          );
          const lanesStation31 = [
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
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
          ];
          console.log(
            "[WashLanesCorrected] Pistes de lavage manuelles pour station 31:",
            lanesStation31
          );
          setWashLanes(lanesStation31);
          setLoading(false);
          return;
        }

        // Cas spécial pour la station 32 (Verdun)
        if (isStation32) {
          console.log(
            "[WashLanesCorrected] Cas spécial: Station 32 (Verdun) - Ajout manuel des 2 pistes de lavage"
          );
          const lanesStation32 = [
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
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
          ];
          console.log(
            "[WashLanesCorrected] Pistes de lavage manuelles pour station 32:",
            lanesStation32
          );
          setWashLanes(lanesStation32);
          setLoading(false);
          return;
        }

        // Pour les autres stations Delisle, ajouter 2 pistes par défaut
        const isOtherDelisleStation =
          (stationData.name &&
            stationData.name.toLowerCase().includes("delisle") &&
            !isStation17 &&
            !isStation18 &&
            !isStation19 &&
            !isStation20 &&
            !isStation21 &&
            !isStation22 &&
            !isStation23 &&
            !isStation24 &&
            !isStation25 &&
            !isStation26 &&
            !isStation27 &&
            !isStation28 &&
            !isStation29 &&
            !isStation30 &&
            !isStation31 &&
            !isStation32) ||
          (stationData.isDelisle === true &&
            !isStation17 &&
            !isStation18 &&
            !isStation19 &&
            !isStation20 &&
            !isStation21 &&
            !isStation22 &&
            !isStation23 &&
            !isStation24 &&
            !isStation25 &&
            !isStation26 &&
            !isStation27 &&
            !isStation28 &&
            !isStation29 &&
            !isStation30 &&
            !isStation31 &&
            !isStation32);

        if (isOtherDelisleStation) {
          console.log(
            "[WashLanesCorrected] Cas spécial: Autre station Delisle détectée - Ajout manuel de 2 pistes de lavage par défaut"
          );
          const lanesDelisleDefault = [
            {
              id: "lane_1",
              laneNumber: 1,
              hasHighPressure: true,
              hasBusesPortique: true,
              hasRollerPortique: false,
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
            "[WashLanesCorrected] Pistes de lavage par défaut pour station Delisle:",
            lanesDelisleDefault
          );
          setWashLanes(lanesDelisleDefault);
          setLoading(false);
          return; // Sortir de la fonction pour éviter l'appel API
        }

        // Aucune piste de lavage trouvée
        console.log(
          "[WashLanesCorrected] Aucune piste de lavage trouvée ou définie par défaut"
        );
        setWashLanes([]);
      } catch (err) {
        console.error(
          "[WashLanesCorrected] Erreur lors de la récupération des pistes de lavage:",
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

  console.log(
    "[WashLanesCorrected] État final des pistes de lavage:",
    washLanes
  );
  console.log("[WashLanesCorrected] État de chargement:", loading);

  if (loading) {
    return (
      <div className="py-4 bg-white rounded-lg p-6 mb-6">
        Chargement des pistes de lavage...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4 bg-white rounded-lg p-6 mb-6 text-red-500">
        Erreur: {error}
      </div>
    );
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
        {washLanes.map((lane, index) => {
          // Extraire les valeurs pour éviter les erreurs TypeScript
          const laneNumber = lane.laneNumber || lane.lane_number || index + 1;
          const hasHighPressure =
            lane.hasHighPressure || lane.has_high_pressure || false;
          const hasBusesPortique =
            lane.hasBusesPortique || lane.has_buses_portique || false;
          const hasRollerPortique =
            lane.hasRollerPortique || lane.has_roller_portique || false;

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
