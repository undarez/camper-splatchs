"use client";

import { useState } from "react";
import GoogleAdsense from "./GoogleAdsense";
import { cn } from "@/lib/utils";
import { HighPressureType, ElectricityType } from "@prisma/client";

type StationType = "STATION_LAVAGE" | "PARKING";

interface WashLane {
  laneNumber: number;
  hasHighPressure: boolean;
  hasBusesPortique: boolean;
  hasRollerPortique: boolean;
}

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
  // Nouveaux champs pour Delisle
  isDelisle: boolean;
  portiquePrice: string;
  manualWashPrice: string;
  washLanes: WashLane[];
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
  const [laneCount, setLaneCount] = useState(1);

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

  const handleLaneCountChange = (count: number) => {
    setLaneCount(count);

    // Mettre à jour les pistes de lavage
    const newLanes: WashLane[] = [];
    for (let i = 0; i < count; i++) {
      // Conserver les données existantes si disponibles
      if (formData.washLanes && formData.washLanes[i]) {
        newLanes.push(formData.washLanes[i]);
      } else {
        newLanes.push({
          laneNumber: i + 1,
          hasHighPressure: false,
          hasBusesPortique: false,
          hasRollerPortique: false,
        });
      }
    }

    setFormData({
      ...formData,
      washLanes: newLanes,
    });
  };

  const handleLaneChange = (
    index: number,
    field: keyof WashLane,
    value: boolean
  ) => {
    const updatedLanes = [...formData.washLanes];
    updatedLanes[index] = {
      ...updatedLanes[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      washLanes: updatedLanes,
    });
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
      <div className="bg-[#1E2337] rounded-xl border border-gray-700/50 p-6 max-w-2xl w-full mx-4 shadow-xl relative overflow-y-auto max-h-[90vh]">
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

          {/* Option Delisle */}
          {formData.type === "STATION_LAVAGE" && (
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <input
                  id="is-delisle"
                  type="checkbox"
                  checked={formData.isDelisle}
                  onChange={(e) =>
                    setFormData({ ...formData, isDelisle: e.target.checked })
                  }
                  className="mr-2 h-4 w-4"
                />
                <label htmlFor="is-delisle" className="text-gray-300 text-sm">
                  Station Delisle
                </label>
              </div>

              {formData.isDelisle && (
                <div className="space-y-4 mt-4 p-4 bg-[#252B43] rounded-lg border border-gray-700/50">
                  <h3 className="text-white font-semibold">
                    Configuration Delisle
                  </h3>

                  {/* Tarifs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="portique-price"
                        className="text-gray-300 text-sm mb-1 block"
                      >
                        Prix portique (€ HT)
                      </label>
                      <input
                        id="portique-price"
                        type="number"
                        value={formData.portiquePrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            portiquePrice: e.target.value,
                          })
                        }
                        placeholder="40"
                        className="w-full p-3 bg-[#1E2337] border border-gray-700/50 rounded-lg text-white focus:border-blue-500/50 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="manual-wash-price"
                        className="text-gray-300 text-sm mb-1 block"
                      >
                        Prix 10min lavage manuel (€ HT)
                      </label>
                      <input
                        id="manual-wash-price"
                        type="number"
                        value={formData.manualWashPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            manualWashPrice: e.target.value,
                          })
                        }
                        placeholder="10"
                        className="w-full p-3 bg-[#1E2337] border border-gray-700/50 rounded-lg text-white focus:border-blue-500/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Nombre de pistes */}
                  <div>
                    <label
                      htmlFor="lane-count"
                      className="text-gray-300 text-sm mb-1 block"
                    >
                      Nombre de pistes de lavage
                    </label>
                    <select
                      id="lane-count"
                      value={laneCount}
                      onChange={(e) =>
                        handleLaneCountChange(parseInt(e.target.value))
                      }
                      className="w-full p-3 bg-[#1E2337] border border-gray-700/50 rounded-lg text-white focus:border-blue-500/50 focus:outline-none transition-colors"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Configuration des pistes */}
                  <div className="space-y-4">
                    <h4 className="text-gray-300 font-medium">
                      Configuration des pistes
                    </h4>

                    {formData.washLanes.map((lane, index) => (
                      <div
                        key={index}
                        className="p-3 bg-[#1E2337] rounded-lg border border-gray-700/50"
                      >
                        <h5 className="text-white font-medium mb-2">
                          Piste {lane.laneNumber}
                        </h5>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input
                              id={`high-pressure-${index}`}
                              type="checkbox"
                              checked={lane.hasHighPressure}
                              onChange={(e) =>
                                handleLaneChange(
                                  index,
                                  "hasHighPressure",
                                  e.target.checked
                                )
                              }
                              className="mr-2 h-4 w-4"
                            />
                            <label
                              htmlFor={`high-pressure-${index}`}
                              className="text-gray-300 text-sm"
                            >
                              Lances HP + Canon à Mousse
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              id={`buses-portique-${index}`}
                              type="checkbox"
                              checked={lane.hasBusesPortique}
                              onChange={(e) =>
                                handleLaneChange(
                                  index,
                                  "hasBusesPortique",
                                  e.target.checked
                                )
                              }
                              className="mr-2 h-4 w-4"
                            />
                            <label
                              htmlFor={`buses-portique-${index}`}
                              className="text-gray-300 text-sm"
                            >
                              Portique à BUSES
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              id={`roller-portique-${index}`}
                              type="checkbox"
                              checked={lane.hasRollerPortique}
                              onChange={(e) =>
                                handleLaneChange(
                                  index,
                                  "hasRollerPortique",
                                  e.target.checked
                                )
                              }
                              className="mr-2 h-4 w-4"
                            />
                            <label
                              htmlFor={`roller-portique-${index}`}
                              className="text-gray-300 text-sm"
                            >
                              Portique ROULEAUX
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
