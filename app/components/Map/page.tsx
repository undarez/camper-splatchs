"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngTuple } from "leaflet";
import { CamperWashStation } from "@/app/types";
import { createIcon } from "@/app/lib/mapUtils";

interface MapProps {
  position: LatLngTuple;
  selectedLocation: CamperWashStation | null;
  existingLocations: CamperWashStation[];
  onLocationSelect?: (location: CamperWashStation) => void;
}

export default function Map({
  position,
  selectedLocation,
  existingLocations,
  onLocationSelect,
}: MapProps) {
  return (
    <MapContainer
      center={position}
      zoom={13}
      className="h-full w-full"
      style={{ height: "400px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {existingLocations.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          icon={createIcon(location.status)}
          eventHandlers={{
            click: () => onLocationSelect?.(location),
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{location.name}</h3>
              <p className="text-sm">{location.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      {selectedLocation && (
        <Marker
          position={[selectedLocation.lat, selectedLocation.lng]}
          icon={createIcon("selected")}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{selectedLocation.name}</h3>
              <p className="text-sm">{selectedLocation.address}</p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
