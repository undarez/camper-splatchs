"use client";

import Image from "next/image";
import Link from "next/link";

export default function DelisleHistoire() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8 text-gray-700">
      {/* En-tête de l'article avec image */}
      <div className="relative w-full h-48 sm:h-64 mb-6 sm:mb-8 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/images/delisle-article/delisle-lavage.jpeg"
            alt="Delisle Transport - Logo"
            width={200}
            height={200}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-2xl sm:text-3xl font-bold text-white px-2">
          Delisle Transport : Une Référence en Logistique et Lavage
        </h1>
      </div>

      {/* Section Histoire */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
          Une Histoire de Croissance et d'Engagement
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          La Naissance d'un Leader
        </h3>
        <p className="mb-4">
          Fondée le 1er janvier 1979, la société{" "}
          <strong>Delisle Logistique</strong> s'est imposée comme un acteur
          majeur du transport routier de fret interurbain. Dotée du statut de{" "}
          <strong>SAS (Société par Actions Simplifiée)</strong>, elle a su
          évoluer et s'adapter aux exigences du secteur. En 2022, Delisle
          Logistique a atteint le statut d'
          <strong>Entreprise de Taille Intermédiaire</strong>, confirmant ainsi
          sa croissance.
        </p>
        <p className="mb-6">
          Depuis 1994, le groupe a obtenu plusieurs certifications attestant de
          son engagement en matière de qualité et de satisfaction client. Ces
          distinctions lui ont permis de <strong>fidéliser sa clientèle</strong>{" "}
          et d'attirer de nouveaux partenaires.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="w-full sm:w-auto">
            <Image
              src="/images/delisle-article/certificat.png"
              alt="Certificat Delisle"
              width={300}
              height={200}
              className="rounded-lg shadow-md object-contain mx-auto"
            />
          </div>
          <div className="w-full sm:w-auto">
            <Image
              src="/images/delisle-article/label.png"
              alt="Label Delisle"
              width={300}
              height={200}
              className="rounded-lg shadow-md object-contain mx-auto"
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Une Direction Dynamique
        </h3>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
          <div className="w-full md:w-1/3">
            <Image
              src="/images/delisle-article/jonathan-delisle.webp"
              alt="Jonathan Delisle - Directeur"
              width={300}
              height={400}
              className="rounded-lg shadow-md object-cover mx-auto"
            />
          </div>
          <div className="w-full md:w-2/3">
            <p className="mb-4">
              Le 1er juillet 2017, <strong>Jonathan Delisle</strong> a repris
              les rênes de l'entreprise en tant que Directeur et actionnaire
              principal.
            </p>
            <p className="mb-4">
              Sous sa direction, le groupe a{" "}
              <strong>doublé son activité</strong> et a réalisé{" "}
              <strong>35 opérations de croissance externe</strong> en 40 ans
              d'existence. Parmi ces acquisitions, on note notamment celle du{" "}
              <strong>transport Antoine en 2021</strong>.
            </p>
            <p className="font-semibold text-orange-600">
              Plus récemment, en{" "}
              <strong>2024, Delisle a été élu transporteur de l'année</strong>,
              une distinction qui récompense son engagement et son
              professionnalisme.
            </p>
          </div>
        </div>
      </section>

      {/* Section Réseau */}
      <section className="mb-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Un Réseau de Stations en Pleine Expansion
        </h2>
        <p className="mb-4">
          Le groupe <strong>Delisle Logistique</strong> possède actuellement{" "}
          <strong>24 stations</strong> réparties sur l'ensemble du territoire
          français.
        </p>
        <div className="text-center mb-4">
          <Link
            href="/localisationStation2"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Voir la carte des stations
          </Link>
        </div>
        <p className="text-sm text-gray-600 text-center">
          Une carte interactive est mise à disposition des utilisateurs pour
          localiser facilement les stations disponibles.
        </p>
      </section>

      {/* Section Services */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
          Des Services de Lavage Adaptés aux Professionnels
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Un Large Éventail de Prestations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <Image
              src="/images/delisle-article/lavageint-fill.jpeg"
              alt="Lavage intérieur"
              width={400}
              height={300}
              className="rounded-lg mb-3 w-full object-cover h-48"
            />
            <h4 className="font-semibold text-lg mb-2">Lavage intérieur</h4>
            <p>Citernes, bennes, frigos</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <Image
              src="/images/delisle-article/Lav_ext-fil.jpg"
              alt="Lavage extérieur"
              width={400}
              height={300}
              className="rounded-lg mb-3 w-full object-cover h-48"
            />
            <h4 className="font-semibold text-lg mb-2">Lavage extérieur</h4>
            <p>Poids-lourds, utilitaires, camping-cars</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <Image
              src="/images/delisle-article/npfood-fil.jpg"
              alt="Lavage de GRV"
              width={400}
              height={300}
              className="rounded-lg mb-3 w-full object-cover h-48"
            />
            <h4 className="font-semibold text-lg mb-2">Lavage de GRV</h4>
            <p>Notamment pour le secteur alimentaire</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <Image
              src="/images/delisle-article/rechauffage-fil.jpg"
              alt="Réchauffage de citerne"
              width={400}
              height={300}
              className="rounded-lg mb-3 w-full object-cover h-48"
            />
            <h4 className="font-semibold text-lg mb-2">
              Réchauffage de citerne
            </h4>
            <p>Pour les besoins spécifiques</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Un Modèle de Lavage Intérieur Innovant
        </h3>

        <div className="bg-orange-50 p-6 rounded-lg mb-6">
          <p className="mb-4">
            Delisle Lavage propose un service de{" "}
            <strong>lavage intérieur à domicile ou en station</strong>,
            notamment dans le secteur de <strong>La Ferté-Gaucher</strong>.
          </p>
          <p className="mb-4 font-semibold text-orange-700">
            Un <strong>déplacement gratuit</strong> est offert dans un rayon de{" "}
            <strong>25 km</strong> autour de cette localité.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-6">
            <div className="w-full sm:w-auto">
              <Image
                src="/images/delisle-article/lavage-interieur.png"
                alt="Lavage intérieur"
                width={300}
                height={200}
                className="rounded-lg shadow-md object-contain mx-auto"
              />
            </div>
            <div className="w-full sm:w-auto">
              <Image
                src="/images/delisle-article/lavage-exterieur.png"
                alt="Lavage extérieur"
                width={300}
                height={200}
                className="rounded-lg shadow-md object-contain mx-auto"
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <a
            href="https://delisle-lavage.com/auto.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Découvrir les formules disponibles
          </a>
        </div>
      </section>

      {/* Section Fidélité */}
      <section className="mb-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Un Programme de Fidélité Attractif
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/3">
            <Image
              src="/images/delisle-article/cadeau-fidelite.png"
              alt="Programme de fidélité"
              width={300}
              height={300}
              className="rounded-lg shadow-md object-contain mx-auto"
            />
          </div>

          <div className="w-full md:w-2/3">
            <p className="mb-4">
              Delisle Lavage récompense ses clients fidèles avec un système de{" "}
              <strong>points cumulables</strong> :
            </p>

            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>
                <strong>1 lavage = 3 points</strong>
              </li>
              <li>
                Une fois un certain seuil atteint, les clients peuvent{" "}
                <strong>réserver des cadeaux</strong>.
              </li>
            </ul>

            <p className="mb-4">
              Les cadeaux peuvent être récupérés dans plusieurs stations,
              notamment :
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              <li className="flex items-center">
                <span className="mr-2">•</span> La Ferté-Gaucher (77)
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span> Claye-Souilly (77)
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span> Saran (45)
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span> Lillebonne (76)
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span> Bollène (84)
              </li>
              <li className="flex items-center">
                <span className="mr-2">•</span> Verdun (55)
              </li>
            </ul>

            <div className="text-center">
              <a
                href="https://delisle-lavage.com/loyalty.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Consulter le programme fidélité
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section Hygiène et Environnement */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
          Une Priorité : L'Hygiène et l'Environnement
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Engagement en Matière d'Hygiène
        </h3>

        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
          <div className="w-full md:w-2/3">
            <p className="mb-4">
              L'hygiène est une <strong>priorité absolue</strong> pour Delisle.
              Chaque conducteur et opérateur est formé aux{" "}
              <strong>bonnes pratiques d'entretien des véhicules</strong> afin
              d'assurer la <strong>sécurité alimentaire</strong> des produits
              transportés.
            </p>
            <p className="mb-4">
              Sur chaque station de lavage, un{" "}
              <strong>indicateur de CO²</strong> est disponible pour informer
              les clients sur leur impact environnemental.
            </p>
            <div className="text-center mt-6">
              <a
                href="https://delisle-lavage.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                En savoir plus
              </a>
            </div>
          </div>

          <div className="w-full md:w-1/3">
            <Image
              src="/images/delisle-article/emissionc02.png"
              alt="Indicateur CO2"
              width={300}
              height={300}
              className="rounded-lg shadow-md object-contain mx-auto"
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Un Traitement des Eaux Innovant
        </h3>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/3">
            <Image
              src="/images/delisle-article/station-traitement.png"
              alt="Station de traitement des effluents"
              width={300}
              height={300}
              className="rounded-lg shadow-md object-contain mx-auto"
            />
          </div>

          <div className="w-full md:w-2/3">
            <p className="mb-4">
              Depuis <strong>2023</strong>, Delisle a installé une{" "}
              <strong>station de traitement des effluents industriels</strong> à
              Connantre.
            </p>
            <p className="mb-4">
              Cette station permet le lavage de citernes et cuves contenant des
              produits sensibles tout en respectant les règles de{" "}
              <strong>non-pollution</strong>.
            </p>
            <div className="text-center mt-6">
              <a
                href="https://cohin-environnement.com/station-de-traitement-des-effluents-industrielles/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                En savoir plus sur le traitement des eaux
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section Sécurité */}
      <section className="mb-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          La Sécurité Avant Tout
        </h2>

        <p className="mb-6">
          Delisle Logistique met un point d'honneur à garantir la{" "}
          <strong>sécurité</strong> de ses opérateurs et de ses clients :
        </p>

        <ul className="space-y-3 mb-6">
          <li className="flex items-start">
            <span className="text-orange-500 mr-2">✓</span>
            <span>
              <strong>Renouvellement régulier du matériel</strong> pour
              respecter les normes
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-orange-500 mr-2">✓</span>
            <span>
              <strong>Maintenance assurée</strong> directement par les
              constructeurs
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-orange-500 mr-2">✓</span>
            <span>
              <strong>Formation continue des conducteurs</strong> à une conduite
              souple et sécurisée
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-orange-500 mr-2">✓</span>
            <span>
              <strong>Contrôle rigoureux</strong> du respect des procédures de
              sécurité
            </span>
          </li>
        </ul>

        <blockquote className="border-l-4 border-orange-500 pl-4 py-2 italic text-lg text-gray-700 mb-6">
          « La sécurité n'est pas une option, c'est un engagement au quotidien.
          » - Jonathan Delisle
        </blockquote>
      </section>

      {/* Conclusion */}
      <section className="text-center mb-8">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8"></div>

        <p className="text-lg mb-4">
          Delisle Logistique continue de se développer tout en maintenant des
          standards de{" "}
          <strong>qualité, de sécurité et de respect environnemental</strong>{" "}
          exemplaires.
        </p>

        <p className="text-xl font-bold text-orange-600">
          Un modèle de référence dans le monde du transport et du lavage !
        </p>

        <div className="mt-8">
          <Link
            href="/localisationStation2"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors mr-4"
          >
            Voir nos stations
          </Link>
          <a
            href="https://delisle-lavage.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Site officiel Delisle
          </a>
        </div>
      </section>
    </article>
  );
}
