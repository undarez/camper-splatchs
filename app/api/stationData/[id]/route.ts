import { NextResponse } from "next/server";
import stationsData from "@/data/stations.json";

// Définir l'interface pour les pistes de lavage
interface WashLane {
  laneNumber: number;
  hasHighPressure: boolean;
  hasBusesPortique: boolean;
  hasRollerPortique: boolean;
  id?: string; // Propriété optionnelle
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Recherche de la station JSON avec l'ID:", params.id);
    console.log(
      "Nombre total de stations dans le JSON:",
      stationsData.stations.length
    );

    // Vérifier si le fichier JSON contient des stations avec des pistes de lavage
    const stationsWithLanes = stationsData.stations.filter(
      (s) => s.washLanes && s.washLanes.length > 0
    );
    console.log(
      "Stations avec pistes de lavage:",
      stationsWithLanes.map((s) => s.id)
    );

    // Cas spécial pour la station 19 (Lillebonne)
    if (params.id === "station_19") {
      console.log("Cas spécial: Station 19 (Lillebonne) - Traitement direct");

      // Récupérer la station 19 du JSON
      const station19 = stationsData.stations.find(
        (station) => station.id === "station_19"
      );

      if (!station19) {
        return NextResponse.json(
          { error: "Station 19 non trouvée" },
          { status: 404 }
        );
      }

      // Créer une copie profonde de la station pour éviter de modifier l'original
      const stationCopy = JSON.parse(JSON.stringify(station19));

      // Forcer isDelisle à true
      stationCopy.isDelisle = true;

      // Définir manuellement les pistes de lavage
      stationCopy.washLanes = [
        {
          laneNumber: 1,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station19_1",
        },
        {
          laneNumber: 2,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station19_2",
        },
      ];

      console.log("Station 19 préparée avec pistes de lavage:", stationCopy);
      return NextResponse.json(stationCopy);
    }

    // Rechercher la station dans le fichier JSON
    const station = stationsData.stations.find(
      (station) => station.id === params.id
    );

    if (!station) {
      console.log("Station JSON non trouvée pour l'ID:", params.id);
      return NextResponse.json(
        { error: "Station non trouvée" },
        { status: 404 }
      );
    }

    console.log("Station JSON trouvée:", station.name);
    console.log("isDelisle (avant):", station.isDelisle);

    // Forcer isDelisle à true pour les stations Delisle
    if (station.name && station.name.includes("Delisle")) {
      station.isDelisle = true;
    }

    console.log("isDelisle (après):", station.isDelisle);

    // Vérifier si la station a des pistes de lavage dans le JSON
    console.log("washLanes dans le JSON:", station.washLanes);
    console.log("Type de washLanes:", typeof station.washLanes);
    console.log("washLanes est un tableau?", Array.isArray(station.washLanes));

    if (station.washLanes) {
      console.log("Nombre de pistes de lavage:", station.washLanes.length);
    }

    console.log("services:", station.services);

    // S'assurer que les pistes de lavage sont correctement formatées
    if (station.washLanes && Array.isArray(station.washLanes)) {
      console.log("Formatage des pistes de lavage existantes");
      // Ajouter des IDs si nécessaire
      station.washLanes = station.washLanes.map((lane: WashLane, index) => {
        console.log(`Piste ${index + 1}:`, lane);
        return {
          ...lane,
          id: lane.id || `lane_${station.id}_${index + 1}`,
        };
      });
    } else {
      console.log(
        "Aucune piste de lavage trouvée, initialisation d'un tableau vide"
      );
      // Initialiser un tableau vide si washLanes n'existe pas
      station.washLanes = [];
    }

    console.log("washLanes après transformation:", station.washLanes);

    return NextResponse.json(station);
  } catch (error) {
    console.error("Erreur lors de la récupération de la station JSON:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la station" },
      { status: 500 }
    );
  }
}
