"use client";

import { useEffect, ComponentType } from "react";
import dynamic from "next/dynamic";
import { Icon } from "leaflet";
import { StationType, StationStatus } from "@prisma/client";
import { CamperWashStation } from "@/app/types/typesGeoapify";

interface MapProps {
  stations: Station[];
  getMarkerIcon: (status: StationStatus, type: StationType) => string;
  center: [number, number]; // Assurez-vous que cette prop existe
  zoom: number;
  existingLocations?: MapLocation[]; // Utilisez MapLocation au lieu de CamperWashStation
  onLocationSelect?: (location: Partial<CamperWashStation>) => void;
  zoomControl?: boolean;
}

// Ajoutez aussi l'interface MapLocation si elle n'existe pas déjà
interface MapLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: StationType;
  status: string;
}
interface StationServices {
  id: string;
  highPressure: "NONE" | "PASSERELLE" | "ECHAFAUDAGE" | "PORTIQUE";
  tirePressure: boolean;
  vacuum: boolean;
  handicapAccess: boolean;
  wasteWater: boolean;
  waterPoint: boolean;
  wasteWaterDisposal: boolean;
  blackWaterDisposal: boolean;
  electricity: "NONE" | "AMP_8" | "AMP_15";
  maxVehicleLength: number | null;
  paymentMethods: string[];
}

interface ParkingDetails {
  id: string;
  isPayant: boolean;
  tarif: number | null;
  hasElectricity: "NONE" | "AMP_8" | "AMP_15";
  commercesProches: string[];
  handicapAccess: boolean;
}

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
  services: StationServices | null;
  parkingDetails: ParkingDetails | null;
}

const MapContainer: ComponentType<
  React.ComponentProps<typeof import("react-leaflet").MapContainer>
> = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
});

const TileLayer: ComponentType<
  React.ComponentProps<typeof import("react-leaflet").TileLayer>
> = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {
  ssr: false,
});

const Marker: ComponentType<
  React.ComponentProps<typeof import("react-leaflet").Marker>
> = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), {
  ssr: false,
});

const Popup: ComponentType<
  React.ComponentProps<typeof import("react-leaflet").Popup>
> = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const Map: ComponentType<MapProps> = ({
  stations,
  getMarkerIcon,
  center,
  zoom,
  existingLocations = [],
  onLocationSelect,
  zoomControl = true,
}) => {
  useEffect(() => {
    Promise.all([
      import("leaflet/dist/leaflet.css"),
      import("@geoapify/geocoder-autocomplete/styles/minimal.css"),
    ]);
  }, []);

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
          eventHandlers={{
            click: () => {
              if (onLocationSelect) {
                onLocationSelect({
                  id: station.id,
                  name: station.name,
                  address: station.address,
                  lat: station.latitude,
                  lng: station.longitude,
                });
              }
            },
          }}
        >
          <Popup>
            <div>
              <h3 className="font-semibold">{station.name}</h3>
              <p>{station.address}</p>
              {station.services && (
                <div className="mt-2">
                  <h4 className="font-semibold">Services :</h4>
                  <ul className="list-disc list-inside">
                    {station.services.highPressure !== "NONE" && (
                      <li>
                        Haute pression (
                        {station.services.highPressure.toLowerCase()})
                      </li>
                    )}
                    {station.services.tirePressure && (
                      <li>Gonflage des pneus</li>
                    )}
                    {station.services.vacuum && <li>Aspirateur</li>}
                    {station.services.handicapAccess && (
                      <li>Accès handicapé</li>
                    )}
                    {station.services.wasteWater && <li>Vidange eaux usées</li>}
                    {station.services.waterPoint && <li>Point d'eau</li>}
                    {station.services.wasteWaterDisposal && (
                      <li>Évacuation eaux usées</li>
                    )}
                    {station.services.blackWaterDisposal && (
                      <li>Évacuation eaux noires</li>
                    )}
                    {station.services.electricity !== "NONE" && (
                      <li>
                        Électricité (
                        {station.services.electricity === "AMP_8"
                          ? "8 ampères"
                          : "15 ampères"}
                        )
                      </li>
                    )}
                    {station.services.maxVehicleLength && (
                      <li>
                        Longueur maximale : {station.services.maxVehicleLength}m
                      </li>
                    )}
                  </ul>
                </div>
              )}
              {station.parkingDetails && (
                <div className="mt-2">
                  <h4 className="font-semibold">Informations parking :</h4>
                  <ul className="list-disc list-inside">
                    {station.parkingDetails.isPayant && (
                      <li>Payant ({station.parkingDetails.tarif}€/jour)</li>
                    )}
                    {station.parkingDetails.hasElectricity !== "NONE" && (
                      <li>
                        Électricité (
                        {station.parkingDetails.hasElectricity === "AMP_8"
                          ? "8 ampères"
                          : "15 ampères"}
                        )
                      </li>
                    )}
                    {station.parkingDetails.handicapAccess && (
                      <li>Accès handicapé</li>
                    )}
                    {station.parkingDetails.commercesProches.length > 0 && (
                      <li>
                        Commerces à proximité :{" "}
                        {station.parkingDetails.commercesProches.join(", ")}
                      </li>
                    )}
                  </ul>
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
};

export default Map;
