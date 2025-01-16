"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";
import Statistics from "@/app/components/Statistics";
import Image from "next/image";
import Services from "@/app/components/Services";
import Link from "next/link";
import PrivacyPolicyModal from "@/app/components/PrivacyPolicyModal";
import Head from "next/head";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
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

      <main className="bg-gradient-to-b from-[#1a1f37] to-[#111827]">
        <PrivacyPolicyModal />

        {/* Hero Section avec contenu SEO optimisé */}
        <div className="relative h-[600px] flex items-center justify-center">
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
            <div className="absolute inset-0 bg-gradient-to-b from-[#1a1f37]/50 via-[#1a1f37]/60 to-[#111827]" />
          </div>

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Bienvenue sur{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                SplashCamper
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed">
              La plus grande base de données de stations de lavage pour
              camping-cars en France
            </p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto">
              <Link href="/pages/StationCard">
                <span>Découvrir les stations</span>
              </Link>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <Statistics />
        <Services />
      </main>
    </>
  );
}
