"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Statistics from "@/app/components/Statistics";
import Services from "@/app/components/Services";
import PrivacyPolicyModal from "@/app/components/PrivacyPolicyModal";
import { Button } from "@/app/components/ui/button";
import { StationWithDetails } from "@/app/types/station";
import dynamic from "next/dynamic";
import { Skeleton } from "@/app/components/ui/skeleton";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";

const StationCard = dynamic(() => import("@/app/components/StationCard"), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full rounded-lg" />,
});

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
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
        const response = await fetch("/api/stations/latest", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setLatestStations(data.slice(0, 3)); // Limiter aux 3 dernières stations
        } else {
          console.error(
            "Erreur lors du chargement des stations:",
            response.status
          );
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

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await router.push("/signin");
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading || isLoggingIn) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#1E2337]">
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

      {/* Hero Section avec image de fond */}
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
          <div className="space-y-6">
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Trouvez facilement les meilleures stations adaptées à votre
              véhicule, avec tous les services dont vous avez besoin
            </p>
          </div>
          <Button
            onClick={() => router.push("/pages/StationCard")}
            className="mt-8 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-bold py-6 px-8 rounded-lg text-xl transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Découvrir les stations
          </Button>
        </div>
      </div>

      {/* Section Statistiques */}
      <div className="relative z-10 -mt-20">
        <Statistics />
      </div>

      {/* Section Services */}
      <div className="py-16">
        <Services />
      </div>

      {/* Section SEO stylisée */}
      <div className="relative z-10 py-20 bg-gradient-to-b from-[#1E2337] to-[#1a1f37]">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Google AdSense 1 */}
          <div
            id="google-ads-1"
            className="w-full mb-12 flex items-center justify-center rounded-lg overflow-hidden"
          >
            <Link
              href="https://boutique.lavatrans.com/"
              target="_blank"
              className="w-full"
            >
              <Image
                src="/images/article-lavatrans/banniere-lavatrans-promo.png"
                alt="Boutique Lavatrans - Produits de lavage pour véhicules"
                width={1200}
                height={250}
                className="w-full h-auto object-cover rounded-lg hover:opacity-95 transition-opacity"
                priority
              />
            </Link>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">
            Station de lavage camping-car en France
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-[#252b43] p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-6 text-cyan-400">
                Trouvez la station idéale
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                SplashCamper vous aide à localiser les meilleures stations de
                lavage adaptées aux camping-cars. Notre plateforme recense les
                installations spécialement conçues pour les grands gabarits,
                vous permettant de laver votre camping-car en toute sérénité.
              </p>
              <ul className="space-y-3">
                {[
                  "Stations de lavage camping-car autour de vous",
                  "Points d'eau et aires de service",
                  "Équipements adaptés aux grands véhicules",
                  "Informations détaillées et mises à jour",
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 mr-3 text-cyan-500"
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
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#252b43] p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-6 text-cyan-400">
                Services disponibles
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Notre application vous permet de trouver facilement tous les
                services nécessaires pour l'entretien de votre camping-car.
                Découvrez une sélection complète d'installations adaptées à vos
                besoins.
              </p>
              <ul className="space-y-3">
                {[
                  "Portiques de lavage grand gabarit",
                  "Aires de service complètes",
                  "Points de vidange eaux usées",
                  "Stations haute pression adaptées",
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 mr-3 text-cyan-500"
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
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Section des dernières stations */}
      <section className="py-16 px-4 bg-[#1E2337]">
        <div className="max-w-7xl mx-auto">
          {/* Section Google AdSense 2 - Bannière Delisle */}
          <div
            id="google-ads-2"
            className="w-full mb-12 flex items-center justify-center rounded-lg overflow-hidden"
          >
            <Link
              href="https://www.delisle-sa.com"
              target="_blank"
              className="w-full transform hover:scale-[1.02] transition-all duration-300"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-cyan-500/30 group-hover:opacity-0 transition-opacity duration-300 rounded-lg"></div>
                <Image
                  src="/images/delisle-article/Delisle-banniere-partenaire.png"
                  alt="Delisle - Partenaire officiel pour le lavage de camping-cars"
                  width={1200}
                  height={250}
                  className="w-full h-auto object-cover rounded-lg shadow-lg shadow-blue-900/20"
                  priority
                />
                <div className="absolute top-0 left-0 bg-gradient-to-r from-blue-600/90 to-blue-600/70 px-4 py-3 rounded-tl-lg rounded-br-lg shadow-md transform -translate-y-1 -translate-x-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
                  <div className="flex items-center">
                    <span className="animate-pulse text-yellow-300 mr-2">
                      🚿
                    </span>
                    <p className="text-white font-bold text-sm md:text-base">
                      19 nouvelles stations disponibles grâce à notre nouveau
                      partenaire !
                    </p>
                    <span className="animate-pulse text-yellow-300 ml-2">
                      ⭐
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-white/90 px-3 py-1 rounded-full text-blue-800 font-semibold text-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Découvrir Delisle →
                </div>
              </div>
            </Link>
          </div>

          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">
            Dernières stations ajoutées
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Suspense fallback={<div>Chargement...</div>}>
              {latestStations.map((station) => (
                <div key={station.id} className="relative group">
                  <div className={!hasFullAccess() ? "blur-sm" : ""}>
                    <StationCard station={station} />
                  </div>
                  {!hasFullAccess() && (
                    <div className="absolute inset-0 bg-[#1E2337]/80 backdrop-blur-sm flex items-center justify-center opacity-100">
                      <div className="text-center p-4">
                        <p className="text-white text-lg mb-4">
                          Connectez-vous pour voir les détails
                        </p>
                        <Button
                          onClick={handleLogin}
                          disabled={isLoggingIn}
                          className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white"
                        >
                          {isLoggingIn ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Redirection...
                            </>
                          ) : (
                            "Se connecter gratuitement"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </Suspense>
          </div>
          <div className="flex justify-center mt-8">
            <div className="relative group">
              <div className={!hasFullAccess() ? "blur-sm" : ""}>
                <Link href="/pages/StationCard">
                  <Button className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    Voir toutes les stations
                  </Button>
                </Link>
              </div>
              {!hasFullAccess() && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    onClick={handleLogin}
                    disabled={isLoggingIn}
                    className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    {isLoggingIn ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Redirection...
                      </>
                    ) : (
                      "Se connecter pour accéder"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Section Google AdSense 3 */}
          <div
            id="google-ads-3"
            className="w-full h-[250px] bg-[#252b43] mt-12 flex items-center justify-center rounded-lg"
          >
            <div className="text-center">
              <p className="text-gray-400">Espace publicitaire</p>
              <p className="text-xs text-gray-500">Advertisement</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section éco-lavage */}
      <section className="py-16 bg-gradient-to-b from-[#1E2337] to-[#252b43]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">
                Lavez écologique, gagnez des récompenses !
              </h2>
              <p className="text-lg text-gray-300">
                Découvrez notre nouveau système d'éco-lavage qui vous permet de
                suivre et réduire votre impact environnemental.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 text-gray-300">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2A3147]">
                    💧
                  </span>
                  <span>Suivre votre consommation d'eau en temps réel</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-300">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2A3147]">
                    🌱
                  </span>
                  <span>Réduire votre impact environnemental</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-300">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2A3147]">
                    🏆
                  </span>
                  <span>Gagner des badges écologiques</span>
                </li>
                <li className="flex items-center space-x-3 text-gray-300">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2A3147]">
                    📊
                  </span>
                  <span>Visualiser vos économies d'eau</span>
                </li>
              </ul>

              {/* Explication du calcul */}
              <div className="mt-6 p-4 bg-[#2A3147] rounded-lg border border-cyan-800/30">
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                  Comment ça marche ?
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  Notre système calcule vos économies d'eau en comparant votre
                  consommation à celle d'un lavage traditionnel :
                </p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start space-x-2">
                    <svg
                      className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <span>Lavage traditionnel : environ 200L d'eau</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg
                      className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <span>
                      Calcul basé sur : type de lavage, taille du véhicule et
                      durée
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg
                      className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <span>1 point éco = 10L d'eau économisés</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/pages/eco-wash"
                className="inline-block bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-900/20"
              >
                Commencer à économiser
              </Link>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E2337]/80 to-transparent z-10" />
              <Image
                src="/images/eco-wash-hero.webp"
                alt="Éco-lavage de camping-car"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `          .animate-gradient {
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
