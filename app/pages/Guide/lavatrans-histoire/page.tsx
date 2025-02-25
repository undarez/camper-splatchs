"use client";

import Image from "next/image";
import Link from "next/link";

export default function LavatransHistoire() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* En-tête de l'article avec image */}
      <div className="relative w-full h-48 sm:h-64 mb-6 sm:mb-8 rounded-xl overflow-hidden">
        <Image
          src="/images/article-lavatrans/lavatransicon-article.webp"
          alt="Lavatrans - Leader du lavage poids lourds et camping-cars"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h1 className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-2xl sm:text-3xl font-bold text-white px-2">
          Lavatrans : L'histoire d'une entreprise innovante depuis 1987
        </h1>
      </div>

      {/* Introduction */}
      <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
        Lavatrans voit le jour en 1987 à Toulouse, grâce à l'initiative de
        Jean-Marie Collin. L'activité était alors centrée sur un concept
        novateur : le lavage de poids lourds directement au domicile des
        entreprises. Depuis avril 2020, Jean-Marie Collin a passé les rênes à
        son fils Mathieu Collin qui est aujourd'hui le visage de Lavatrans et
        son Président.
      </p>

      {/* Photos des dirigeants */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-16 mb-8">
        <div className="w-1/2 flex flex-col items-center">
          <div className="relative w-64 h-64 rounded-full overflow-hidden">
            <Image
              src="/images/article-lavatrans/jeanmarie.jpeg"
              alt="Jean-Marie Collin - Fondateur de Lavatrans"
              fill
              className="object-cover"
            />
          </div>
          <p className="text-center italic mt-4 text-[#333333]">
            Jean-Marie Collin,
            <br />
            fondateur visionnaire de Lavatrans
          </p>
        </div>

        <div className="w-1/2 flex flex-col items-center">
          <div className="relative w-64 h-64 rounded-full overflow-hidden">
            <Image
              src="/images/article-lavatrans/mathieu-Collin.png"
              alt="Mathieu Collin - Président de Lavatrans"
              fill
              className="object-cover"
            />
          </div>
          <p className="text-center italic mt-4 text-[#333333]">
            Mathieu Collin,
            <br />
            Président actuel de Lavatrans
          </p>
        </div>
      </div>

      {/* Sections principales */}
      <section className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
          Fondation et débuts
        </h2>
        <p className="text-gray-600 mb-4">
          Lavatrans voit le jour en 1987 à Toulouse, grâce à l'initiative de
          Jean-Marie Collin. L'activité était alors centrée sur un concept
          novateur : le lavage de poids lourds directement au domicile des
          entreprises.
        </p>
      </section>

      <section className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
          Premières étapes-clés
        </h2>
        <p className="text-gray-600 mb-4">
          Deux ans plus tard, en 1989, Lavatrans inaugure sa première station de
          lavage dédiée aux poids lourds, située stratégiquement sur le centre
          routier de Toulouse. L'innovation continue avec l'introduction, en
          1990, du forfait lavage à volonté, une révolution dans le secteur.
        </p>
        <div className="bg-blue-50 p-4 sm:p-6 rounded-lg mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-3">
            Types d'abonnements proposés :
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              Le forfait lavage à volonté : pour un accès illimité aux stations.
            </li>
            <li>
              Le forfait pack : à prix fixe et forfaitaire, permettant aux
              camions d'être lavés dans tous les centres Lavatrans.
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Une présence nationale
        </h2>
        <p className="text-gray-600 mb-4">
          Lavatrans s'est développé à travers la France, comptant aujourd'hui 11
          stations de lavage accessibles aussi bien aux poids lourds qu'aux
          camping-cars.
        </p>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Quelques chiffres parlants :
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Plus de 75 000 lavages par an</li>
            <li>
              • Une cadence rapide : un camion est lavé toutes les 3 minutes
            </li>
            <li>
              • Une disponibilité exceptionnelle avec 55 heures d'ouverture par
              semaine
            </li>
          </ul>
        </div>
        <blockquote className="border-l-4 border-blue-500 pl-4 my-6 italic text-gray-700">
          « Roulez proprement, roulez écologiquement avec Lavatrans ! »
        </blockquote>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Un engagement pour l'environnement
        </h2>
        <p className="text-gray-600">
          Lavatrans attache une grande importance à la préservation de
          l'environnement. En effet, des véhicules lavés régulièrement polluent
          moins, contribuant ainsi à un transport plus responsable.
        </p>
      </section>

      <section className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          Des produits de qualité au service du lavage professionnel
        </h2>
        <div className="flex flex-col space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-gray-600 mb-4">
              Forte de son expérience au contact des professionnels du transport
              depuis 1987, Lavatrans met également à votre disposition
              l'essentiel de ses produits et accessoires de lavage poids-lourds
              au sein de sa boutique en ligne, pour le plus grand plaisir des
              professionnels et particuliers !
            </p>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="aspect-square relative">
                <Image
                  src="/images/article-lavatrans/lavatrans-boutique.svg"
                  alt="Boutique Lavatrans"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="aspect-square relative">
                <Image
                  src="/images/article-lavatrans/lavatrans-boutique.svg"
                  alt="Boutique Lavatrans"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="aspect-square relative">
                <Image
                  src="/images/article-lavatrans/lavatrans-boutique.svg"
                  alt="Boutique Lavatrans"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="aspect-square relative">
                <Image
                  src="/images/article-lavatrans/lavatrans-boutique.svg"
                  alt="Boutique Lavatrans"
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>
            <Link
              href="https://boutique.lavatrans.com/"
              target="_blank"
              className="inline-block w-full sm:w-auto text-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Visitez la boutique Lavatrans
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-8 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          Les articles indispensables pour le nettoyage
        </h2>
        {/* Conteneur avec défilement horizontal sur mobile */}
        <div className="flex overflow-x-auto pb-4 space-x-4 snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:gap-6 sm:space-x-0">
          {/* Pack complet camping-car */}
          <div className="flex-shrink-0 w-[280px] sm:w-auto snap-center">
            <div className="bg-white h-full p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Pack complet camping-car
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>NETDRIVE | Shampoing carrosserie | bidon 5L</li>
                <li>Brosse articulée à passage d'eau souple VIKAN, 25cm</li>
                <li>Manche alu télescopique à passage d'eau</li>
                <li>Raclette Wipe-N-Shine, Vikan, 35 cm</li>
              </ul>
            </div>
          </div>

          {/* Autres produits */}
          <div className="flex-shrink-0 w-[280px] sm:w-auto snap-center">
            <div className="bg-white h-full p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Produits spécialisés
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>LAVPL | Shampoing carrosserie poids lourds</li>
                <li>NETDRIVE | Shampoing carrosserie tous véhicules</li>
                <li>LAVALU | Nettoyant et rénovateur alu</li>
                <li>NETLAV | Gamme de nettoyants spécialisés</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Avis du Net sur Lavatrans
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Avis clients */}
          {[
            {
              title: "Service irréprochable !",
              content:
                "Les stations de lavage Lavatrans sont modernes et efficaces. Je suis impressionné par la rapidité du service et la qualité du nettoyage de mon camion.",
              author: "Utilisateur satisfait",
            },
            {
              title: "Rapidité et professionnalisme",
              content:
                "J'apprécie particulièrement la disponibilité et le professionnalisme des équipes Lavatrans.",
              author: "Client régulier",
            },
            {
              title: "Engagement écologique et qualité de service",
              content:
                "Lavatrans se distingue non seulement par la qualité de ses prestations, mais aussi par son engagement pour l'environnement.",
              author: "Propriétaire de camping-car",
            },
            {
              title: "Une offre complète",
              content:
                "De l'entretien à domicile aux stations de lavage, en passant par la boutique en ligne, Lavatrans propose une solution globale et professionnelle.",
              author: "Transporteur professionnel",
            },
          ].map((avis, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {avis.title}
              </h3>
              <p className="text-gray-600 mb-4">{avis.content}</p>
              <p className="text-sm text-gray-500 italic">- {avis.author}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
