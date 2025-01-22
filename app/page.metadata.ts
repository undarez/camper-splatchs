import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "SplashCamper - Trouvez les meilleures stations de lavage pour camping-car en France",
  description:
    "Découvrez les stations de lavage pour camping-car près de chez vous. Localisez facilement les aires de service, points d'eau et stations adaptées aux grands gabarits partout en France.",
  keywords: [
    "station lavage camping-car",
    "aire de service camping-car",
    "point eau camping-car",
    "lavage camping-car France",
    "station service camping-car",
    "localisation station lavage",
    "carte interactive camping-car",
    "avis stations lavage",
    "entretien camping-car",
  ],
  openGraph: {
    title: "SplashCamper - Stations de lavage pour camping-car",
    description:
      "Trouvez facilement les stations de lavage adaptées à votre camping-car partout en France.",
    images: [
      {
        url: "/images/station-lavage.png",
        width: 1200,
        height: 630,
        alt: "Interface de SplashCamper montrant la carte des stations",
      },
    ],
  },
};
