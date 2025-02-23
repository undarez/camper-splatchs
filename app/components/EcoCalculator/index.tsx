"use client";

import { useState } from "react";
import {
  WashType,
  washTypes,
  vehicleSizes,
  VehicleSize,
  WashData,
} from "@/app/types/ecoConsumption";
import { toast } from "sonner";

interface EcoCalculatorProps {
  onWashComplete: (washData: WashData) => Promise<void>;
}

export function EcoCalculator({ onWashComplete }: EcoCalculatorProps) {
  const [selectedWashType, setSelectedWashType] = useState<WashType | null>(
    null
  );
  const [vehicleSize, setVehicleSize] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const [duration, setDuration] = useState<number>(10);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateWaterUsage = () => {
    if (!selectedWashType) return null;

    const sizeFactor =
      vehicleSizes.find((size: VehicleSize) => size.id === vehicleSize)
        ?.factor || 1;
    const durationFactor = duration / 10;

    const waterUsage = {
      min: Math.round(
        selectedWashType.baseConsumption.min * sizeFactor * durationFactor
      ),
      max: Math.round(
        selectedWashType.baseConsumption.max * sizeFactor * durationFactor
      ),
    };

    const traditionalWashUsage = 200;
    const savings =
      traditionalWashUsage - (waterUsage.min + waterUsage.max) / 2;
    const ecoPoints = Math.round(savings / 10);

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

  const handleSubmit = async () => {
    if (!selectedWashType) {
      toast.error("Veuillez sélectionner un type de lavage");
      return;
    }

    setIsCalculating(true);
    try {
      const results = calculateWaterUsage();
      if (!results) {
        toast.error("Erreur lors du calcul");
        return;
      }

      const averageWaterUsed = Math.round(
        (results.waterUsage.min + results.waterUsage.max) / 2
      );

      await onWashComplete({
        washType: selectedWashType.name,
        vehicleSize,
        duration,
        waterUsed: averageWaterUsed,
        waterSaved: results.savings,
        ecoPoints: results.ecoPoints,
      });

      // Réinitialiser le formulaire
      setSelectedWashType(null);
      setDuration(10);
      toast.success("Lavage enregistré avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast.error("Une erreur est survenue lors de l'enregistrement");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Type de lavage */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Type de lavage
          </label>
          <select
            className="w-full p-3 bg-[#2A3147] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            onChange={(e) =>
              setSelectedWashType(
                washTypes.find((w) => w.id === e.target.value) || null
              )
            }
            value={selectedWashType?.id || ""}
          >
            <option value="">Sélectionnez un type</option>
            {washTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Taille du véhicule */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Taille du camping-car
          </label>
          <select
            className="w-full p-3 bg-[#2A3147] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            onChange={(e) =>
              setVehicleSize(e.target.value as "small" | "medium" | "large")
            }
            value={vehicleSize}
          >
            {vehicleSizes.map((size) => (
              <option key={size.id} value={size.id}>
                {size.name}
              </option>
            ))}
          </select>
        </div>

        {/* Durée */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Durée estimée (minutes)
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full p-3 bg-[#2A3147] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Résultats */}
      {calculateWaterUsage() && (
        <div className="space-y-4 bg-[#2A3147]/50 p-6 rounded-lg border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">
            Estimation de votre impact
          </h3>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-[#2A3147] p-4 rounded-lg border border-gray-700/50">
              <p className="text-sm text-gray-400">Consommation estimée</p>
              <p className="text-xl font-bold text-cyan-500">
                {calculateWaterUsage()?.waterUsage.min} -{" "}
                {calculateWaterUsage()?.waterUsage.max}L
              </p>
            </div>

            <div className="bg-[#2A3147] p-4 rounded-lg border border-gray-700/50">
              <p className="text-sm text-gray-400">Eau économisée</p>
              <p className="text-xl font-bold text-green-500">
                {calculateWaterUsage()?.savings}L
              </p>
            </div>

            <div className="bg-[#2A3147] p-4 rounded-lg border border-gray-700/50">
              <p className="text-sm text-gray-400">Points éco</p>
              <p className="text-xl font-bold text-yellow-500">
                +{calculateWaterUsage()?.ecoPoints} points
              </p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isCalculating}
            className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-[#1E2337] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCalculating ? "Enregistrement..." : "Enregistrer ce lavage"}
          </button>
        </div>
      )}
    </div>
  );
}
