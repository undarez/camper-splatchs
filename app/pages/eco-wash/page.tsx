"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { EcoCalculator } from "@/app/components/EcoCalculator";
import { EcoHistory } from "@/app/components/EcoHistory";
import { WashHistory } from "@/app/types/ecoConsumption";
import { Station } from "@/app/types/station";

interface ExtendedUser {
  id: string;
  total_eco_points?: number;
}

interface ExtendedSession {
  user: ExtendedUser;
}

export default function EcoWashPage() {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [washHistory, setWashHistory] = useState<WashHistory[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Charger les stations validées
    const loadStations = async () => {
      console.log("Chargement des stations...");
      try {
        const { data: stationsData, error } = await supabase
          .from("stations")
          .select("*")
          .eq("status", "ACTIVE")
          .eq("type", "STATION_LAVAGE");

        if (error) {
          console.error("Erreur lors du chargement des stations:", error);
          return;
        }

        if (stationsData) {
          console.log("Stations chargées:", stationsData);
          setStations(stationsData);
        } else {
          console.log("Aucune station trouvée");
        }
      } catch (error) {
        console.error("Erreur lors de la requête:", error);
      }
    };

    // Charger l'historique des lavages
    const loadWashHistory = async () => {
      if (!session?.user?.id) return;

      const { data: historyData, error } = await supabase
        .from("wash_history")
        .select(
          `
          *,
          station:stations(name)
        `
        )
        .eq("user_id", session.user.id)
        .order("date", { ascending: false });

      if (error) {
        console.error("Erreur lors du chargement de l'historique:", error);
      }

      if (historyData) {
        setWashHistory(historyData);
      }
    };

    loadStations();
    loadWashHistory();
  }, [session?.user?.id, supabase]);

  const handleWashComplete = async (
    washData: Omit<WashHistory, "id" | "date" | "userId" | "stationId">
  ) => {
    if (!session?.user?.id || !selectedStation) return;

    try {
      // Insérer le nouveau lavage
      const { data: newWash, error } = await supabase
        .from("wash_history")
        .insert([
          {
            user_id: session.user.id,
            station_id: selectedStation.id,
            ...washData,
          },
        ])
        .select(
          `
          *,
          station:stations(name)
        `
        )
        .single();

      if (error) throw error;

      // Mettre à jour les points de l'utilisateur
      const newTotalPoints =
        (session.user.total_eco_points || 0) + washData.ecoPoints;
      await supabase.auth.updateUser({
        data: {
          total_eco_points: newTotalPoints,
        },
      });

      // Mettre à jour l'historique localement avec le nouveau lavage
      if (newWash) {
        setWashHistory((prevHistory) => [newWash, ...prevHistory]);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du lavage:", error);
    }
  };

  if (!session) {
    return (
      <div className="p-6 bg-[#1E2337] min-h-screen">
        <div className="max-w-md mx-auto bg-[#252b43] p-8 rounded-lg shadow-lg border border-gray-700">
          <p className="text-gray-300 text-center">
            Veuillez vous connecter pour accéder à cette fonctionnalité.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E2337] p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Bannière de maintenance */}
        <div className="mb-8 bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-full">
            <svg
              className="w-6 h-6 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-yellow-500 font-semibold mb-1">
              Composant en construction
            </h3>
            <p className="text-yellow-200/80 text-sm">
              Cette fonctionnalité est actuellement en cours de développement.
              Certaines options peuvent être limitées ou indisponibles.
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
                const station = stations.find((s) => s.id === e.target.value);
                setSelectedStation(station || null);
              }}
              value={selectedStation?.id || ""}
            >
              <option value="" className="text-gray-300">
                Choisir une station
              </option>
              {stations.map((station) => (
                <option
                  key={station.id}
                  value={station.id}
                  className="text-white bg-[#2A3147]"
                >
                  {station.name} - {station.address}
                </option>
              ))}
            </select>
            {stations.length === 0 && (
              <p className="text-gray-300 text-sm italic">
                Aucune station de lavage disponible pour le moment.
              </p>
            )}
          </div>
        </div>

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
            <EcoHistory washHistory={washHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}
