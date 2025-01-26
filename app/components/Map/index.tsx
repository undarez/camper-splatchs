"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { divIcon, marker, Map as LeafletMap, Icon, IconOptions } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useGeolocation } from "@/app/hooks/useGeolocation";
import { Button } from "@/app/components/ui/button";
import { StationStatus, StationType } from "@prisma/client";
import { StationWithOptionalFields } from "@/app/types/station";

export interface MapComponentProps {
  stations: StationWithOptionalFields[];
  getMarkerIcon: (
    status: StationStatus,
    type: StationType,
    isLavaTrans?: boolean
  ) => Icon<IconOptions>;
  center: [number, number];
  zoom: number;
  onMapReady?: (map: LeafletMap) => void;
  createPopupContent?: (station: StationWithOptionalFields) => string;
}

function MapEvents({ onMapReady }: { onMapReady?: (map: LeafletMap) => void }) {
  const map = useMap();

  useEffect(() => {
    if (map && onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
}

const MapComponent: React.FC<MapComponentProps> = ({
  stations,
  getMarkerIcon,
  center,
  zoom,
  onMapReady,
  createPopupContent,
}) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const { latitude, longitude, getLocation, loading } = useGeolocation();
  const markers = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (latitude && longitude && mapRef.current) {
      const userPosition: L.LatLngExpression = [latitude, longitude];

      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }

      const userIcon = divIcon({
        className: "user-location-marker",
        html: '<div class="pulse"></div>',
        iconSize: [20, 20],
      });

      userMarkerRef.current = marker(userPosition, { icon: userIcon }).addTo(
        mapRef.current
      );

      mapRef.current.setView(userPosition, 13);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    stations.forEach((station) => {
      const markerIcon = getMarkerIcon(
        station.status,
        station.type,
        station.isLavaTrans
      );
      const newMarker = marker([station.latitude, station.longitude], {
        icon: markerIcon,
      });

      if (mapRef.current) {
        newMarker.addTo(mapRef.current);
        markers.current.push(newMarker);
      }
    });

    return () => {
      markers.current.forEach((marker) => marker.remove());
      markers.current = [];
    };
  }, [stations, getMarkerIcon]);

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
            icon={getMarkerIcon(
              station.status,
              station.type,
              station.isLavaTrans
            )}
          >
            <Popup>
              {createPopupContent ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: createPopupContent(station),
                  }}
                />
              ) : (
                <div>
                  <h3 className="font-bold">{station.name}</h3>
                  <p>{station.address}</p>
                  {station.city && <p>{station.city}</p>}
                </div>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <Button
        onClick={getLocation}
        disabled={loading}
        className="absolute top-4 right-4 z-[1000] bg-white text-black hover:bg-gray-100"
        size="sm"
      >
        {loading ? "Localisation..." : "Me localiser"}
      </Button>
    </div>
  );
};

export default MapComponent;
