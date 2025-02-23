"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { EcoCalculator } from "@/app/components/EcoCalculator";
import { EcoHistory } from "@/app/components/EcoHistory";
import {
  WashHistory,
  WashData,
  ExtendedSession,
} from "@/app/types/ecoConsumption";
import { toast } from "sonner";

interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  status: string;
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
  const supabase = createClientComponentClient();

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
        // Charger les stations actives
        const { data: stationsData, error: stationsError } = await supabase
          .from("stations")
          .select("id, name, address, city, status")
          .eq("status", "active")
          .eq("type", "STATION_LAVAGE");

        if (stationsError) throw stationsError;

        // Charger l'historique des lavages
        const { data: historyData, error: historyError } = await supabase
          .from("wash_history")
          .select(
            `
            *,
            station:stations(name)
          `
          )
          .eq("userId", session.user.id)
          .order("date", { ascending: false });

        if (historyError) throw historyError;

        setStations(stationsData || []);
        setWashHistory(historyData || []);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Une erreur est survenue lors du chargement des données");
        toast.error("Erreur de chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session, status, supabase]);

  const handleWashComplete = async (washData: WashData) => {
    if (!session?.user?.id || !selectedStation) {
      toast.error("Veuillez vous connecter et sélectionner une station");
      return;
    }

    try {
      const newWashData = {
        userId: session.user.id,
        stationId: selectedStation.id,
        ...washData,
        date: new Date().toISOString(),
      };

      const { data: newWash, error } = await supabase
        .from("wash_history")
        .insert([newWashData])
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour les points de l'utilisateur
      const { error: updateError } = await supabase
        .from("users")
        .update({
          ecoPoints: (session.user.ecoPoints || 0) + washData.ecoPoints,
        })
        .eq("id", session.user.id);

      if (updateError) throw updateError;

      setWashHistory((prev) => [newWash, ...prev]);
      toast.success("Lavage enregistré avec succès !");
    } catch (err) {
      console.error("Erreur lors de l'enregistrement:", err);
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
                  Cette fonctionnalité est actuellement en cours de
                  développement. Certaines options peuvent être limitées ou
                  indisponibles.
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
          </>
        )}
      </div>
    </div>
  );
}
