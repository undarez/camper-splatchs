"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { divIcon, icon, marker, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Station, StationStatus, StationType } from "@prisma/client";
import { useGeolocation } from "@/app/hooks/useGeolocation";
import { Button } from "@/app/components/ui/button";

export type StationWithOptionalFields = Partial<Station> & {
  id: string;
  name: string;
  address: string;
  city: string | null;
  postalCode: string | null;
  latitude: number;
  longitude: number;
  status: StationStatus;
  type: StationType;
};

export interface MapComponentProps {
  stations: StationWithOptionalFields[];
  getMarkerIcon: (status: StationStatus, type: StationType) => string;
  center: [number, number];
  zoom: number;
  onMapReady?: (map: LeafletMap) => void;
  createPopupContent: (station: StationWithOptionalFields) => string;
}

function MapEvents({ onMapReady }: { onMapReady?: (map: LeafletMap) => void }) {
  const map = useMap();

  useEffect(() => {
    onMapReady?.(map);
  }, [map, onMapReady]);

  return null;
}

const Map = ({
  stations,
  getMarkerIcon,
  center,
  zoom,
  onMapReady,
  createPopupContent,
}: MapComponentProps) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const { latitude, longitude, getLocation, loading } = useGeolocation();

  useEffect(() => {
    if (latitude && longitude && mapRef.current) {
      console.log("Mise à jour de la position sur la carte:", {
        latitude,
        longitude,
      });
      const userPosition: L.LatLngExpression = [latitude, longitude];

      if (userMarkerRef.current) {
        console.log("Suppression de l'ancien marqueur");
        userMarkerRef.current.remove();
      }

      const userIcon = divIcon({
        className: "user-location-marker",
        html: '<div class="pulse"></div>',
        iconSize: [20, 20],
      });

      console.log("Ajout du nouveau marqueur");
      userMarkerRef.current = marker(userPosition, { icon: userIcon }).addTo(
        mapRef.current
      );

      console.log("Centrage de la carte");
      mapRef.current.setView(userPosition, 13);
    }
  }, [latitude, longitude]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        ref={mapRef}
      >
        <MapEvents onMapReady={onMapReady} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.latitude, station.longitude]}
            icon={icon({
              iconUrl: getMarkerIcon(station.status, station.type),
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            <Popup>
              <div
                dangerouslySetInnerHTML={{
                  __html: createPopupContent(station),
                }}
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <Button
        onClick={() => {
          console.log("Clic sur le bouton Me localiser");
          getLocation();
        }}
        disabled={loading}
        className="absolute top-4 right-4 z-[1000] bg-white text-black hover:bg-gray-100"
        size="sm"
      >
        {loading ? "Localisation..." : "Me localiser"}
      </Button>
    </div>
  );
};

export default Map;
