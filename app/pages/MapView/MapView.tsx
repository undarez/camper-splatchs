"use client";

import { useEffect, useState } from "react";
import { MapViewComponent } from "./MapViewComponent";
import { Map, Icon } from "leaflet";
import {
  ElectricityType,
  HighPressureType,
  type Station as PrismaStation,
  StationType,
} from "@prisma/client";
import { convertStationsToOptionalFields } from "@/app/components/localisationStation/LocalisationStation2";
import type { StationWithDetails } from "@/types/station";

type Station = Omit<PrismaStation, "iconType" | "userId"> & {
  iconType: "PASSERELLE" | "ECHAFAUDAGE" | "PORTIQUE" | null;
  city: string | null;
  postalCode: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isDelisle?: boolean;
  services: {
    id: string;
    highPressure: HighPressureType;
    tirePressure: boolean;
    vacuum: boolean;
    handicapAccess: boolean;
    wasteWater: boolean;
    waterPoint: boolean;
    wasteWaterDisposal: boolean;
    blackWaterDisposal: boolean;
    electricity: ElectricityType;
    maxVehicleLength: number | null;
    maxVehicleHeight: number | null;
    maxVehicleWidth: number | null;
    paymentMethods: string[];
  } | null;
  parkingDetails: {
    id: string;
    isPayant: boolean;
    tarif: number | null;
    taxeSejour: number | null;
    hasElectricity: ElectricityType;
    commercesProches: string[];
    handicapAccess: boolean;
    totalPlaces: number;
    hasWifi: boolean;
    hasChargingPoint: boolean;
    waterPoint: boolean;
    wasteWater: boolean;
    wasteWaterDisposal: boolean;
    blackWaterDisposal: boolean;
    hasCctv: boolean;
    hasBarrier: boolean;
    maxDuration: string | null;
    maxVehicleHeight: number | null;
    maxVehicleLength: number | null;
    maxVehicleWidth: number | null;
    createdAt: Date;
  } | null;
  reviews: { rating: number }[];
};

interface MapViewProps {
  stations: Station[];
  onInit?: (map: Map) => void;
}

export default function MapView({
  stations: initialStations,
  onInit,
}: MapViewProps) {
  const [stations, setStations] = useState<Station[]>([]);
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
    } else {
      setStations(initialStations);
    }
  }, [initialStations]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Chargement de la carte...
      </div>
    );
  }

  if (!stations) {
    return null;
  }

  const borneIcon = new Icon({
    iconUrl: "/images/article-lavatrans/lavatrans-logo.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [1, -34],
    className: "station-marker station-lavage",
  });

  const stationIcon = new Icon({
    iconUrl: "/markers/station-marker.png",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [1, -34],
    className: "station-marker",
  });

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .station-marker {
          filter: drop-shadow(0 0 6px var(--glow-color, #40e0d0));
          transition: all 0.3s ease;
          background-color: rgba(30, 35, 55, 0.7);
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 15px rgba(64, 224, 208, 0.6);
        }
        .station-marker.station-lavage {
          --glow-color: #40e0d0;
        }
        .station-marker:hover {
          transform: scale(1.1);
          z-index: 1000 !important;
          background-color: rgba(30, 35, 55, 0.9);
          border: 2px solid rgba(255, 255, 255, 0.6);
        }
      `,
        }}
      />
      <MapViewComponent
        stations={
          convertStationsToOptionalFields(stations).map((station) => ({
            ...station,
            isDelisle: station.isDelisle ?? false,
            services: station.services || null,
            parkingDetails: station.parkingDetails
              ? {
                  ...station.parkingDetails,
                  tarif: station.parkingDetails.tarif?.toString() || null,
                }
              : null,
            reviews:
              station.reviews?.map((review) => ({
                ...review,
                content: review.comment || "",
                encryptedContent: "",
                userId: review.authorId,
              })) || [],
            averageRating: station.reviews
              ? station.reviews.reduce(
                  (acc, review) => acc + review.rating,
                  0
                ) / station.reviews.length
              : 0,
          })) as StationWithDetails[]
        }
        onInit={onInit}
        getMarkerIcon={(station) => {
          return station.type === StationType.STATION_LAVAGE
            ? borneIcon
            : stationIcon;
        }}
        onStationClick={(station) => {
          console.log("Station clicked:", station);
        }}
        selectedStation={null}
      />
    </>
  );
}
