"use client";

import { useMemo } from "react";
import { WashHistory, ecoBadges, EcoBadge } from "@/app/types/ecoConsumption";

interface EcoHistoryProps {
  washHistory: WashHistory[];
}

export function EcoHistory({ washHistory }: EcoHistoryProps) {
  const totalWaterSaved = useMemo(
    () => washHistory.reduce((acc, wash) => acc + wash.waterSaved, 0),
    [washHistory]
  );

  const earnedBadges = useMemo(
    () =>
      ecoBadges.filter(
        (badge: EcoBadge) => badge.requirement <= totalWaterSaved
      ),
    [totalWaterSaved]
  );

  const totalEcoPoints = useMemo(
    () => washHistory.reduce((acc, wash) => acc + wash.ecoPoints, 0),
    [washHistory]
  );

  return (
    <div className="space-y-6">
      {/* Résumé */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-4 text-cyan-600">
          Votre Impact Écologique
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Eau économisée (total)</p>
            <p className="text-2xl font-bold text-blue-600">
              {totalWaterSaved}L
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Points éco</p>
            <p className="text-2xl font-bold text-green-600">
              {totalEcoPoints}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Badges gagnés</p>
            <p className="text-2xl font-bold text-purple-600">
              {earnedBadges.length}
            </p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            <span className="font-medium">Note :</span> Ces données sont
            stockées uniquement dans votre navigateur et ne sont pas
            sauvegardées sur nos serveurs. Ce simulateur vous aide à visualiser
            votre impact écologique personnel et à contribuer à la préservation
            de l'environnement.
          </p>
        </div>
      </div>

      {/* Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {earnedBadges.map((badge: EcoBadge) => (
          <div
            key={badge.id}
            className="bg-green-50 p-4 rounded-lg text-center"
          >
            <div className="text-3xl mb-2">{badge.icon}</div>
            <h4 className="font-semibold">{badge.name}</h4>
            <p className="text-sm text-gray-600">{badge.description}</p>
          </div>
        ))}
      </div>

      {/* Historique */}
      <div className="bg-white rounded-lg shadow">
        <h3 className="font-semibold p-4 border-b text-cyan-600">
          Historique des lavages
        </h3>
        {washHistory.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Aucun lavage enregistré pour le moment
          </div>
        ) : (
          <div className="divide-y">
            {washHistory.map((wash) => (
              <div key={wash.id} className="p-4 hover:bg-blue-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">
                      {new Date(wash.date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {wash.washType} - {wash.duration} min
                    </p>
                    {wash.station && (
                      <p className="text-sm text-gray-500">
                        Station : {wash.station.name}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-green-600">-{wash.waterSaved}L</p>
                    <p className="text-sm text-gray-600">
                      {wash.ecoPoints} points
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
