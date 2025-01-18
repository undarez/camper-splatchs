"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";
import Statistics from "@/app/components/Statistics";
import Image from "next/image";
import Services from "@/app/components/Services";
import PrivacyPolicyModal from "@/app/components/PrivacyPolicyModal";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { Button } from "@/app/components/ui/button";
import { Station, Service, Review } from "@prisma/client";
import StationCard from "@/app/components/StationCard";
import { useRouter } from "next/navigation";

interface StationWithDetails extends Station {
  services: Service | null;
  images: string[];
  parkingDetails: {
    isPayant: boolean;
    tarif: number | null;
    taxeSejour: number | null;
    hasElectricity: string;
    commercesProches: string[];
    handicapAccess: boolean;
    totalPlaces: number;
    hasWifi: boolean;
    hasChargingPoint: boolean;
    waterPoint: boolean;
    wasteWater: boolean;
    wasteWaterDisposal: boolean;
    blackWaterDisposal: boolean;
  } | null;
  reviews: Review[];
  averageRating?: number;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [latestStations, setLatestStations] = useState<StationWithDetails[]>(
    []
  );
  const { data: sessionData } = useSession();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Charger les dernières stations
    const fetchLatestStations = async () => {
      try {
        const response = await fetch("/api/stations/latest");
        if (response.ok) {
          const data = await response.json();
          setLatestStations(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des stations:", error);
      }
    };

    fetchLatestStations();
    return () => clearTimeout(timer);
  }, []);

  const hasFullAccess = () => {
    return !!sessionData?.user;
  };

  const handleLogin = () => {
    router.push("/signin");
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#1E2337]">
      <Head>
        <title>
          SplashCamper - Trouvez les meilleures stations de lavage pour
          camping-car en France
        </title>
        <meta
          name="description"
          content="Découvrez les stations de lavage pour camping-car près de chez vous. Localisez facilement les aires de service, points d'eau et stations adaptées aux grands gabarits partout en France."
        />
        <meta
          name="keywords"
          content="station lavage camping-car, aire de service camping-car, point eau camping-car, lavage camping-car France"
        />
        <meta
          property="og:title"
          content="SplashCamper - Stations de lavage pour camping-car"
        />
        <meta
          property="og:description"
          content="Trouvez facilement les stations de lavage adaptées à votre camping-car partout en France."
        />
        <meta property="og:image" content="/images/station-lavage.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {!hasFullAccess() && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 mb-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-full">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Mode Invité</p>
                <p className="text-sm text-white/80">
                  Connectez-vous pour accéder à toutes les fonctionnalités
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <PrivacyPolicyModal />

      {/* Hero Section */}
      <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/station-lavage.png"
            alt="Station de lavage pour camping-car en France"
            fill
            priority
            className="object-cover opacity-90"
            sizes="100vw"
            quality={100}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1f37]/70 via-[#1a1f37]/80 to-[#111827]" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold mb-8">
            <span className="bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 text-transparent bg-clip-text animate-gradient">
              SplashCamper
            </span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
            La plus grande base de données de stations de lavage pour
            camping-cars en France
          </p>
          <Button
            onClick={() => router.push("/pages/StationCard")}
            className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-bold py-6 px-8 rounded-lg text-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Découvrir les stations
          </Button>
        </div>
      </div>

      <Statistics />
      <Services />

      {/* Section des dernières stations */}
      <section className="py-16 px-4 bg-[#1E2337]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">
            Dernières stations ajoutées
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestStations.map((station) => (
              <div key={station.id} className="relative group">
                <StationCard station={station} />
                {!hasFullAccess() && (
                  <div className="absolute inset-0 bg-[#1E2337]/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-center p-4">
                      <p className="text-white text-lg mb-4">
                        Connectez-vous pour voir les détails
                      </p>
                      <Button
                        onClick={handleLogin}
                        className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white"
                      >
                        Se connecter gratuitement
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .animate-gradient {
            background-size: 200% auto;
            animation: gradient 3s linear infinite;
          }

          @keyframes gradient {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `,
        }}
      />
    </div>
  );
}
