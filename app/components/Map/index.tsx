"use client";

import { useEffect, useRef } from "react";
import { Map as LeafletMap, tileLayer, marker, LatLng, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { StationType } from "@prisma/client";

interface MapLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: StationType;
  status: string;
  services?: {
    highPressure: string;
    tirePressure: boolean;
    vacuum: boolean;
    waterPoint: boolean;
    wasteWater: boolean;
    wasteWaterDisposal: boolean;
    blackWaterDisposal: boolean;
    handicapAccess: boolean;
    electricity: string;
    maxVehicleLength: number;
  };
  parkingDetails?: {
    isPayant: boolean;
    tarif: number;
    hasElectricity: boolean;
    commercesProches: string[];
    handicapAccess: boolean;
  };
}

interface MapProps {
  center?: [number, number];
  zoom?: number;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  existingLocations?: MapLocation[];
}

export default function Map({
  center = [46.603354, 1.888334],
  zoom = 6,
  onLocationSelect,
  existingLocations = [],
}: MapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<ReturnType<typeof marker>[]>([]);

  useEffect(() => {
    if (!mapRef.current) {
      const map = new LeafletMap("map").setView(center, zoom);
      tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      if (onLocationSelect) {
        map.on("click", (e: { latlng: LatLng }) => {
          onLocationSelect(e.latlng);
        });
      }

      mapRef.current = map;
    }

    // Nettoyer les marqueurs existants
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Créer les icônes personnalisées
    const createIcon = (iconUrl: string) => {
      return new Icon({
        iconUrl,
        iconSize: [32, 42],
        iconAnchor: [16, 42],
        popupAnchor: [0, -42],
      });
    };

    // Ajouter les marqueurs pour les emplacements existants
    existingLocations.forEach((location) => {
      let iconUrl;
      if (location.type === StationType.PARKING) {
        iconUrl = "/markers/marker-parking.svg";
      } else {
        // Stations de lavage
        switch (location.status) {
          case "active":
            iconUrl = "/markers/marker-active.svg";
            break;
          case "en_attente":
            iconUrl = "/markers/marker-pending.svg";
            break;
          case "inactive":
            iconUrl = "/markers/marker-inactive.svg";
            break;
          default:
            iconUrl = "/markers/marker-active.svg";
        }
      }

      const newMarker = marker([location.latitude, location.longitude], {
        icon: createIcon(iconUrl),
      }).addTo(mapRef.current!).bindPopup(`
        <div class="p-4 max-w-sm">
          <h3 class="font-bold text-lg mb-2">${location.name}</h3>
          <div class="space-y-2">
            <p class="text-gray-600">${location.address}</p>
            <p class="text-sm">
              <span class="font-semibold">Coordonnées:</span><br/>
              Lat: ${location.latitude.toFixed(6)}<br/>
              Lng: ${location.longitude.toFixed(6)}
            </p>
            <p>
              <span class="font-semibold">Type:</span> 
              ${
                location.type === StationType.PARKING
                  ? "Parking"
                  : "Station de lavage"
              }
            </p>
            <p>
              <span class="font-semibold">Statut:</span> 
              <span class="
                ${location.status === "active" ? "text-green-600" : ""}
                ${location.status === "inactive" ? "text-red-600" : ""}
                ${location.status === "en_attente" ? "text-yellow-600" : ""}
              ">${location.status}</span>
            </p>
            
            ${
              location.type === StationType.STATION_LAVAGE && location.services
                ? `
              <div class="mt-3">
                <span class="font-semibold">Services:</span>
                <ul class="list-disc pl-5 mt-1 space-y-1 text-sm">
                  ${
                    location.services.highPressure !== "NONE"
                      ? `<li>Haute pression: ${location.services.highPressure}</li>`
                      : ""
                  }
                  ${
                    location.services.tirePressure
                      ? "<li>Gonflage des pneus</li>"
                      : ""
                  }
                  ${location.services.vacuum ? "<li>Aspirateur</li>" : ""}
                  ${location.services.waterPoint ? "<li>Point d'eau</li>" : ""}
                  ${
                    location.services.wasteWater
                      ? "<li>Vidange eaux usées</li>"
                      : ""
                  }
                  ${
                    location.services.wasteWaterDisposal
                      ? "<li>Évacuation eaux usées</li>"
                      : ""
                  }
                  ${
                    location.services.blackWaterDisposal
                      ? "<li>Évacuation eaux noires</li>"
                      : ""
                  }
                  ${
                    location.services.handicapAccess
                      ? "<li>Accès handicapé</li>"
                      : ""
                  }
                  ${
                    location.services.electricity !== "NONE"
                      ? `<li>Électricité: ${location.services.electricity}</li>`
                      : ""
                  }
                  ${
                    location.services.maxVehicleLength
                      ? `<li>Longueur max: ${location.services.maxVehicleLength}m</li>`
                      : ""
                  }
                </ul>
              </div>
            `
                : ""
            }
            
            ${
              location.type === StationType.PARKING && location.parkingDetails
                ? `
              <div class="mt-3">
                <span class="font-semibold">Détails du parking:</span>
                <ul class="list-disc pl-5 mt-1 space-y-1 text-sm">
                  ${
                    location.parkingDetails.isPayant
                      ? `<li>Tarif: ${location.parkingDetails.tarif}€/jour</li>`
                      : "<li>Gratuit</li>"
                  }
                  ${
                    location.parkingDetails.hasElectricity
                      ? "<li>Électricité disponible</li>"
                      : ""
                  }
                  ${
                    location.parkingDetails.handicapAccess
                      ? "<li>Accès handicapé</li>"
                      : ""
                  }
                  ${
                    location.parkingDetails.commercesProches.length > 0
                      ? `
                    <li>Commerces à proximité:
                      <ul class="list-circle pl-4">
                        ${location.parkingDetails.commercesProches
                          .map((commerce) => `<li>${commerce}</li>`)
                          .join("")}
                      </ul>
                    </li>
                  `
                      : ""
                  }
                </ul>
              </div>
            `
                : ""
            }
          </div>
        </div>
      `);

      markersRef.current.push(newMarker);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, zoom, onLocationSelect, existingLocations]);

  return <div id="map" className="w-full h-full" />;
}
