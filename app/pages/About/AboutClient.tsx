"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";

interface Stats {
  totalStations: number;
  totalUsers: number;
  totalParkings: number;
}

export default function AboutClient() {
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
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
          <Link href="/localisationStation2">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors duration-200">
              Commencer maintenant
            </button>
          </Link>
        </div>

        {/* Emplacement Google AdSense 1 */}
        <div className="my-8 text-center">
          <div
            id="splashcamper-about-ad-1"
            className="min-h-[250px] bg-gray-800 rounded-lg overflow-hidden mx-auto"
            style={{ maxWidth: "728px" }}
          >
            <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-VOTRE_ID_CLIENT"
            ></script>
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-VOTRE_ID_CLIENT"
              data-ad-slot="VOTRE_ID_EMPLACEMENT_1"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
          </div>
        </div>

        {/* Fonctionnalités à venir */}
        <div className="mt-20 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Fonctionnalités à venir
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-pink-500 mb-4 text-center">
                Système de récompenses
              </h3>
              <p className="text-gray-300 text-center">
                Gagnez des points en contribuant à la communauté : ajout de
                stations, avis, photos. Échangez vos points contre des
                récompenses exclusives.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-orange-500 mb-4 text-center">
                Réservation en ligne
              </h3>
              <p className="text-gray-300 text-center">
                Réservez votre créneau de lavage à l'avance dans les stations
                partenaires pour éviter l'attente et optimiser votre temps.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-teal-500 mb-4 text-center">
                Guide d'entretien personnalisé
              </h3>
              <p className="text-gray-300 text-center">
                Recevez des conseils d'entretien adaptés à votre véhicule et des
                rappels personnalisés pour maintenir votre camping-car en
                parfait état.
              </p>
            </div>
          </div>
        </div>

        {/* Emplacement Google AdSense 2 */}
        <div className="my-8 text-center">
          <div
            id="splashcamper-about-ad-2"
            className="min-h-[250px] bg-gray-800 rounded-lg overflow-hidden mx-auto"
            style={{ maxWidth: "728px" }}
          >
            <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-VOTRE_ID_CLIENT"
            ></script>
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-client="ca-pub-VOTRE_ID_CLIENT"
              data-ad-slot="VOTRE_ID_EMPLACEMENT_2"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
          </div>
        </div>

        {/* Notre vision */}
        <div className="bg-gray-800 p-8 rounded-lg mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            Notre Vision
          </h2>
          <p className="text-gray-300 text-lg text-center max-w-4xl mx-auto">
            Notre ambition est de faire de SplashCamper la référence
            incontournable pour tous les camping-caristes en France. Nous
            travaillons constamment à l'amélioration de nos services, à l'ajout
            de nouvelles fonctionnalités et à l'expansion de notre réseau de
            stations partenaires. Notre objectif est de créer une communauté
            active et engagée, où chaque membre contribue à enrichir
            l'expérience de tous.
          </p>
        </div>

        {/* Présentation de l'équipe */}
        <div className="bg-gray-800 p-8 rounded-lg mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            Présentation de l'équipe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-cyan-400">
                Florian Billard – Créateur et Gestionnaire de Contenu de
                l'Application
              </h3>
              <p className="text-gray-300">
                Je m'appelle Florian Billard et je suis passionné par les
                technologies web et le développement d'applications. À l'âge de
                30 ans, j'ai découvert les langages informatiques tels que
                JavaScript, React, et bien d'autres, ce qui a marqué un tournant
                dans ma carrière.
              </p>
              <p className="text-gray-300">
                Pour approfondir mes connaissances, j'ai suivi une formation de
                niveau Bac+2 Intégrateur d'Applications Web sur OpenClassrooms.
                Cette formation m'a permis d'acquérir des compétences solides,
                notamment :
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>L'apprentissage des bases : HTML, CSS, et Sass.</li>
                <li>
                  La mise en œuvre des bonnes pratiques de SEO pour optimiser le
                  référencement d'une maquette.
                </li>
                <li>Le développement avancé avec JavaScript et React.</li>
              </ul>
              <p className="text-gray-300">
                Depuis la fin de cette formation, je continue à me perfectionner
                en autodidacte, en explorant des technologies modernes telles
                que Next.js et TypeScript pour repousser les limites des
                applications web.
              </p>
              <p className="text-gray-300">
                Ma mission est de rendre l'application SplashCamper intuitive,
                pratique et enrichissante pour tous les utilisateurs, en
                m'assurant que le contenu reste clair, pertinent et à jour.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-8">
              <div className="relative w-full h-[200px]">
                <Image
                  src="/images/Blog_logo.jpg"
                  alt="Logo OpenClassrooms"
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded-lg"
                />
              </div>
              <div className="bg-gray-700 p-6 rounded-lg w-full">
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  Notre Engagement
                </h3>
                <p className="text-gray-300 text-center">
                  Nous nous efforçons de proposer une expérience utilisateur
                  optimale en combinant innovation, collaboration, et écoute des
                  retours des utilisateurs. Si vous souhaitez en savoir plus ou
                  avez des questions, n'hésitez pas à nous contacter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
