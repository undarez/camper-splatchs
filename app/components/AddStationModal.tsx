"use client";

import { useState } from "react";
import GoogleAdsense from "./GoogleAdsense";
import { cn } from "@/lib/utils";
import { HighPressureType, ElectricityType } from "@prisma/client";

type StationType = "STATION_LAVAGE" | "PARKING";

interface StationData {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  lat: number | null;
  lng: number | null;
  type: StationType;
  highPressure: HighPressureType;
  tirePressure: boolean;
  vacuum: boolean;
  handicapAccess: boolean;
  wasteWater: boolean;
  waterPoint: boolean;
  wasteWaterDisposal: boolean;
  blackWaterDisposal: boolean;
  electricity: ElectricityType;
  maxVehicleLength: string;
  paymentMethods: string[];
  isPayant: boolean;
  tarif: string;
  commercesProches: string[];
}

interface AddStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StationData) => Promise<void>;
  initialData: StationData;
}

export default function AddStationModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: AddStationModalProps) {
  const [showAd, setShowAd] = useState(false);
  const [formData, setFormData] = useState<StationData>(initialData);

  if (!isOpen && !showAd) {
    return null;
  }

  const handleSubmit = () => {
    const stationData: StationData = {
      ...formData,
      lat: formData.lat || 0,
      lng: formData.lng || 0,
    };

    onSubmit(stationData);
    setShowAd(true);
  };

  if (showAd) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
        <div className="bg-[#1E2337] p-6 rounded-xl border border-gray-700/50 max-w-md w-full mx-4 shadow-xl relative">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2 text-white">
              Station ajoutée avec succès!
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Merci de votre contribution.
            </p>
            <GoogleAdsense
              slot="4467963311"
              style={{ display: "block", textAlign: "center" }}
              format="auto"
              responsive={true}
            />
          </div>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-[#1E2337] rounded-xl border border-gray-700/50 p-6 max-w-2xl w-full mx-4 shadow-xl relative">
        <h2 className="text-2xl font-bold text-white mb-6">
          Ajouter une station
        </h2>

        {/* Type de station */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            className={cn(
              "p-4 rounded-lg border transition-all",
              formData.type === "STATION_LAVAGE"
                ? "bg-blue-500/20 border-blue-500 text-blue-400"
                : "bg-[#252B43] border-gray-700/50 text-gray-400 hover:bg-[#2A3150]"
            )}
            onClick={() => setFormData({ ...formData, type: "STATION_LAVAGE" })}
          >
            Station de lavage
          </button>
          <button
            type="button"
            className={cn(
              "p-4 rounded-lg border transition-all",
              formData.type === "PARKING"
                ? "bg-purple-500/20 border-purple-500 text-purple-400"
                : "bg-[#252B43] border-gray-700/50 text-gray-400 hover:bg-[#2A3150]"
            )}
            onClick={() => setFormData({ ...formData, type: "PARKING" })}
          >
            Parking
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="station-name"
              className="text-gray-300 text-sm mb-1 block"
            >
              Nom de la station
            </label>
            <input
              id="station-name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-3 bg-[#252B43] border border-gray-700/50 rounded-lg text-white focus:border-blue-500/50 focus:outline-none transition-colors"
              placeholder="Entrez le nom de la station"
            />
          </div>

          <div>
            <label
              htmlFor="station-address"
              className="text-gray-300 text-sm mb-1 block"
            >
              Adresse
            </label>
            <input
              id="station-address"
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full p-3 bg-[#252B43] border border-gray-700/50 rounded-lg text-white focus:border-blue-500/50 focus:outline-none transition-colors"
              placeholder="Entrez l'adresse complète"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="station-city"
                className="text-gray-300 text-sm mb-1 block"
              >
                Ville
              </label>
              <input
                id="station-city"
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full p-3 bg-[#252B43] border border-gray-700/50 rounded-lg text-white focus:border-blue-500/50 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label
                htmlFor="station-postalCode"
                className="text-gray-300 text-sm mb-1 block"
              >
                Code postal
              </label>
              <input
                id="station-postalCode"
                type="text"
                value={formData.postalCode}
                onChange={(e) =>
                  setFormData({ ...formData, postalCode: e.target.value })
                }
                className="w-full p-3 bg-[#252B43] border border-gray-700/50 rounded-lg text-white focus:border-blue-500/50 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
