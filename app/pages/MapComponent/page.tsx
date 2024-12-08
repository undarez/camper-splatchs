"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import { icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapComponentProps,
  IconType,
  CamperWashStation,
} from "../../types/typesGeoapify";

const ICON_COLORS: Record<IconType, string> = {
  default: "blue",
  active: "green",
  inactive: "red",
  en_attente: "orange",
  selected: "yellow",
};

const createIcon = (color: string) => {
  return icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

const MapUpdater: React.FC<{ center: LatLngTuple }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

const PopupContent: React.FC<{
  name: string;
  address: string;
  services?: CamperWashStation["services"];
}> = ({ name, address, services }) => (
  <div className="p-4 min-w-[200px]">
    <h3 className="font-semibold text-base text-foreground mb-2">{name}</h3>
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{address}</p>
      {services && (
        <div className="mt-2">
          <p className="text-xs font-medium text-foreground mb-1">Services:</p>
          <ul className="space-y-1">
            {Object.entries(services).map(
              ([key, value]) =>
                key !== "id" && (
                  <li key={key} className="flex items-center gap-2 text-xs">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        value ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    {key}: {value ? "Oui" : "Non"}
                  </li>
                )
            )}
          </ul>
        </div>
      )}
    </div>
  </div>
);

export function MapComponent({
  position,
  selectedLocation,
  existingLocations,
  onLocationSelect,
}: MapComponentProps) {
  const validPosition: LatLngTuple =
    position && position[0] && position[1] ? position : [46.227638, 2.213749]; // Coordonnées par défaut (centre de la France)

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={validPosition}
        zoom={13}
        className="h-full w-full z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {selectedLocation && (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={createIcon(ICON_COLORS.selected)}
          >
            <Popup>
              <PopupContent
                name={selectedLocation.name}
                address={selectedLocation.address}
                services={selectedLocation.services}
              />
            </Popup>
          </Marker>
        )}

        {existingLocations.map(
          (location) =>
            location.lat &&
            location.lng && (
              <Marker
                key={location.id}
                position={[location.lat, location.lng]}
                icon={createIcon(ICON_COLORS.default)}
                eventHandlers={{
                  click: () => onLocationSelect(location),
                }}
              >
                <Popup>
                  <PopupContent
                    name={location.name}
                    address={location.address}
                    services={location.services}
                  />
                </Popup>
              </Marker>
            )
        )}

        <MapUpdater center={validPosition} />
      </MapContainer>
    </div>
  );
}

export default MapComponent;
