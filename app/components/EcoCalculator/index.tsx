"use client";

import { useState } from "react";
import {
  WashType,
  washTypes,
  vehicleSizes,
  VehicleSize,
} from "@/app/types/ecoConsumption";

interface EcoCalculatorProps {
  onWashComplete: (washData: {
    washType: string;
    vehicleSize: "small" | "medium" | "large";
    duration: number;
    waterUsed: number;
    waterSaved: number;
    ecoPoints: number;
  }) => void;
}

export function EcoCalculator({ onWashComplete }: EcoCalculatorProps) {
  const [selectedWashType, setSelectedWashType] = useState<WashType | null>(
    null
  );
  const [vehicleSize, setVehicleSize] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const [duration, setDuration] = useState<number>(10);

  const calculateWaterUsage = () => {
    if (!selectedWashType) return null;

    const sizeFactor =
      vehicleSizes.find((size: VehicleSize) => size.id === vehicleSize)
        ?.factor || 1;
    const durationFactor = duration / 10; // Base de calcul pour 10 minutes

    const waterUsage = {
      min: Math.round(
        selectedWashType.baseConsumption.min * sizeFactor * durationFactor
      ),
      max: Math.round(
        selectedWashType.baseConsumption.max * sizeFactor * durationFactor
      ),
    };

    // Calcul des économies par rapport à un lavage traditionnel
    const traditionalWashUsage = 200; // Litres pour un lavage traditionnel
    const savings =
      traditionalWashUsage - (waterUsage.min + waterUsage.max) / 2;

    // Calcul des points éco
    const ecoPoints = Math.round(savings / 10); // 1 point pour 10L économisés

    return {
      waterUsage,
      savings: Math.round(savings),
      ecoPoints,
      tips: getWaterSavingTips(duration, waterUsage.max),
    };
  };

  const getWaterSavingTips = (duration: number, maxUsage: number) => {
    const tips = [];

    if (duration > 15) {
      tips.push(
        "Essayez de réduire le temps de lavage à 10-15 minutes pour économiser l'eau"
      );
    }

    if (maxUsage > 100) {
      tips.push("Utilisez le rinçage rapide pour les lavages d'entretien");
    }

    return tips;
  };

  const handleSubmit = () => {
    if (!selectedWashType) return;

    const results = calculateWaterUsage();
    if (!results) return;

    const averageWaterUsed = Math.round(
      (results.waterUsage.min + results.waterUsage.max) / 2
    );

    onWashComplete({
      washType: selectedWashType.name,
      vehicleSize,
      duration,
      waterUsed: averageWaterUsed,
      waterSaved: results.savings,
      ecoPoints: results.ecoPoints,
    });
  };

  return (
    <div className="space-y-6">
      {/* Type de lavage */}
      <div className="mb-4">
        <label htmlFor="washType" className="block text-sm font-medium mb-2">
          Type de lavage
        </label>
        <select
          id="washType"
          className="w-full p-2 border rounded"
          onChange={(e) =>
            setSelectedWashType(
              washTypes.find((w: WashType) => w.id === e.target.value) || null
            )
          }
        >
          <option value="">Sélectionnez un type</option>
          {washTypes.map((type: WashType) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {/* Taille du véhicule */}
      <div className="mb-4">
        <label htmlFor="vehicleSize" className="block text-sm font-medium mb-2">
          Taille du camping-car
        </label>
        <select
          id="vehicleSize"
          className="w-full p-2 border rounded"
          onChange={(e) =>
            setVehicleSize(e.target.value as "small" | "medium" | "large")
          }
          value={vehicleSize}
        >
          {vehicleSizes.map((size: VehicleSize) => (
            <option key={size.id} value={size.id}>
              {size.name}
            </option>
          ))}
        </select>
      </div>

      {/* Durée estimée */}
      <div className="mb-6">
        <label htmlFor="duration" className="block text-sm font-medium mb-2">
          Durée estimée (minutes)
        </label>
        <input
          id="duration"
          type="number"
          min="1"
          max="30"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Résultats */}
      {calculateWaterUsage() && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Estimation de consommation</h3>
            <div className="space-y-2">
              <p>
                Consommation d'eau estimée :
                <span className="font-semibold">
                  {calculateWaterUsage()?.waterUsage.min} -{" "}
                  {calculateWaterUsage()?.waterUsage.max}L
                </span>
              </p>
              <p>
                Économie par rapport à un lavage traditionnel :
                <span className="font-semibold text-green-600">
                  {calculateWaterUsage()?.savings}L
                </span>
              </p>
              <p>
                Points éco à gagner :
                <span className="font-semibold text-green-600">
                  {calculateWaterUsage()?.ecoPoints} points
                </span>
              </p>
            </div>
          </div>

          {/* Conseils d'économie d'eau */}
          {calculateWaterUsage()?.tips.length ? (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Conseils pour économiser</h3>
              <ul className="list-disc list-inside space-y-1">
                {calculateWaterUsage()?.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Bouton de validation */}
          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
          >
            Enregistrer ce lavage
          </button>
        </div>
      )}
    </div>
  );
}
