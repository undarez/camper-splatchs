"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";

// Import dynamique pour éviter les erreurs SSR avec les APIs de navigateur
const NetworkStatus = dynamic(() => import("@/app/components/NetworkStatus"), {
  ssr: false,
});

const HomeClient = dynamic(() => import("@/app/pages/Home/page"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-blue-400">
            SplashCamper
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Votre application pour trouver les meilleurs points de lavage pour
            votre camping-car
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">
              Stations de lavage
            </h2>
            <p className="mb-6 text-gray-300">
              Trouvez des stations de lavage adaptées aux camping-cars près de
              vous.
            </p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/pages/MapView">Voir la carte</Link>
            </Button>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">
              Guide d'entretien
            </h2>
            <p className="mb-6 text-gray-300">
              Découvrez nos conseils pour l'entretien de votre camping-car.
            </p>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Link href="/pages/Guide">Consulter le guide</Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400">Version 1.0.2 - Application hybride</p>
        </div>
      </div>

      {/* Composant qui affiche une alerte quand l'appareil est hors ligne */}
      <NetworkStatus />
    </div>
  );
}
