"use client";

import { StationType, ElectricityType } from "@prisma/client";
import { CamperWashStation } from "@/app/types";
import { Check, X } from "lucide-react";

interface PendingStationsListProps {
  stations: CamperWashStation[];
  onStationClick: (station: CamperWashStation) => void;
}

export default function PendingStationsList({
  stations,
  onStationClick,
}: PendingStationsListProps) {
  const pendingStations = stations.filter((s) => s.status === "en_attente");

  const handleKeyDown = (
    e: React.KeyboardEvent,
    station: CamperWashStation
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onStationClick(station);
    }
  };

  const renderServices = (station: CamperWashStation) => {
    if (station.type === StationType.STATION_LAVAGE && station.services) {
      return (
        <div className="mt-3 border-t border-gray-700 pt-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              {station.services.tirePressure ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-500" />
              )}
              <span className="text-gray-300">Gonflage pneus</span>
            </div>
            <div className="flex items-center gap-2">
              {station.services.vacuum ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-500" />
              )}
              <span className="text-gray-300">Aspirateur</span>
            </div>
            <div className="flex items-center gap-2">
              {station.services.waterPoint ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-500" />
              )}
              <span className="text-gray-300">Point d'eau</span>
            </div>
            <div className="flex items-center gap-2">
              {station.services.wasteWater ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-500" />
              )}
              <span className="text-gray-300">Vidange eaux usées</span>
            </div>
            <div className="flex items-center gap-2">
              {station.services.wasteWaterDisposal ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-500" />
              )}
              <span className="text-gray-300">Évacuation eaux usées</span>
            </div>
            <div className="flex items-center gap-2">
              {station.services.blackWaterDisposal ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <X className="w-4 h-4 text-red-500" />
              )}
              <span className="text-gray-300">Évacuation eaux noires</span>
            </div>
            {station.services.electricity !== ElectricityType.NONE && (
              <div className="col-span-2 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-gray-300">
                  Électricité:{" "}
                  {station.services.electricity.replace("AMP_", "")} ampères
                </span>
              </div>
            )}
          </div>
        </div>
      );
    } else if (station.type === StationType.PARKING && station.parkingDetails) {
      return (
        <div className="mt-3 border-t border-gray-700 pt-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              {station.parkingDetails.isPayant ? (
                <span className="text-yellow-500">
                  Payant: {station.parkingDetails.tarif}€/jour
                </span>
              ) : (
                <span className="text-green-500">Gratuit</span>
              )}
            </div>
            {station.parkingDetails.hasElectricity !== ElectricityType.NONE && (
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-gray-300">
                  Électricité:{" "}
                  {station.parkingDetails.hasElectricity.replace("AMP_", "")}{" "}
                  ampères
                </span>
              </div>
            )}
            {station.parkingDetails.commercesProches.length > 0 && (
              <div className="col-span-2 text-gray-300">
                <span>
                  Commerces:{" "}
                  {station.parkingDetails.commercesProches.join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-900/90 backdrop-blur-lg rounded-lg shadow-xl border border-gray-700 flex flex-col h-[calc(100vh-280px)]">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></span>
          Points en attente ({pendingStations.length})
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="p-4 space-y-3">
          {pendingStations.map((station) => (
            <button
              key={station.id}
              className="w-full text-left bg-gray-800/50 hover:bg-gray-700/50 rounded-lg p-4 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 hover:border-gray-600"
              onClick={() => onStationClick(station)}
              onKeyDown={(e) => handleKeyDown(e, station)}
              tabIndex={0}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-lg">
                    {station.name}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {station.address}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    station.type === StationType.PARKING
                      ? "bg-green-500/20 text-green-300"
                      : "bg-blue-500/20 text-blue-300"
                  }`}
                >
                  {station.type === StationType.PARKING ? "Parking" : "Station"}
                </span>
              </div>
              {renderServices(station)}
            </button>
          ))}
          {pendingStations.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">Aucun point en attente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
