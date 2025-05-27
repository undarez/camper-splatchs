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

// Fonction requise pour l'export statique avec des routes dynamiques
export async function generateStaticParams() {
  // Retourner une liste vide car les API routes ne peuvent pas être pré-générées
  return [];
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

    // Cas spécial pour la station 17 (La Ferté-Gaucher)
    if (params.id === "station_17") {
      console.log(
        "Cas spécial: Station 17 (La Ferté-Gaucher) - Traitement direct"
      );
      const station17 = stationsData.stations.find(
        (station) => station.id === "station_17"
      );
      if (!station17) {
        return NextResponse.json(
          { error: "Station 17 non trouvée" },
          { status: 404 }
        );
      }
      const stationCopy = JSON.parse(JSON.stringify(station17));
      stationCopy.isDelisle = true;
      stationCopy.washLanes = [
        {
          laneNumber: 1,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station17_1",
        },
        {
          laneNumber: 2,
          hasHighPressure: false,
          hasBusesPortique: true,
          hasRollerPortique: false,
          id: "lane_station17_2",
        },
        {
          laneNumber: 3,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station17_3",
        },
        {
          laneNumber: 4,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station17_4",
        },
      ];
      console.log("Station 17 préparée avec pistes de lavage:", stationCopy);
      return NextResponse.json(stationCopy);
    }

    // Cas spécial pour la station 18 (Bollene)
    if (params.id === "station_18") {
      console.log("Cas spécial: Station 18 (Bollene) - Traitement direct");
      const station18 = stationsData.stations.find(
        (station) => station.id === "station_18"
      );
      if (!station18) {
        return NextResponse.json(
          { error: "Station 18 non trouvée" },
          { status: 404 }
        );
      }
      const stationCopy = JSON.parse(JSON.stringify(station18));
      stationCopy.isDelisle = true;
      stationCopy.washLanes = [
        {
          laneNumber: 1,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station18_1",
        },
        {
          laneNumber: 2,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station18_2",
        },
        {
          laneNumber: 3,
          hasHighPressure: false,
          hasBusesPortique: true,
          hasRollerPortique: false,
          id: "lane_station18_3",
        },
      ];
      console.log("Station 18 préparée avec pistes de lavage:", stationCopy);
      return NextResponse.json(stationCopy);
    }

    // Cas spécial pour la station 19 (Lillebonne)
    if (params.id === "station_19") {
      console.log("Cas spécial: Station 19 (Lillebonne) - Traitement direct");
      const station19 = stationsData.stations.find(
        (station) => station.id === "station_19"
      );
      if (!station19) {
        return NextResponse.json(
          { error: "Station 19 non trouvée" },
          { status: 404 }
        );
      }
      const stationCopy = JSON.parse(JSON.stringify(station19));
      stationCopy.isDelisle = true;
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

    // Cas spécial pour la station 20 (Connantre)
    if (params.id === "station_20") {
      console.log("Cas spécial: Station 20 (Connantre) - Traitement direct");
      const station20 = stationsData.stations.find(
        (station) => station.id === "station_20"
      );
      if (!station20) {
        return NextResponse.json(
          { error: "Station 20 non trouvée" },
          { status: 404 }
        );
      }
      const stationCopy = JSON.parse(JSON.stringify(station20));
      stationCopy.isDelisle = true;
      stationCopy.washLanes = [
        {
          laneNumber: 1,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station20_1",
        },
        {
          laneNumber: 2,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station20_2",
        },
        {
          laneNumber: 3,
          hasHighPressure: false,
          hasBusesPortique: false,
          hasRollerPortique: true,
          id: "lane_station20_3",
        },
      ];
      console.log("Station 20 préparée avec pistes de lavage:", stationCopy);
      return NextResponse.json(stationCopy);
    }

    // Cas spécial pour la station 21 (Courlaoux)
    if (params.id === "station_21") {
      console.log("Cas spécial: Station 21 (Courlaoux) - Traitement direct");
      const station21 = stationsData.stations.find(
        (station) => station.id === "station_21"
      );
      if (!station21) {
        return NextResponse.json(
          { error: "Station 21 non trouvée" },
          { status: 404 }
        );
      }
      const stationCopy = JSON.parse(JSON.stringify(station21));
      stationCopy.isDelisle = true;
      stationCopy.washLanes = [
        {
          laneNumber: 1,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station21_1",
        },
        {
          laneNumber: 2,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station21_2",
        },
      ];
      console.log("Station 21 préparée avec pistes de lavage:", stationCopy);
      return NextResponse.json(stationCopy);
    }

    // Cas spécial pour la station 22 (Dissay)
    if (params.id === "station_22") {
      console.log("Cas spécial: Station 22 (Dissay) - Traitement direct");
      const station22 = stationsData.stations.find(
        (station) => station.id === "station_22"
      );
      if (!station22) {
        return NextResponse.json(
          { error: "Station 22 non trouvée" },
          { status: 404 }
        );
      }
      const stationCopy = JSON.parse(JSON.stringify(station22));
      stationCopy.isDelisle = true;
      stationCopy.washLanes = [
        {
          laneNumber: 1,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station22_1",
        },
        {
          laneNumber: 2,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station22_2",
        },
      ];
      console.log("Station 22 préparée avec pistes de lavage:", stationCopy);
      return NextResponse.json(stationCopy);
    }

    // Cas spécial pour la station 23 (Fagnieres)
    if (params.id === "station_23") {
      console.log("Cas spécial: Station 23 (Fagnieres) - Traitement direct");
      const station23 = stationsData.stations.find(
        (station) => station.id === "station_23"
      );
      if (!station23) {
        return NextResponse.json(
          { error: "Station 23 non trouvée" },
          { status: 404 }
        );
      }
      const stationCopy = JSON.parse(JSON.stringify(station23));
      stationCopy.isDelisle = true;
      stationCopy.washLanes = [
        {
          laneNumber: 1,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station23_1",
        },
        {
          laneNumber: 2,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station23_2",
        },
        {
          laneNumber: 3,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station23_3",
        },
        {
          laneNumber: 4,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station23_4",
        },
        {
          laneNumber: 5,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station23_5",
        },
        {
          laneNumber: 6,
          hasHighPressure: false,
          hasBusesPortique: true,
          hasRollerPortique: false,
          id: "lane_station23_6",
        },
      ];
      console.log("Station 23 préparée avec pistes de lavage:", stationCopy);
      return NextResponse.json(stationCopy);
    }

    // Cas spécial pour la station 24 (Guer)
    if (params.id === "station_24") {
      console.log("Cas spécial: Station 24 (Guer) - Traitement direct");
      const station24 = stationsData.stations.find(
        (station) => station.id === "station_24"
      );
      if (!station24) {
        return NextResponse.json(
          { error: "Station 24 non trouvée" },
          { status: 404 }
        );
      }
      const stationCopy = JSON.parse(JSON.stringify(station24));
      stationCopy.isDelisle = true;
      stationCopy.washLanes = [
        {
          laneNumber: 1,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station24_1",
        },
        {
          laneNumber: 2,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station24_2",
        },
      ];
      console.log("Station 24 préparée avec pistes de lavage:", stationCopy);
      return NextResponse.json(stationCopy);
    }

    // Cas spécial pour la station 25 (Guilberville)
    if (params.id === "station_25") {
      console.log("Cas spécial: Station 25 (Guilberville) - Traitement direct");
      const station25 = stationsData.stations.find(
        (station) => station.id === "station_25"
      );
      if (!station25) {
        return NextResponse.json(
          { error: "Station 25 non trouvée" },
          { status: 404 }
        );
      }
      const stationCopy = JSON.parse(JSON.stringify(station25));
      stationCopy.isDelisle = true;
      stationCopy.washLanes = [
        {
          laneNumber: 1,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station25_1",
        },
        {
          laneNumber: 2,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station25_2",
        },
      ];
      console.log("Station 25 préparée avec pistes de lavage:", stationCopy);
      return NextResponse.json(stationCopy);
    }

    // Cas spécial pour la station 26 (Lisieux)
    if (params.id === "station_26") {
      console.log("Cas spécial: Station 26 (Lisieux) - Traitement direct");
      const station26 = stationsData.stations.find(
        (station) => station.id === "station_26"
      );
      if (!station26) {
        return NextResponse.json(
          { error: "Station 26 non trouvée" },
          { status: 404 }
        );
      }
      const stationCopy = JSON.parse(JSON.stringify(station26));
      stationCopy.isDelisle = true;
      stationCopy.washLanes = [
        {
          laneNumber: 1,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station26_1",
        },
        {
          laneNumber: 2,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station26_2",
        },
      ];
      console.log("Station 26 préparée avec pistes de lavage:", stationCopy);
      return NextResponse.json(stationCopy);
    }

    // Cas spécial pour la station 27 (Rosières-aux-Salines)
    if (params.id === "station_27") {
      console.log(
        "Cas spécial: Station 27 (Rosières-aux-Salines) - Traitement direct"
      );
      const station27 = stationsData.stations.find(
        (station) => station.id === "station_27"
      );
      if (!station27) {
        return NextResponse.json(
          { error: "Station 27 non trouvée" },
          { status: 404 }
        );
      }
      const stationCopy = JSON.parse(JSON.stringify(station27));
      stationCopy.isDelisle = true;
      stationCopy.washLanes = [
        {
          laneNumber: 1,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station27_1",
        },
        {
          laneNumber: 2,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station27_2",
        },
        {
          laneNumber: 3,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station27_3",
        },
      ];
      console.log("Station 27 préparée avec pistes de lavage:", stationCopy);
      return NextResponse.json(stationCopy);
    }

    // Cas spécial pour la station 28 (Saint-Soupplets)
    if (params.id === "station_28") {
      console.log(
        "Cas spécial: Station 28 (Saint-Soupplets) - Traitement direct"
      );
      const station28 = stationsData.stations.find(
        (station) => station.id === "station_28"
      );
      if (!station28) {
        return NextResponse.json(
          { error: "Station 28 non trouvée" },
          { status: 404 }
        );
      }
      const stationCopy = JSON.parse(JSON.stringify(station28));
      stationCopy.isDelisle = true;
      stationCopy.washLanes = [
        {
          laneNumber: 1,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station28_1",
        },
        {
          laneNumber: 2,
          hasHighPressure: false,
          hasBusesPortique: false,
          hasRollerPortique: true,
          id: "lane_station28_2",
        },
      ];
      console.log("Station 28 préparée avec pistes de lavage:", stationCopy);
      return NextResponse.json(stationCopy);
    }

    // Cas spécial pour la station 29 (Saran)
    if (params.id === "station_29") {
      console.log("Cas spécial: Station 29 (Saran) - Traitement direct");
      const station29 = stationsData.stations.find(
        (station) => station.id === "station_29"
      );
      if (!station29) {
        return NextResponse.json(
          { error: "Station 29 non trouvée" },
          { status: 404 }
        );
      }
      const stationCopy = JSON.parse(JSON.stringify(station29));
      stationCopy.isDelisle = true;
      stationCopy.washLanes = [
        {
          laneNumber: 1,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station29_1",
        },
        {
          laneNumber: 2,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station29_2",
        },
        {
          laneNumber: 3,
          hasHighPressure: false,
          hasBusesPortique: false,
          hasRollerPortique: true,
          id: "lane_station29_3",
        },
      ];
      console.log("Station 29 préparée avec pistes de lavage:", stationCopy);
      return NextResponse.json(stationCopy);
    }

    // Cas spécial pour la station 30 (Tilloy-lès-Mofflaines)
    if (params.id === "station_30") {
      console.log(
        "Cas spécial: Station 30 (Tilloy-lès-Mofflaines) - Traitement direct"
      );
      const station30 = stationsData.stations.find(
        (station) => station.id === "station_30"
      );
      if (!station30) {
        return NextResponse.json(
          { error: "Station 30 non trouvée" },
          { status: 404 }
        );
      }
      const stationCopy = JSON.parse(JSON.stringify(station30));
      stationCopy.isDelisle = true;
      stationCopy.washLanes = [
        {
          laneNumber: 1,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station30_1",
        },
        {
          laneNumber: 2,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station30_2",
        },
      ];
      console.log("Station 30 préparée avec pistes de lavage:", stationCopy);
      return NextResponse.json(stationCopy);
    }

    // Cas spécial pour la station 31 (Torcy-le-Grand)
    if (params.id === "station_31") {
      console.log(
        "Cas spécial: Station 31 (Torcy-le-Grand) - Traitement direct"
      );
      const station31 = stationsData.stations.find(
        (station) => station.id === "station_31"
      );
      if (!station31) {
        return NextResponse.json(
          { error: "Station 31 non trouvée" },
          { status: 404 }
        );
      }
      const stationCopy = JSON.parse(JSON.stringify(station31));
      stationCopy.isDelisle = true;
      stationCopy.washLanes = [
        {
          laneNumber: 1,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station31_1",
        },
        {
          laneNumber: 2,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station31_2",
        },
      ];
      console.log("Station 31 préparée avec pistes de lavage:", stationCopy);
      return NextResponse.json(stationCopy);
    }

    // Cas spécial pour la station 32 (Verdun)
    if (params.id === "station_32") {
      console.log("Cas spécial: Station 32 (Verdun) - Traitement direct");
      const station32 = stationsData.stations.find(
        (station) => station.id === "station_32"
      );
      if (!station32) {
        return NextResponse.json(
          { error: "Station 32 non trouvée" },
          { status: 404 }
        );
      }
      const stationCopy = JSON.parse(JSON.stringify(station32));
      stationCopy.isDelisle = true;
      stationCopy.washLanes = [
        {
          laneNumber: 1,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station32_1",
        },
        {
          laneNumber: 2,
          hasHighPressure: true,
          hasBusesPortique: false,
          hasRollerPortique: false,
          id: "lane_station32_2",
        },
      ];
      console.log("Station 32 préparée avec pistes de lavage:", stationCopy);
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
