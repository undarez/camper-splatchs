"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Icon } from "leaflet";
import {
  StationType,
  StationStatus,
  ElectricityType,
  HighPressureType,
} from "@prisma/client";
import { CamperWashStation } from "@/app/types";

interface Station {
  id: string;
  name: string;
  address: string;
  city: string | null;
  postalCode: string | null;
  latitude: number;
  longitude: number;
  status: StationStatus;
  type: StationType;
  services?: {
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
    paymentMethods: string[];
  } | null;
  parkingDetails?: {
    isPayant: boolean;
    tarif: number | null;
    hasElectricity: ElectricityType;
    commercesProches: string[];
    handicapAccess: boolean;
  } | null;
}

interface MapProps {
  stations: Station[];
  getMarkerIcon: (status: StationStatus, type: StationType) => string;
  center: [number, number];
  zoom: number;
  existingLocations?: MapLocation[];
  onLocationSelect?: (location: Partial<CamperWashStation>) => void;
  zoomControl?: boolean;
}

interface MapLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: StationType;
  status: string;
}

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export default function Map({
  stations,
  getMarkerIcon,
  center = [46.603354, 1.888334],
  zoom = 6,
  existingLocations = [],
  onLocationSelect,
  zoomControl = true,
}: MapProps) {
  console.log("Stations reçues dans Map:", stations);

  useEffect(() => {
    Promise.all([
      import("leaflet/dist/leaflet.css"),
      import("@geoapify/geocoder-autocomplete/styles/minimal.css"),
    ]);
  }, []);

  const renderServices = (station: Station) => {
    console.log("Services de la station:", station.services);
    if (station.type === "STATION_LAVAGE" && station.services) {
      return (
        <div className="mt-2">
          <h4 className="font-semibold text-sm mb-2">Services :</h4>
          <ul className="space-y-1">
            {station.services.highPressure !== "NONE" && (
              <li className="text-green-600 text-sm">
                • Haute pression ({station.services.highPressure.toLowerCase()})
              </li>
            )}
            {station.services.tirePressure && (
              <li className="text-green-600 text-sm">• Gonflage des pneus</li>
            )}
            {station.services.vacuum && (
              <li className="text-green-600 text-sm">• Aspirateur</li>
            )}
            {station.services.handicapAccess && (
              <li className="text-green-600 text-sm">• Accès handicapé</li>
            )}
            {station.services.wasteWater && (
              <li className="text-green-600 text-sm">• Vidange eaux usées</li>
            )}
            {station.services.waterPoint && (
              <li className="text-green-600 text-sm">• Point d'eau</li>
            )}
            {station.services.wasteWaterDisposal && (
              <li className="text-green-600 text-sm">
                • Évacuation eaux usées
              </li>
            )}
            {station.services.blackWaterDisposal && (
              <li className="text-green-600 text-sm">
                • Évacuation eaux noires
              </li>
            )}
            {station.services.electricity !== "NONE" && (
              <li className="text-green-600 text-sm">
                • Électricité (
                {station.services.electricity === "AMP_8" ? "8A" : "15A"})
              </li>
            )}
            {station.services.maxVehicleLength && (
              <li className="text-green-600 text-sm">
                • Longueur max: {station.services.maxVehicleLength}m
              </li>
            )}
            {station.services.paymentMethods &&
              station.services.paymentMethods.length > 0 && (
                <li className="text-green-600 text-sm">
                  • Moyens de paiement:{" "}
                  {station.services.paymentMethods
                    .map((method) => {
                      switch (method) {
                        case "JETON":
                          return "Jeton";
                        case "ESPECES":
                          return "Espèces";
                        case "CARTE_BANCAIRE":
                          return "Carte bancaire";
                        default:
                          return method;
                      }
                    })
                    .join(", ")}
                </li>
              )}
          </ul>
        </div>
      );
    } else if (station.type === "PARKING" && station.parkingDetails) {
      return (
        <div className="mt-2">
          <h4 className="font-semibold text-sm mb-2">Services du parking :</h4>
          <ul className="space-y-1">
            {station.parkingDetails.isPayant && (
              <li className="text-purple-600 text-sm">
                • Parking payant{" "}
                {station.parkingDetails.tarif
                  ? `(${station.parkingDetails.tarif}€/jour)`
                  : ""}
              </li>
            )}
            {station.parkingDetails.hasElectricity !== "NONE" && (
              <li className="text-purple-600 text-sm">
                • Électricité (
                {station.parkingDetails.hasElectricity === "AMP_8"
                  ? "8A"
                  : "15A"}
                )
              </li>
            )}
            {station.parkingDetails.handicapAccess && (
              <li className="text-purple-600 text-sm">• Accès handicapé</li>
            )}
            {station.parkingDetails.commercesProches &&
              station.parkingDetails.commercesProches.length > 0 && (
                <li className="text-purple-600 text-sm">
                  • Commerces à proximité:{" "}
                  {station.parkingDetails.commercesProches
                    .map((commerce) => {
                      switch (commerce) {
                        case "NOURRITURE":
                          return "Alimentation";
                        case "BANQUE":
                          return "Banque";
                        case "CENTRE_VILLE":
                          return "Centre-ville";
                        case "STATION_SERVICE":
                          return "Station-service";
                        case "LAVERIE":
                          return "Laverie";
                        case "GARAGE":
                          return "Garage";
                        default:
                          return commerce;
                      }
                    })
                    .join(", ")}
                </li>
              )}
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full"
      zoomControl={zoomControl}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stations.map((station) => (
        <Marker
          key={station.id}
          position={[station.latitude, station.longitude]}
          icon={
            new Icon({
              iconUrl: getMarkerIcon(station.status, station.type),
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            })
          }
        >
          <Popup>
            <div className="p-4 min-w-[250px]">
              <h3 className="font-semibold text-lg mb-2">{station.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{station.address}</p>
              <p className="text-xs text-gray-500 mb-2">
                Coordonnées: {station.latitude.toFixed(6)},{" "}
                {station.longitude.toFixed(6)}
              </p>
              {renderServices(station)}
              <div className="mt-3 flex gap-2 flex-wrap">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    station.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : station.status === "en_attente"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {station.status === "active"
                    ? "Active"
                    : station.status === "en_attente"
                    ? "En attente"
                    : "Inactive"}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    station.type === "STATION_LAVAGE"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {station.type === "STATION_LAVAGE"
                    ? "Station de lavage"
                    : "Parking"}
                </span>
              </div>
              {station.status === "en_attente" && (
                <div className="mt-3">
                  <a
                    href="/pages/AdminStation"
                    className="inline-block w-full text-center px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-md hover:bg-amber-600 transition-colors"
                  >
                    Valider la station
                  </a>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
      {existingLocations?.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={
            new Icon({
              iconUrl:
                "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            })
          }
          eventHandlers={{
            click: () => onLocationSelect?.(location),
          }}
        >
          <Popup>
            <div>
              <h3 className="font-semibold">{location.name}</h3>
              <p>{location.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
