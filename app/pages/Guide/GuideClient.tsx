"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import Image from "next/image";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";

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
    title: "Pourquoi le lavage d'un camping-car est-il important ?",
    category: "Entretien",
    image: "/images/lavage-camping-car.png",
    description:
      "Découvrez les meilleures pratiques pour l'entretien de votre camping-car et préservez sa valeur à long terme.",
    content: [
      {
        subtitle: "L'importance du lavage régulier",
        text: "Le lavage régulier d'un camping-car est une étape essentielle, autant pour préserver son esthétique que pour assurer son bon fonctionnement à long terme...",
      },
      // ... Ajoutez le reste du contenu ici
    ],
  },
  // ... Ajoutez les autres guides ici
];

export default function GuideClient() {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGuideClick = (guide: Guide) => {
    setIsLoading(true);
    setSelectedGuide(guide);
    setTimeout(() => setIsLoading(false), 500);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#1E2337] py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">
          Conseils & Astuces
        </h1>

        {selectedGuide ? (
          <div className="bg-[#1a1f37] rounded-lg p-4 sm:p-8">
            {/* Contenu du guide sélectionné */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {selectedGuide.title}
              </h2>
              <Button
                onClick={() => setSelectedGuide(null)}
                variant="outline"
                className="border-gray-700 text-gray-400 hover:text-white w-full sm:w-auto"
              >
                Retour aux guides
              </Button>
            </div>
            {/* ... Ajoutez le reste du contenu du guide sélectionné */}
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
                    onClick={() => handleGuideClick(guide)}
                    className="w-full bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800"
                  >
                    Lire le guide
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
