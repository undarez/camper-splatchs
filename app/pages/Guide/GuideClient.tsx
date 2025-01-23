"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import Image from "next/image";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";
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
    title: "Pourquoi le lavage d'un camping-car est-il important ?",
    category: "Entretien",
    image: "/images/lavage-camping-car.png",
    description:
      "Découvrez les meilleures pratiques pour l'entretien de votre camping-car et préservez sa valeur à long terme.",
    content: [
      {
        subtitle: "L'importance du lavage régulier",
        text: "Le lavage régulier d'un camping-car est une étape essentielle, autant pour préserver son esthétique que pour assurer son bon fonctionnement à long terme. Selon CosmétiCar, un entretien régulier contribue à maintenir la valeur de votre véhicule tout en évitant les dommages liés à la saleté ou aux résidus accumulés.\n\nEn effet, chaque tache, chaque trace de saleté ou de poussière agit comme un élément corrosif pouvant endommager la carrosserie, les vitres, le toit ou les pare-chocs. En nettoyant régulièrement ces parties, vous protégez votre camping-car contre la corrosion, les rayures et la détérioration prématurée, tout en prolongeant sa durée de vie.",
      },
      {
        subtitle:
          "Conseils pour laver efficacement l'extérieur de votre camping-car",
        text: "Lorsque vous procédez au nettoyage extérieur de votre camping-car, voici quelques étapes à suivre pour un résultat optimal, tout en préservant les surfaces délicates de votre véhicule :",
      },
      {
        subtitle: "Préparer le lavage",
        text: "Étapes essentielles pour préparer le lavage :",
        items: [
          "Commencez par rincer l'ensemble du camping-car avec de l'eau pour retirer les poussières et les saletés de surface. Cela évite les rayures lorsque vous commencez à frotter.",
          "Assurez-vous que votre matériel (brosse, produits) est adapté aux surfaces de véhicules récréatifs.",
        ],
      },
      {
        subtitle: "Utiliser les bons outils et produits",
        text: "Pour un lavage efficace et sécurisé :",
        items: [
          "Optez pour un lavage à pression modérée. Une pression trop forte pourrait endommager certaines parties sensibles comme les joints ou les panneaux solaires.",
          "Utilisez des produits de nettoyage spécialement conçus pour les camping-cars ou les véhicules récréatifs. Ces produits préservent la brillance de la carrosserie tout en éliminant efficacement les traces sur le toit, les pare-chocs ou les vitres.",
          "Munissez-vous d'une brosse télescopique pour accéder aux zones difficiles d'accès, comme le toit ou le haut des vitres.",
        ],
      },
      {
        subtitle: "Nettoyer le toit et les accessoires spécifiques",
        text: "Points importants pour le nettoyage des parties hautes :",
        items: [
          "Le toit, souvent négligé, doit être nettoyé avec soin. Des débris ou résidus accumulés peuvent affecter les panneaux solaires ou provoquer des fuites à long terme.",
          "Rincez abondamment pour éliminer les restes de produit nettoyant, en particulier sur les accessoires comme les antennes ou climatiseurs de toit.",
        ],
      },
      {
        subtitle: "Sécher et inspecter",
        text: "Étapes finales importantes :",
        items: [
          "Utilisez un chiffon microfibre doux pour sécher la surface et éviter les traces d'eau.",
          "Profitez de cette étape pour inspecter la carrosserie et détecter d'éventuels dommages, comme des fissures ou des rayures.",
        ],
      },
      {
        subtitle:
          "Une alternative pratique : utiliser une station référencée sur SplashCamper",
        text: "Si vous préférez un lavage rapide et efficace sans matériel ou si vous êtes en déplacement, vous pouvez utiliser l'une des stations de lavage référencées dans l'application SplashCamper. Ces stations sont adaptées pour les véhicules volumineux comme les camping-cars, avec des équipements conçus pour répondre à leurs besoins spécifiques.",
      },
      {
        subtitle: "Contribuez à la communauté SplashCamper !",
        text: "Si vous découvrez une station de lavage qui n'est pas encore référencée dans l'application, vous pouvez contribuer en l'ajoutant directement via la plateforme. Votre contribution permettra à d'autres utilisateurs de profiter d'options supplémentaires pour entretenir leurs véhicules.",
      },
    ],
  },
  {
    id: 2,
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
    ],
  },
  {
    id: 3,
    title: "Économiser l'eau",
    category: "Écologie",
    image: "/images/economie.jpg",
    description:
      "Apprenez à optimiser votre consommation d'eau de manière responsable tout en préservant le confort de votre voyage.",
    content: [
      {
        subtitle: "Introduction à l'économie d'eau",
        text: "Voyager en camping-car offre liberté et aventure, mais cela nécessite une gestion réfléchie de l'eau. Voici des méthodes pratiques pour économiser cette ressource précieuse, tout en respectant l'environnement.",
      },
      {
        subtitle: "Optimisation des équipements",
        text: "Installez des dispositifs économiseurs d'eau comme des pommeaux de douche basse consommation ou des embouts de robinet à débit réduit. Ces équipements maintiennent une pression optimale tout en réduisant le gaspillage.",
      },
      {
        subtitle: "Réutilisation de l'eau grise",
        text: "L'eau utilisée pour rincer les légumes ou se laver les mains peut être récupérée pour nettoyer le sol ou les toilettes. Investissez dans un système de filtration si vous souhaitez maximiser cette réutilisation.",
      },
      {
        subtitle: "Lavage de vaisselle économe",
        text: "Adoptez ces bonnes pratiques pour économiser l'eau lors de la vaisselle :",
        items: [
          "Limitez l'eau en utilisant une bassine pour laver et rincer la vaisselle",
          "Essuyez les restes avec un chiffon avant de laver",
          "Utilisez un savon biodégradable pour minimiser l'impact environnemental",
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Entretien hivernal",
    category: "Saisonnier",
    image: "/images/entretienhiver.jpg",
    description:
      "Protégez votre camping-car pendant l'hiver avec nos conseils d'experts.",
    content: [
      {
        subtitle: "L'importance de l'entretien hivernal",
        text: "L'hiver peut mettre votre camping-car à rude épreuve. Pour éviter les mauvaises surprises et prolonger sa durée de vie, voici un guide complet pour un entretien hivernal efficace.",
      },
      {
        subtitle: "Vidanger les circuits d'eau",
        text: "Avant les températures négatives, videz complètement les réservoirs d'eau propre, les eaux usées et les canalisations pour éviter qu'ils ne gèlent et n'endommagent les systèmes.",
      },
      {
        subtitle: "Entretien de la batterie",
        text: "Rechargez la batterie à fond et, si possible, débranchez-la si vous n'utilisez pas le camping-car pendant une longue période. Stockez-la dans un endroit sec et tempéré.",
      },
      {
        subtitle: "Vérification des joints et ouvertures",
        text: "Inspectez les joints de portes, fenêtres et trappes pour détecter toute fissure ou usure. Une bonne étanchéité est essentielle pour éviter les infiltrations d'eau et l'humidité.",
      },
      {
        subtitle: "Protection des pneus",
        text: "Surélevez légèrement le véhicule pour éviter que les pneus ne se déforment avec le temps. Pensez aussi à vérifier leur pression.",
      },
    ],
  },
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

            {selectedGuide.id === 1 && (
              <div className="mb-8 flex flex-col items-center">
                <p className="text-xl font-semibold text-cyan-400 mb-4">
                  Source de l'article
                </p>
                <a
                  href="https://www.cosmeticar.fr/lavage-camping-car"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Image
                    src="/images/version_2000_logo-cosmeticar.png"
                    alt="CosmétiCar Logo"
                    width={250}
                    height={125}
                    className="mb-4 hover:opacity-80 transition-opacity"
                  />
                </a>
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              {selectedGuide.content.map((section, index) => (
                <div key={index} className="mb-8">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                    {section.subtitle}
                  </h3>
                  <p className="text-gray-300 mb-4 whitespace-pre-line">
                    {section.text}
                  </p>
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

            {selectedGuide.id === 1 && (
              <div className="mt-8 border-t border-gray-700 pt-8 flex flex-col items-center text-center">
                <p className="text-lg text-gray-300 mb-4">
                  Article inspiré du contenu de{" "}
                  <span className="text-cyan-400 font-semibold">
                    CosmétiCar
                  </span>
                </p>
                <Button
                  className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 px-8"
                  onClick={() =>
                    window.open(
                      "https://www.cosmeticar.fr/lavage-camping-car",
                      "_blank"
                    )
                  }
                >
                  Lire l'article original
                </Button>
              </div>
            )}
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
