"use client";

import { useEffect, useState } from "react";
import { Users, Star, MapPin } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";

export default function Statistics() {
  const [stats, setStats] = useState({
    stations: 17,
    users: 3,
    reviews: 0,
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data, error } = await supabase.rpc("get_public_stats");

        if (error) {
          console.error("Erreur RPC:", error);
          return;
        }

        if (data) {
          setStats({
            stations: data.stations_count || 17,
            users: data.users_count || 3,
            reviews: data.reviews_count || 0,
          });
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des statistiques:",
          error
        );
      }
    }

    fetchStats();
  }, [supabase]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto px-4 py-12">
      <div className="bg-[#1a1f37] rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
        <div className="flex justify-center mb-4">
          <MapPin className="w-12 h-12 text-blue-400" />
        </div>
        <div className="text-5xl font-bold mb-2 text-white">
          {stats.stations}+
        </div>
        <Link href="/pages/StationCard">
          <div className="text-blue-200 text-lg">Stations référencées</div>
        </Link>
      </div>

      <div className="bg-[#1a1f37] rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
        <div className="flex justify-center mb-4">
          <Users className="w-12 h-12 text-blue-400" />
        </div>
        <div className="text-5xl font-bold mb-2 text-white">{stats.users}+</div>
        <div className="text-blue-200 text-lg">Utilisateurs actifs</div>
      </div>

      <div className="bg-[#1a1f37] rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
        <div className="flex justify-center mb-4">
          <Star className="w-12 h-12 text-blue-400" />
        </div>
        <div className="text-5xl font-bold mb-2 text-white">
          {stats.reviews}+
        </div>
        <div className="text-blue-200 text-lg">Avis vérifiés</div>
      </div>
    </div>
  );
}
