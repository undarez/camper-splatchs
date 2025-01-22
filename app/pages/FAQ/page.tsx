"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";

interface FAQItem {
  category: string;
  questions: {
    question: string;
    answer: string;
  }[];
}

const faqData: FAQItem[] = [
  {
    category: "Entretien Extérieur",
    questions: [
      {
        question:
          "Quel type de savon est recommandé pour laver l'extérieur du camping-car ?",
        answer:
          "Utilisez un savon conçu pour les carrosseries de véhicules, comme le <span class='text-cyan-400 font-semibold'>Shampooing Carrosserie GS27</span> ou le <span class='text-cyan-400 font-semibold'>Meguiar's Gold Class</span>. Ces produits, recommandés par des professionnels comme <span class='text-cyan-400 font-semibold'>GS27</span> ou <span class='text-cyan-400 font-semibold'>Meguiar's</span>, nettoient efficacement tout en préservant la peinture. Évitez les détergents ménagers, qui risquent d'endommager la surface.",
      },
      {
        question: "Comment nettoyer le toit du camping-car en toute sécurité ?",
        answer:
          "Utilisez une brosse télescopique douce et un nettoyant adapté, comme le <span class='text-cyan-400 font-semibold'>Star Brite Nettoyant Tout Usage</span>, conçu pour les surfaces délicates. Il est souvent conseillé par des entreprises spécialisées en entretien de véhicules récréatifs. Travaillez depuis une échelle ou une plateforme sécurisée pour éviter d'endommager le toit.",
      },
      {
        question:
          "Quels outils utiliser pour enlever les insectes collés sur le pare-brise et la carrosserie ?",
        answer:
          "Utilisez un produit comme le <span class='text-cyan-400 font-semibold'>Nettoyant Insectes Facom</span> ou le <span class='text-cyan-400 font-semibold'>Rain-X Bug Remover</span>, recommandé pour leur efficacité. Appliquez avec une éponge microfibre ou une raclette douce pour éviter les rayures.",
      },
      {
        question: "Comment protéger la carrosserie après un lavage ?",
        answer:
          "Appliquez une cire protectrice, telle que la <span class='text-cyan-400 font-semibold'>Cire Liquide Turtle Wax</span> ou la <span class='text-cyan-400 font-semibold'>Cire Meguiar's Ultimate Liquid Wax</span>. Ces produits sont recommandés par des experts pour leur action hydrofuge et leur protection durable contre les intempéries.",
      },
      {
        question:
          "Quelle est la meilleure façon de nettoyer les vitres sans laisser de traces ?",
        answer:
          "Utilisez un nettoyant pour vitres automobiles comme le <span class='text-cyan-400 font-semibold'>Nettoyant Vitres Auto Rain-X</span> ou le <span class='text-cyan-400 font-semibold'>Autoglym Glass Cleaner</span>. Appliquez avec un chiffon microfibre pour une finition sans trace.",
      },
      {
        question: "Comment nettoyer les jantes et les pneus efficacement ?",
        answer:
          "Choisissez un nettoyant comme le <span class='text-cyan-400 font-semibold'>Michelin Nettoyant Jantes & Pneus</span> ou le <span class='text-cyan-400 font-semibold'>GS27 Jantes Express</span>. Ces produits éliminent la saleté et redonnent de l'éclat sans endommager le revêtement.",
      },
      {
        question:
          "Faut-il utiliser un nettoyeur haute pression pour laver le camping-car ?",
        answer:
          "Oui, mais avec précaution. Des marques comme <span class='text-cyan-400 font-semibold'>Kärcher</span> proposent des nettoyeurs haute pression réglables qui permettent d'adapter la puissance pour protéger les joints et les surfaces fragiles.",
      },
    ],
  },
  {
    category: "Entretien Intérieur",
    questions: [
      {
        question: "Comment éliminer les mauvaises odeurs dans l'habitacle ?",
        answer:
          "Nettoyez les tissus avec un nettoyant comme le <span class='text-cyan-400 font-semibold'>Febreze Textiles</span> ou un appareil à vapeur, et placez des absorbeurs d'odeurs comme le <span class='text-cyan-400 font-semibold'>Neutraliseur d'Odeurs Star Brite</span> ou des sachets de charbon actif, conseillés pour leur efficacité naturelle.",
      },
      {
        question:
          "Quel produit utiliser pour nettoyer les surfaces plastiques et le tableau de bord ?",
        answer:
          "Utilisez un nettoyant plastique non gras comme le <span class='text-cyan-400 font-semibold'>Meguiar's Natural Shine</span> ou le <span class='text-cyan-400 font-semibold'>Sonax Tableau de Bord</span>. Ces produits redonnent de l'éclat sans laisser de résidus.",
      },
      {
        question: "Comment nettoyer les tissus et les coussins des sièges ?",
        answer:
          "Appliquez un produit détachant pour textiles, comme le <span class='text-cyan-400 font-semibold'>Dr. Beckmann Détachant Textiles</span> ou le <span class='text-cyan-400 font-semibold'>Turtle Wax Power Out Upholstery Cleaner</span>. Les entreprises spécialisées dans l'entretien recommandent ces produits pour leur efficacité contre les taches.",
      },
      {
        question: "Comment entretenir les sols du camping-car ?",
        answer:
          "Aspirez régulièrement et utilisez un nettoyant doux comme le <span class='text-cyan-400 font-semibold'>Starwax Nettoyant Sols Plastiques</span>. Protégez les sols avec des tapis amovibles, tels que les modèles proposés par <span class='text-cyan-400 font-semibold'>Fiamma</span>.",
      },
      {
        question:
          "Quel produit utiliser pour nettoyer le réfrigérateur sans l'endommager ?",
        answer:
          "Préférez un nettoyant naturel comme un mélange de vinaigre blanc et d'eau ou un produit alimentaire homologué comme le <span class='text-cyan-400 font-semibold'>HG Nettoyant Frigo</span>.",
      },
      {
        question: "Comment nettoyer les rideaux ou stores intérieurs ?",
        answer:
          "Les rideaux peuvent être lavés en machine à basse température avec un détergent doux comme le <span class='text-cyan-400 font-semibold'>Skip Sensitive</span>. Les stores peuvent être nettoyés avec un produit comme le <span class='text-cyan-400 font-semibold'>HG Nettoyant Multisurfaces</span>.",
      },
      {
        question:
          "Quelle est la meilleure méthode pour laver les parois intérieures (murs et plafonds) ?",
        answer:
          "Utilisez un nettoyant multi-surfaces non abrasif comme le <span class='text-cyan-400 font-semibold'>Ajax Fête des Fleurs</span> ou le <span class='text-cyan-400 font-semibold'>Cif Multi-Usages</span>. Ces produits sont recommandés pour leur douceur et leur efficacité.",
      },
      {
        question: "Comment désinfecter la cabine après un long voyage ?",
        answer:
          "Utilisez un désinfectant comme le <span class='text-cyan-400 font-semibold'>Sanytol Désinfectant Multi-Usages</span> ou un spray désinfectant pour automobile. Ces produits éliminent efficacement les bactéries et les virus sur les surfaces fréquemment touchées.",
      },
    ],
  },
  {
    category: "Astuces Complémentaires",
    questions: [
      {
        question:
          "Quels produits d'entretien sont indispensables à avoir à bord ?",
        answer:
          "Un shampooing carrosserie, un nettoyant vitre, une cire protectrice, un dégraissant doux, un aspirateur portable, des chiffons microfibres, et un désinfectant multi-usages. Avec ces produits testés et approuvés par des entreprises spécialisées, vous pouvez entretenir efficacement votre camping-car, à l'intérieur comme à l'extérieur.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleQuestion = (question: string) => {
    setOpenQuestions((prev) =>
      prev.includes(question)
        ? prev.filter((q) => q !== question)
        : [...prev, question]
    );
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#1E2337] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">
          Questions Fréquentes (FAQ)
        </h1>

        <div className="space-y-6">
          {faqData.map((category) => (
            <div
              key={category.category}
              className="bg-[#1a1f37] rounded-lg overflow-hidden border border-gray-700/50"
            >
              <button
                onClick={() => toggleCategory(category.category)}
                className="w-full px-6 py-4 flex items-center justify-between text-left bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
                aria-expanded={openCategories.includes(category.category)}
              >
                <h2 className="text-xl font-semibold text-white">
                  {category.category}
                </h2>
                {openCategories.includes(category.category) ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {openCategories.includes(category.category) && (
                <div className="p-6 space-y-4">
                  {category.questions.map((item) => (
                    <div
                      key={item.question}
                      className="border-b border-gray-700/50 last:border-0 pb-4 last:pb-0"
                    >
                      <button
                        onClick={() => toggleQuestion(item.question)}
                        className="w-full text-left flex items-center justify-between text-white hover:text-cyan-400 transition-colors"
                        aria-expanded={openQuestions.includes(item.question)}
                      >
                        <span className="font-medium">{item.question}</span>
                        {openQuestions.includes(item.question) ? (
                          <ChevronUp className="h-4 w-4 flex-shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="h-4 w-4 flex-shrink-0 ml-2" />
                        )}
                      </button>

                      {openQuestions.includes(item.question) && (
                        <div
                          className="mt-2 text-gray-300 prose prose-invert max-w-none"
                          dangerouslySetInnerHTML={{ __html: item.answer }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
