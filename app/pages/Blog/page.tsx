"use client";

import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";

const articles = [
  {
    id: 1,
    title: "Les meilleures stations de lavage en France",
    category: "Guide",
    author: "Jean Dupont",
    date: "15 Mars 2024",
    image: "/images/best-stations.jpg",
    description:
      "Découvrez notre sélection des meilleures stations de lavage pour camping-cars à travers la France.",
    readTime: "5 min",
  },
  {
    id: 2,
    title: "Comment préparer son camping-car pour l'été",
    category: "Conseils",
    author: "Marie Martin",
    date: "12 Mars 2024",
    image: "/images/summer-prep.jpg",
    description:
      "Guide complet pour préparer votre camping-car avant la saison estivale.",
    readTime: "8 min",
  },
  {
    id: 3,
    title: "Économiser l'eau pendant le lavage",
    category: "Écologie",
    author: "Pierre Dubois",
    date: "10 Mars 2024",
    image: "/images/water-saving.jpg",
    description:
      "Astuces et conseils pour un lavage écologique de votre camping-car.",
    readTime: "6 min",
  },
  {
    id: 4,
    title: "Les nouveautés 2024 pour l'entretien",
    category: "Actualités",
    author: "Sophie Bernard",
    date: "8 Mars 2024",
    image: "/images/news-2024.jpg",
    description:
      "Découvrez les dernières innovations en matière d'entretien de camping-cars.",
    readTime: "4 min",
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Guide", "Conseils", "Écologie", "Actualités"];

  const filteredArticles =
    selectedCategory === "all"
      ? articles
      : articles.filter((article) => article.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#1E2337] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">
            Blog SplashCamper
          </h1>
          <p className="text-gray-400 text-lg">
            Actualités, conseils et guides pour l'entretien de votre camping-car
          </p>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`${
                selectedCategory === category
                  ? "bg-gradient-to-r from-teal-600 to-cyan-700"
                  : "text-gray-400 border-gray-700 hover:border-cyan-500/50"
              }`}
            >
              {category === "all" ? "Tous les articles" : category}
            </Button>
          ))}
        </div>

        {/* Liste des articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <Card
              key={article.id}
              className="bg-[#1E2337] border border-gray-700/50 overflow-hidden hover:border-cyan-500/50 transition-all duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span>{article.author}</span>
                  <span>•</span>
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-400 mb-4">{article.description}</p>
                <Button className="w-full bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800">
                  Lire l'article
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-16 bg-gradient-to-r from-teal-900/50 to-cyan-900/50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Restez informé !
          </h2>
          <p className="text-gray-300 mb-6">
            Inscrivez-vous à notre newsletter pour recevoir nos derniers
            articles et conseils
          </p>
          <div className="flex max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-cyan-500"
            />
            <Button className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800">
              S'inscrire
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
