"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { EcoCalculator } from "@/app/components/EcoCalculator";
import { EcoHistory } from "@/app/components/EcoHistory";
import {
  WashHistory,
  WashData,
  ExtendedSession,
} from "@/app/types/ecoConsumption";
import { toast } from "sonner";
import stationsData from "@/data/stations.json";
import Image from "next/image";

interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  status: string;
  type?: string;
  postalCode?: string;
  phoneNumber?: string;
  description?: string;
  images?: string[];
  latitude?: number;
  longitude?: number;
  services?: {
    highPressure?: string;
    tirePressure?: boolean;
    vacuum?: boolean;
    waterPoint?: boolean;
    wasteWater?: boolean;
    paymentMethods?: string[];
  };
}

export default function EcoWashPage() {
  const { data: session, status } = useSession() as {
    data: ExtendedSession | null;
    status: string;
  };
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [washHistory, setWashHistory] = useState<WashHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Charger les stations depuis le fichier JSON
        const filteredStations = stationsData.stations.filter(
          (station) =>
            station.status === "active" && station.type === "STATION_LAVAGE"
        );

        // Utiliser un Set pour stocker les IDs uniques des stations
        const stationIds = new Set();
        const uniqueStations = filteredStations.filter((station) => {
          if (stationIds.has(station.id)) {
            return false;
          }
          stationIds.add(station.id);
          return true;
        });

        setStations(uniqueStations);

        // Charger l'historique des lavages via NextAuth API
        try {
          console.log("Chargement de l'historique via NextAuth API");

          const response = await fetch("/api/eco-wash/get-history");

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.error || "Erreur lors du chargement de l'historique"
            );
          }

          const data = await response.json();

          if (data.success && data.washHistory) {
            setWashHistory(data.washHistory);
          } else {
            setWashHistory([]);
          }
        } catch (apiError) {
          console.error("Erreur lors de l'appel à l'API NextAuth:", apiError);
          toast.error("Impossible de charger l'historique des lavages.");
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Une erreur est survenue lors du chargement des données");
        toast.error("Erreur de chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session, status]);

  const handleWashComplete = async (washData: WashData) => {
    if (!session?.user?.id || !selectedStation) {
      toast.error("Veuillez vous connecter et sélectionner une station");
      return;
    }

    try {
      // Enregistrer via NextAuth API
      toast.loading("Enregistrement du lavage...");

      // Utiliser l'API NextAuth pour enregistrer l'historique
      try {
        const response = await fetch("/api/eco-wash/save-history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stationId: selectedStation.id,
            stationName: selectedStation.name,
            stationAddress: selectedStation.address,
            stationCity: selectedStation.city,
            stationPostalCode: selectedStation.postalCode || "",
            stationPhoneNumber: selectedStation.phoneNumber || "",
            stationLatitude: selectedStation.latitude || 0,
            stationLongitude: selectedStation.longitude || 0,
            washType: washData.washType,
            vehicleSize: washData.vehicleSize,
            duration: washData.duration,
            waterUsed: washData.waterUsed,
            waterSaved: washData.waterSaved,
            ecoPoints: washData.ecoPoints,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Erreur lors de l'enregistrement de l'historique"
          );
        }

        console.log("Historique enregistré avec succès via NextAuth API");

        // Mettre à jour les points via l'API NextAuth
        await fetch("/api/user/update-points", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pointsToAdd: washData.ecoPoints }),
        });

        toast.dismiss();
        toast.success("Lavage enregistré avec succès !");

        // Convertir les données reçues en format attendu par l'application
        const newWash: WashHistory = {
          id: result.washHistory.id,
          userId: result.washHistory.userId,
          stationId: result.washHistory.stationId,
          washType: result.washHistory.washType,
          vehicleSize: result.washHistory.vehicleSize as
            | "small"
            | "medium"
            | "large",
          duration: result.washHistory.duration,
          waterUsed: result.washHistory.waterUsed,
          waterSaved: result.washHistory.waterSaved,
          ecoPoints: result.washHistory.ecoPoints,
          date: result.washHistory.date,
          station: { name: selectedStation.name },
        };

        setWashHistory((prev) => [newWash, ...prev]);
      } catch (apiError) {
        console.error("Erreur lors de l'appel à l'API NextAuth:", apiError);
        toast.dismiss();
        toast.error("Erreur lors de l'enregistrement du lavage");
      }
    } catch (err) {
      console.error("Erreur lors de l'enregistrement:", err);
      toast.dismiss();
      toast.error("Erreur lors de l'enregistrement du lavage");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#1E2337] p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#1E2337] p-6">
        <div className="max-w-md mx-auto bg-[#252b43] p-8 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Accès restreint</h2>
          <p className="text-gray-300">
            Veuillez vous connecter pour accéder au suivi de votre éco-lavage.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E2337] p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-full">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <>
            {/* Bannière de maintenance */}
            <div className="mb-8 bg-green-500/10 border border-green-500/50 rounded-lg p-4 flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-full">
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-green-500 font-semibold mb-1">
                  Fonctionnalité disponible
                </h3>
                <p className="text-green-200/80 text-sm">
                  La fonctionnalité d'éco-lavage est maintenant disponible.
                  Sélectionnez une station pour commencer.
                </p>
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">
              Éco-Lavage
            </h1>

            {/* Sélection de la station */}
            <div className="bg-[#252b43] p-6 rounded-lg shadow-lg border border-gray-700/50">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Sélectionnez une station
              </h2>
              <div className="space-y-4">
                <select
                  className="w-full p-3 bg-[#2A3147] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  onChange={(e) => {
                    const station = stations.find(
                      (s) => s.id === e.target.value
                    );
                    setSelectedStation(station || null);
                  }}
                  value={selectedStation?.id || ""}
                >
                  <option value="" className="text-gray-300">
                    Choisir une station
                  </option>
                  {(() => {
                    const uniqueIds = new Set();
                    return stations
                      .filter((station) => {
                        if (uniqueIds.has(station.id)) return false;
                        uniqueIds.add(station.id);
                        return true;
                      })
                      .map((station) => (
                        <option
                          key={station.id}
                          value={station.id}
                          className="text-white bg-[#2A3147]"
                        >
                          {station.name} - {station.address}, {station.city}
                        </option>
                      ));
                  })()}
                </select>
                {stations.length === 0 && (
                  <p className="text-gray-300 text-sm italic">
                    Aucune station de lavage disponible pour le moment.
                  </p>
                )}
              </div>
            </div>

            {/* Détails de la station sélectionnée */}
            {selectedStation && (
              <div className="bg-[#252b43] p-6 rounded-lg shadow-lg border border-gray-700/50 mt-8">
                <h2 className="text-xl font-semibold mb-4 text-white">
                  Détails de la station
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {selectedStation.images &&
                      selectedStation.images.length > 0 && (
                        <div className="mb-4 overflow-hidden rounded-lg relative h-48">
                          <Image
                            src={selectedStation.images[0]}
                            alt={selectedStation.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                            priority
                          />
                        </div>
                      )}
                    <h3 className="text-lg font-medium text-cyan-400 mb-2">
                      {selectedStation.name}
                    </h3>
                    <p className="text-gray-300 mb-2">
                      {selectedStation.address}, {selectedStation.city}
                      {selectedStation.postalCode &&
                        ` - ${selectedStation.postalCode}`}
                    </p>
                    {selectedStation.phoneNumber && (
                      <p className="text-gray-300 mb-4">
                        <span className="text-cyan-400">Téléphone:</span>{" "}
                        {selectedStation.phoneNumber}
                      </p>
                    )}
                    {selectedStation.description && (
                      <div className="mb-4">
                        <h4 className="text-cyan-400 text-sm font-medium mb-1">
                          Description:
                        </h4>
                        <p className="text-gray-300 text-sm">
                          {selectedStation.description}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-cyan-400 text-sm font-medium mb-2">
                      Services disponibles:
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      {selectedStation.services?.highPressure && (
                        <li className="flex items-center">
                          <svg
                            className="w-4 h-4 text-green-400 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Lavage haute pression (
                          {selectedStation.services.highPressure})
                        </li>
                      )}
                      {selectedStation.services?.tirePressure && (
                        <li className="flex items-center">
                          <svg
                            className="w-4 h-4 text-green-400 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Gonflage des pneus
                        </li>
                      )}
                      {selectedStation.services?.vacuum && (
                        <li className="flex items-center">
                          <svg
                            className="w-4 h-4 text-green-400 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Aspirateur
                        </li>
                      )}
                      {selectedStation.services?.waterPoint && (
                        <li className="flex items-center">
                          <svg
                            className="w-4 h-4 text-green-400 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Point d'eau
                        </li>
                      )}
                      {selectedStation.services?.wasteWater && (
                        <li className="flex items-center">
                          <svg
                            className="w-4 h-4 text-green-400 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Traitement des eaux usées
                        </li>
                      )}
                    </ul>
                    {selectedStation.services?.paymentMethods && (
                      <div className="mt-4">
                        <h4 className="text-cyan-400 text-sm font-medium mb-1">
                          Moyens de paiement:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedStation.services.paymentMethods.map(
                            (method, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-[#1E2337] text-xs rounded-md text-gray-300"
                              >
                                {method === "CARTE_BANCAIRE"
                                  ? "Carte bancaire"
                                  : method === "ESPECES"
                                  ? "Espèces"
                                  : method === "JETON"
                                  ? "Jetons"
                                  : method}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Calculateur d'éco-consommation */}
            {selectedStation && (
              <div className="bg-[#252b43] p-6 rounded-lg shadow-lg border border-gray-700/50 mt-8">
                <h2 className="text-xl font-semibold mb-4 text-white">
                  Calculer votre consommation
                </h2>
                <EcoCalculator onWashComplete={handleWashComplete} />
              </div>
            )}

            {/* Historique et badges */}
            <div className="bg-[#252b43] p-6 rounded-lg shadow-lg border border-gray-700/50 mt-8">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Votre historique
              </h2>
              <div className="text-gray-100">
                {washHistory.length > 0 ? (
                  <EcoHistory washHistory={washHistory} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-2">
                      Aucun historique de lavage disponible
                    </p>
                    <p className="text-gray-500 text-sm">
                      Vos lavages apparaîtront ici une fois que vous aurez
                      utilisé le calculateur d'éco-consommation.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
