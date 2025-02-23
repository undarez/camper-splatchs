"use client";

import Image from "next/image";
import Link from "next/link";

export default function LavatransHistoire() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* En-tête de l'article avec image */}
      <div className="relative w-full h-64 mb-8 rounded-xl overflow-hidden">
        <Image
          src="/images/article-lavatrans/lavatransicon-article.webp"
          alt="Lavatrans - Leader du lavage poids lourds et camping-cars"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h1 className="absolute bottom-6 left-6 text-3xl font-bold text-white">
          Lavatrans : L'histoire d'une entreprise innovante depuis 1987
        </h1>
      </div>

      {/* Introduction */}
      <p className="text-lg text-gray-600 mb-8">
        Aujourd'hui, je vais vous présenter dans cet article Lavatrans, une
        entreprise qui a le sens de l'originalité et s'est démarquée grâce à
        elle. Les transports routiers restent propres et responsables.
      </p>

      {/* Sections principales */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Fondation et débuts
        </h2>
        <p className="text-gray-600 mb-4">
          Lavatrans voit le jour en 1987 à Toulouse, grâce à l'initiative de
          Jean-Marie Collin. L'activité était alors centrée sur un concept
          novateur : le lavage de poids lourds directement au domicile des
          entreprises.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Premières étapes-clés
        </h2>
        <p className="text-gray-600 mb-4">
          Deux ans plus tard, en 1989, Lavatrans inaugure sa première station de
          lavage dédiée aux poids lourds, située stratégiquement sur le centre
          routier de Toulouse. L'innovation continue avec l'introduction, en
          1990, du forfait lavage à volonté, une révolution dans le secteur.
        </p>
        <div className="bg-blue-50 p-6 rounded-lg mb-4">
          <h3 className="text-xl font-semibold text-blue-800 mb-3">
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

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Des produits de qualité au service du lavage professionnel
        </h2>
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <p className="text-gray-600 mb-4">
            Forte de son expérience au contact des professionnels du transport
            depuis 1987, Lavatrans met également à votre disposition l'essentiel
            de ses produits et accessoires de lavage poids-lourds au sein de sa
            boutique en ligne, pour le plus grand plaisir des professionnels et
            particuliers !
          </p>
          <div className="flex justify-center mb-4">
            <Image
              src="/images/article-lavatrans/lavatrans-boutique.svg"
              alt="Boutique Lavatrans"
              width={200}
              height={100}
              className="object-contain"
            />
          </div>
          <Link
            href="https://boutique.lavatrans.com/"
            target="_blank"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Visitez la boutique Lavatrans
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Les articles indispensables pour le nettoyage
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pack complet camping-car */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Pack complet camping-car
            </h3>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>NETDRIVE | Shampoing carrosserie | bidon 5L</li>
              <li>Brosse articulée à passage d'eau souple VIKAN, 25cm</li>
              <li>Manche alu télescopique à passage d'eau</li>
              <li>Raclette Wipe-N-Shine, Vikan, 35 cm</li>
            </ul>
          </div>

          {/* Autres produits */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Produits spécialisés
            </h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>LAVPL | Shampoing carrosserie poids lourds</li>
              <li>NETDRIVE | Shampoing carrosserie tous véhicules</li>
              <li>LAVALU | Nettoyant et rénovateur alu</li>
              <li>NETLAV | Gamme de nettoyants spécialisés</li>
            </ul>
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
