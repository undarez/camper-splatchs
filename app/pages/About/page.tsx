"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";
import { Button } from "@/app/components/ui/button";
import { Metadata } from "next";

interface Stats {
  totalStations: number;
  totalUsers: number;
  totalParkings: number;
}

export const metadata: Metadata = {
  title:
    "À propos de SplashCamper | L'application de référence pour les camping-caristes",
  description:
    "Découvrez l'histoire de SplashCamper, créée par Florian Billard pour faciliter la vie des camping-caristes. Une application innovante née d'une passion pour le camping-car et le développement web.",
  keywords: [
    "SplashCamper histoire",
    "Florian Billard développeur",
    "application camping-car",
    "projet camping-car",
    "innovation camping-car",
    "communauté camping-car",
    "développement application",
    "services camping-caristes",
    "application mobile camping-car",
  ],
  openGraph: {
    title: "À propos de SplashCamper - Notre histoire et notre mission",
    description:
      "Découvrez comment SplashCamper révolutionne le quotidien des camping-caristes avec une application intuitive et complète.",
    images: [
      {
        url: "/images/imageperso.jpg",
        width: 1200,
        height: 630,
        alt: "Équipe SplashCamper",
      },
    ],
  },
};

export default function About() {
  const [stats, setStats] = useState<Stats>({
    totalStations: 0,
    totalUsers: 0,
    totalParkings: 0,
  });
  const [loading, setLoading] = useState(true);

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
        // En cas d'erreur, on garde les valeurs par défaut
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []); // Suppression de l'intervalle pour éviter les erreurs répétées

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            SplashCamper : Révolutionner le quotidien des camping-caristes
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            L'objectif est simple : faciliter la vie des camping-caristes en
            leur offrant une plateforme intuitive et complète pour trouver
            rapidement les services dont ils ont besoin, partout en France.
          </p>
        </div>

        {/* Notre mission et image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/images/imageperso.jpg"
              alt="Image personnelle"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              L'origine de l'idée
            </h2>
            <p className="text-gray-300">
              L'idée de SplashCamper est née d'une conversation avec mon père,
              Arnaud Billard, un passionné de camping-cars. Il m'a fait
              remarquer un problème évident : les stations de lavage adaptées
              aux camping-cars sont mal référencées et il est souvent difficile
              de les trouver rapidement. Inspiré par cette remarque et
              souhaitant apporter une solution pratique à un besoin réel, j'ai
              décidé de créer SplashCamper.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-blue-500 text-2xl font-bold mb-2">
                  {stats.totalStations > 0
                    ? `${stats.totalStations}+`
                    : "Chargement..."}
                </div>
                <div className="text-gray-300">Stations référencées</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-green-500 text-2xl font-bold mb-2">
                  {stats.totalUsers > 0
                    ? `${stats.totalUsers}+`
                    : "Chargement..."}
                </div>
                <div className="text-gray-300">Utilisateurs actifs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Nos services */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Ce que propose l'application actuellement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-500 mb-4 text-center">
                Localisation et détails
              </h3>
              <p className="text-gray-300 text-center">
                Accédez aux informations détaillées : services disponibles,
                moyens de paiement, photos du site, gonflage pneus, accès
                handicapé, et plus encore.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-500 mb-4 text-center">
                Navigation simplifiée
              </h3>
              <p className="text-gray-300 text-center">
                En un clic, établissez votre itinéraire vers la station choisie
                via votre application GPS favorite.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-yellow-500 mb-4 text-center">
                Calendrier personnel
              </h3>
              <p className="text-gray-300 text-center">
                Planifiez les entretiens de votre véhicule et ajoutez des notes
                personnelles sur l'état de votre camping-car.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-500 mb-4 text-center">
                Carte interactive
              </h3>
              <p className="text-gray-300 text-center">
                Localisez facilement les stations et services disponibles à
                proximité sur notre carte détaillée.
              </p>
            </div>
          </div>
        </div>

        {/* Futures évolutions */}
        <div className="bg-gray-800 p-8 rounded-lg mb-20">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Futures évolutions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-medium text-blue-400 mb-2">
                Forfaits personnalisés
              </h3>
              <p className="text-gray-300 text-sm">
                Options supplémentaires adaptées à chaque utilisateur
              </p>
            </div>
            <div className="p-4 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-medium text-green-400 mb-2">
                Version Premium
              </h3>
              <p className="text-gray-300 text-sm">
                Accès à une expérience sans publicités
              </p>
            </div>
            <div className="p-4 border border-gray-700 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-400 mb-2">
                Services collaboratifs
              </h3>
              <p className="text-gray-300 text-sm">
                Avis et recommandations entre membres
              </p>
            </div>
          </div>
          <div className="text-center text-gray-300">
            <p className="mb-4">
              Bientôt disponible sur Google Play ! Profitez de toutes les
              fonctionnalités directement depuis votre smartphone.
            </p>
          </div>
        </div>

        {/* À propos de moi */}
        <div className="bg-gray-800 p-8 rounded-lg mb-20">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Présentation de l'équipe
          </h2>
          <h3 className="text-xl font-semibold text-blue-400 mb-4">
            Florian Billard – Créateur et Gestionnaire de Contenu de
            l'Application
          </h3>
          <div className="text-gray-300 space-y-6">
            <p>
              Je m'appelle Florian Billard et je suis passionné par les
              technologies web et le développement d'applications. À l'âge de 30
              ans, j'ai découvert les langages informatiques tels que
              JavaScript, React, et bien d'autres, ce qui a marqué un tournant
              dans ma carrière.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <p>
                  Pour approfondir mes connaissances, j'ai suivi une formation
                  de niveau Bac+2 Intégrateur d'Applications Web sur
                  OpenClassrooms. Cette formation m'a permis d'acquérir des
                  compétences solides, notamment :
                </p>
              </div>
              <div className="relative w-32 h-32 flex-shrink-0">
                <Image
                  src="/images/blog_logo.jpg"
                  alt="Logo OpenClassrooms"
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded-lg"
                />
              </div>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li>L'apprentissage des bases : HTML, CSS, et Sass.</li>
              <li>
                La mise en œuvre des bonnes pratiques de SEO pour optimiser le
                référencement d'une maquette.
              </li>
              <li>Le développement avancé avec JavaScript et React.</li>
            </ul>
            <p>
              Depuis la fin de cette formation, je continue à me perfectionner
              en autodidacte, en explorant des technologies modernes telles que
              Next.js et TypeScript pour repousser les limites des applications
              web.
            </p>
            <p>
              Ma mission est de rendre l'application SplashCamper intuitive,
              pratique et enrichissante pour tous les utilisateurs, en
              m'assurant que le contenu reste clair, pertinent et à jour.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-blue-400 mt-8 mb-4">
            Notre Engagement
          </h3>
          <p className="text-gray-300 mb-6">
            Nous nous efforçons de proposer une expérience utilisateur optimale
            en combinant innovation, collaboration, et écoute des retours des
            utilisateurs. Si vous souhaitez en savoir plus ou avez des
            questions, n'hésitez pas à nous contacter.
          </p>
          <div className="flex justify-center">
            <Link href="/pages/Contact">
              <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
                Me Contacter
              </Button>
            </Link>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-blue-600 rounded-lg p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Pourquoi choisir SplashCamper ?
          </h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            SplashCamper est plus qu'une simple application : c'est une solution
            conçue par un camping-cariste, pour des camping-caristes. Avec un
            focus sur la simplicité, la communauté et l'efficacité, nous
            espérons rendre chaque voyage plus agréable et plus facile.
          </p>
          <Link href="/components/localisationStation2">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors duration-200">
              Commencer maintenant
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
