"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Stats {
  totalStations: number;
  totalUsers: number;
  totalParkings: number;
}

export default function About() {
  const [stats, setStats] = useState<Stats>({
    totalStations: 0,
    totalUsers: 0,
    totalParkings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des statistiques:",
          error
        );
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Mise à jour toutes les 30 secondes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            À propos de SplashCamper
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Découvrez la première plateforme dédiée aux stations de lavage et
            parkings pour camping-cars en France.
          </p>
        </div>

        {/* Notre mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative h-[400px] rounded-lg overflow-hidden bg-gray-800">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Image à venir
                </h3>
                <p className="text-gray-300">
                  Notre équipe prépare du contenu visuel de qualité
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Notre Mission
            </h2>
            <p className="text-gray-300">
              SplashCamper est né d'une passion pour le voyage en camping-car et
              d'un constat simple : trouver une station de lavage adaptée ou un
              parking sécurisé peut être un véritable défi. Notre mission est de
              simplifier la vie des camping-caristes en leur permettant de
              localiser facilement les services adaptés à leurs besoins.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-blue-500 text-2xl font-bold mb-2">
                  {stats.totalStations}+
                </div>
                <div className="text-gray-300">Stations référencées</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-green-500 text-2xl font-bold mb-2">
                  {stats.totalUsers}+
                </div>
                <div className="text-gray-300">Utilisateurs actifs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Nos services */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Nos Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Stations de Lavage
              </h3>
              <p className="text-gray-300 text-center">
                Trouvez les stations de lavage adaptées à votre camping-car avec
                tous les détails sur les équipements disponibles.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Places de Parking
              </h3>
              <p className="text-gray-300 text-center">
                Localisez les parkings sécurisés pour votre camping-car avec les
                informations sur les services disponibles.
              </p>
            </div>
          </div>
        </div>

        {/* Évolutions à venir */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Prochaines Évolutions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-500 mb-2">
                Application Mobile
              </h3>
              <p className="text-sm text-gray-300">
                Accédez à SplashCamper depuis votre smartphone
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-500 mb-2">
                Réservation en ligne
              </h3>
              <p className="text-sm text-gray-300">
                Réservez votre place de parking à l'avance
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-500 mb-2">
                Programme de fidélité
              </h3>
              <p className="text-sm text-gray-300">
                Gagnez des points et des avantages
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-500 mb-2">
                Communauté
              </h3>
              <p className="text-sm text-gray-300">
                Partagez vos expériences et conseils
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}

        <div className="bg-blue-600 rounded-lg p-8 text-center">
          <Link href="/components/localisationStation2">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Rejoignez l'aventure SplashCamper
            </h2>
          </Link>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Contribuez à notre communauté en partageant vos découvertes et en
            aidant d'autres camping-caristes.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors duration-200">
            Commencer maintenant
          </button>
        </div>
      </div>
    </div>
  );
}
