"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { StationType } from "@prisma/client";

// Icônes personnalisées pour les différents types de points
const stationIcon = new Icon({
  iconUrl: "/icons/station-marker.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const parkingIcon = new Icon({
  iconUrl: "/icons/parking-marker.svg",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: StationType;
  status: string;
}

interface MapProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  existingLocations?: Location[];
  center?: [number, number];
  zoom?: number;
}

interface MapEventsProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
}

function MapEvents({ onLocationSelect }: MapEventsProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const handleClick = (e: { latlng: { lat: number; lng: number } }) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [map, onLocationSelect]);

  return null;
}

export default function Map({
  onLocationSelect,
  existingLocations = [],
  center = [46.603354, 1.888334], // Centre de la France
  zoom = 6,
}: MapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onLocationSelect={onLocationSelect} />

      {existingLocations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={location.type === "PARKING" ? parkingIcon : stationIcon}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{location.name}</h3>
              <p>{location.address}</p>
              <p>Status: {location.status}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
