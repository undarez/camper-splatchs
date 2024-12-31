"use client";

import Statistics from "@/app/components/Statistics";
import Image from "next/image";
import Services from "@/app/components/Services";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-[#1a1f37] to-[#111827]">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/station-lavage.png"
            alt="Station de lavage"
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
            Trouvez les meilleures stations de lavage pour votre camping-car
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

      {/* Statistics Section */}
      <Statistics />

      {/* Services Section */}
      <section className="py-20">
        <h2 className="text-4xl font-bold text-center text-white mb-12">
          Nos Services
        </h2>
        <Services />
      </section>
    </main>
  );
}
