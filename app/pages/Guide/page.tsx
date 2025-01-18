"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import Image from "next/image";
import { Check } from "lucide-react";

interface Guide {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  content: {
    subtitle: string;
    text: string;
    items?: string[];
  }[];
}

const guides: Guide[] = [
  {
    id: 1,
    title: "Nettoyage Écologique du Camping-Car",
    category: "Écologie",
    image: "/images/netoyage.jpg",
    description:
      "Guide complet pour un nettoyage écologique et efficace de votre camping-car.",
    content: [
      {
        subtitle: "Pourquoi choisir un nettoyage écologique ?",
        text: "Le nettoyage écologique permet de préserver l'environnement tout en maintenant votre camping-car en parfait état. Utiliser des produits naturels et des pratiques respectueuses réduit les impacts sur la nature, ce qui est essentiel pour les amateurs de voyages.",
      },
      {
        subtitle: "Matériel nécessaire pour un nettoyage écologique",
        text: "Voici le matériel essentiel pour un nettoyage respectueux de l'environnement :",
        items: [
          "Produits biodégradables",
          "Chiffons microfibres",
          "Brosses douces",
          "Seau d'eau",
          "Tuyau d'arrosage avec pistolet basse pression",
        ],
      },
      {
        subtitle: "Les étapes pour un nettoyage écologique",
        text: "Suivez ces étapes pour un nettoyage optimal :",
        items: [
          "Rinçage initial : Rincez le camping-car avec un tuyau à basse pression pour retirer les saletés superficielles.",
          "Nettoyage des surfaces : Appliquez un produit biodégradable sur les parois et nettoyez avec une brosse douce.",
          "Nettoyage des vitres : Utilisez un mélange d'eau et de vinaigre blanc pour faire briller sans laisser de traces.",
          "Rinçage final : Rincez abondamment à l'eau claire pour éliminer les résidus de produit.",
          "Séchage : Essuyez les surfaces avec un chiffon microfibre pour éviter les traces d'eau.",
        ],
      },
      {
        subtitle: "Vérifications essentielles après l'hiver",
        text: "Après l'hiver, il est crucial de vérifier les éléments suivants :",
        items: [
          "Batteries : Assurez-vous qu'elles sont chargées et fonctionnelles.",
          "Pneus : Contrôlez la pression et recherchez d'éventuelles fissures.",
          "Joints d'étanchéité : Examinez les joints pour détecter toute fuite potentielle.",
          "Systèmes d'eau : Testez les robinets, réservoirs et pompes pour s'assurer qu'ils n'ont pas gelé.",
        ],
      },
      {
        subtitle: "Préparer son camping-car avant le départ",
        text: "Une bonne préparation est essentielle :",
        items: [
          "Nettoyage intérieur : Passez l'aspirateur, dépoussiérez et désinfectez les surfaces.",
          "Contrôle des équipements : Vérifiez que tout fonctionne correctement (gaz, électricité, etc.).",
          "Stockage des provisions : Remplissez le réfrigérateur et les placards avec des produits nécessaires pour votre voyage.",
          "Organisation des documents : Assurez-vous d'avoir votre permis, assurance et carte grise à portée de main.",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Économiser l'eau",
    category: "Écologie",
    image: "/images/economie.jpg",
    description:
      "Apprenez à optimiser votre consommation d'eau de manière responsable tout en préservant le confort de votre voyage.",
    content: [
      {
        subtitle: "Techniques d'économie",
        text: "Utilisez un nettoyeur haute pression, récupérez l'eau de pluie...",
      },
    ],
  },
  {
    id: 3,
    title: "Entretien hivernal",
    category: "Saisonnier",
    image: "/images/entretienhiver.jpg",
    description:
      "Protégez votre camping-car pendant l'hiver avec nos conseils d'experts.",
    content: [
      {
        subtitle: "Préparation hivernale",
        text: "Vidangez les circuits d'eau, protégez les joints...",
      },
    ],
  },
];

export default function GuidePage() {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  return (
    <div className="min-h-screen bg-[#1E2337] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">
          Guide du camping-cariste
        </h1>

        {selectedGuide ? (
          <div className="bg-[#1a1f37] rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">
                {selectedGuide.title}
              </h2>
              <Button
                onClick={() => setSelectedGuide(null)}
                variant="outline"
                className="border-gray-700 text-gray-400 hover:text-white"
              >
                Retour aux guides
              </Button>
            </div>

            <div className="prose prose-invert max-w-none">
              {selectedGuide.content.map((section, index) => (
                <div key={index} className="mb-8">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                    {section.subtitle}
                  </h3>
                  <p className="text-gray-300 mb-4">{section.text}</p>
                  {section.items && (
                    <ul className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex items-start gap-3 text-gray-300"
                        >
                          <Check className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide) => (
              <Card
                key={guide.id}
                className="bg-[#1E2337] border border-gray-700/50 overflow-hidden hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="relative h-52">
                  <Image
                    src={guide.image}
                    alt={guide.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={guide.id === 1}
                    style={{ objectPosition: "center 30%" }}
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 mb-4">
                    {guide.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{guide.description}</p>
                  <Button
                    onClick={() => setSelectedGuide(guide)}
                    className="w-full bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800"
                  >
                    Lire le guide
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!selectedGuide && (
          <>
            {/* Section FAQ */}
            <div className="bg-[#1a1f37] rounded-lg p-8 my-12">
              <h2 className="text-3xl font-bold mb-6 text-white">
                Questions fréquentes
              </h2>
              <div className="grid gap-6">
                <div className="border-b border-gray-700/50 pb-4">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                    Quelle est la meilleure période pour laver son camping-car ?
                  </h3>
                  <p className="text-gray-300">
                    Il est recommandé de laver son camping-car tôt le matin ou
                    en fin de journée pour éviter...
                  </p>
                </div>
                <div className="border-b border-gray-700/50 pb-4">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                    Comment protéger la carrosserie ?
                  </h3>
                  <p className="text-gray-300">
                    Utilisez des produits spécifiques pour camping-cars, évitez
                    les brosses trop dures...
                  </p>
                </div>
              </div>
            </div>

            {/* Section Conseils Pro */}
            <div className="bg-gradient-to-r from-teal-900/50 to-cyan-900/50 rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-6 text-white">
                Conseils de pros
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Inspection régulière
                    </h3>
                    <p className="text-gray-300">
                      Faites le tour de votre véhicule régulièrement pour
                      détecter...
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-teal-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Planification
                    </h3>
                    <p className="text-gray-300">
                      Établissez un calendrier d'entretien pour votre
                      camping-car...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
