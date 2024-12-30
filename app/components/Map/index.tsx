"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Station } from "@prisma/client";
import { toast } from "sonner";

interface MapProps {
  stations: Station[];
  getMarkerIcon: (status: string, type: string) => string;
  center: [number, number];
  zoom: number;
}

// Composant pour gérer la géolocalisation
function LocationMarker({
  shouldLocate,
  onLocated,
}: {
  shouldLocate: boolean;
  onLocated: () => void;
}) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    if (shouldLocate) {
      console.log("Tentative de géolocalisation...");
      map.locate({
        setView: true,
        maxZoom: 13,
        watch: true,
        timeout: 10000,
      });
    }
  }, [shouldLocate, map]);

  useEffect(() => {
    map.on("locationfound", (e) => {
      console.log("Location found:", e.latlng);
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, 13);
      onLocated();
    });

    map.on("locationerror", (e) => {
      console.error("Location error:", e);
      toast.error(
        "Impossible d'obtenir votre position. Vérifiez que la géolocalisation est activée."
      );
      onLocated();
    });

    return () => {
      map.off("locationfound");
      map.off("locationerror");
    };
  }, [map, onLocated]);

  const userIcon = new Icon({
    iconUrl: "/markers/user-location.svg",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

  return position === null ? null : (
    <Marker position={position} icon={userIcon}>
      <Popup>
        <div className="text-center">
          <p className="font-semibold">Votre position</p>
        </div>
      </Popup>
    </Marker>
  );
}

export default function MapComponent({
  stations,
  getMarkerIcon,
  center,
  zoom,
}: MapProps) {
  const [shouldLocate, setShouldLocate] = useState(false);

  return (
    <div className="relative w-[800px] h-[800px] mx-auto rounded-xl overflow-hidden shadow-xl border border-gray-700/50">
      <div className="absolute top-4 right-4 z-[400]">
        <button
          onClick={() => setShouldLocate(true)}
          className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-colors shadow-lg border border-white/20"
        >
          Ma position
        </button>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        style={{ background: "#1a1f37" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />
        <LocationMarker
          shouldLocate={shouldLocate}
          onLocated={() => setShouldLocate(false)}
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
                popupAnchor: [0, -32],
              })
            }
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-lg mb-2">{station.name}</h3>
                <p className="text-sm text-gray-600">{station.address}</p>
                <div className="mt-2 flex gap-2">
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
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
