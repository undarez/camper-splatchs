"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import Image from "next/image";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";

interface ImageItem {
  type: "image";
  src: string;
  alt: string;
  caption: string;
  className?: string;
}

interface VideoItem {
  type: "video";
  videoId: string;
  title: string;
  className?: string;
}

interface TestimonialItem {
  type: "testimonial";
  author: string;
  role: string;
  content: string;
  rating: number;
}

interface ProductItem {
  type: "product";
  name: string;
  description: string;
  image?: string;
  images?: string[];
  link?: string;
}

interface StatsItem {
  type: "stats";
  items: string[];
}

interface QuoteItem {
  type: "quote";
  text: string;
}

interface Guide {
  id?: number;
  title: string;
  category: string;
  image: string;
  description: string;
  content: {
    subtitle: string;
    text?: string;
    items?: (
      | string
      | ImageItem
      | VideoItem
      | TestimonialItem
      | ProductItem
      | StatsItem
      | QuoteItem
    )[];
  }[];
  link?: string;
  date?: string;
  customStyle?: {
    headerBg: string;
    accentColor: string;
    buttonBg: string;
    cardBg: string;
    textColor: string;
  };
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
  {
    id: 5,
    title: "Lavatrans : L'histoire d'une entreprise innovante depuis 1987",
    description:
      "Découvrez l'histoire et les services de Lavatrans, leader du lavage poids lourds et camping-cars en France depuis 1987.",
    image: "/images/article-lavatrans/lavatrans-boutique.svg",
    link: "/guide/lavatrans-histoire",
    date: "2024-02-05",
    category: "Entreprise Partenaire",
    content: [
      {
        subtitle: "Une présence nationale",
        items: [
          {
            type: "video",
            videoId: "OZJSBn1msx4",
            title: "Découvrez Lavatrans en vidéo",
            className: "max-w-3xl mx-auto",
          },
          {
            type: "stats",
            items: [
              "Plus de 75 000 lavages par an",
              "Une cadence rapide : un camion est lavé toutes les 3 minutes",
              "Une disponibilité exceptionnelle avec 55 heures d'ouverture par semaine",
            ],
          },
          {
            type: "quote",
            text: "« Roulez proprement, roulez écologiquement avec Lavatrans ! »",
          },
        ],
        text: "Lavatrans s'est développé à travers la France, comptant aujourd'hui 11 stations de lavage accessibles aussi bien aux poids lourds qu'aux camping-cars.",
      },
      {
        subtitle: "Présentation de Lavatrans",
        text: "Lavatrans voit le jour en 1987 à Toulouse, grâce à l'initiative de Jean-Marie Collin. L'activité était alors centrée sur un concept novateur : le lavage de poids lourds directement au domicile des entreprises. Depuis avril 2020, Jean-Marie Collin a passé les rênes à son fils Mathieu Collin qui est aujourd'hui le visage de Lavatrans et son Président.",
        items: [
          {
            type: "image",
            src: "/images/article-lavatrans/jeanmarie.jpeg",
            alt: "Jean-Marie Collin - Fondateur de Lavatrans",
            caption: "Jean-Marie Collin, fondateur visionnaire de Lavatrans",
            className: "inline-block w-1/2",
          },
          {
            type: "image",
            src: "/images/article-lavatrans/mathieu-Collin.png",
            alt: "Mathieu Collin - Président de Lavatrans",
            caption: "Mathieu Collin, Président actuel de Lavatrans",
            className: "inline-block w-1/2",
          },
        ],
      },
      {
        subtitle:
          "Matthieu Collin : Un acteur clé du développement de Lavatrans",
        text: "Fils de Jean-Marie Collin, fondateur de Lavatrans, Matthieu Collin a su s'imposer comme un élément essentiel dans l'évolution et l'expansion de l'entreprise familiale. Passionné par le secteur du transport et du lavage industriel, il a grandi au sein de l'entreprise et en a rapidement assimilé les enjeux stratégiques.\n\nÀ partir de 2003, Matthieu Collin prend un rôle actif dans le développement de Lavatrans, notamment en dirigeant l'expansion du réseau de franchises. Son engagement et sa vision ont permis à l'entreprise de renforcer sa position de leader dans le domaine du lavage de poids lourds en France. Grâce à son expertise, Lavatrans a su moderniser ses équipements et élargir son offre de services, répondant ainsi aux besoins croissants du secteur du transport routier.\n\nSous sa direction, l'entreprise a également mis un accent particulier sur l'innovation et l'optimisation des procédés de lavage, intégrant des solutions toujours plus performantes et respectueuses de l'environnement. Matthieu Collin incarne ainsi une nouvelle génération de dirigeants, alliant savoir-faire familial et modernité pour assurer la pérennité et la croissance de Lavatrans.\n\nGrâce à sa vision stratégique et à son sens du développement, Matthieu Collin continue d'inscrire Lavatrans dans une dynamique de succès, faisant de l'entreprise une référence incontournable du secteur.",
      },
      {
        subtitle: "Premières étapes-clés",
        text: "Deux ans plus tard, en 1989, Lavatrans inaugure sa première station de lavage dédiée aux poids lourds, située stratégiquement sur le centre routier de Toulouse. L'innovation continue avec l'introduction, en 1990, du forfait lavage à volonté, une révolution dans le secteur.",
        items: [
          "Le forfait lavage à volonté : pour un accès illimité aux stations",
          "Le forfait pack : à prix fixe et forfaitaire, permettant aux camions d'être lavés dans tous les centres Lavatrans",
        ],
      },
      {
        subtitle: "Des produits de qualité au service du lavage professionnel",
        text: "Forte de son expérience au contact des professionnels du transport depuis 1987, Lavatrans met également à votre disposition l'essentiel de ses produits et accessoires de lavage poids-lourds au sein de sa boutique en ligne, pour le plus grand plaisir des professionnels et particuliers ! On retrouve ainsi la célèbre marque Vikan, à la pointe de la technologie dans le secteur du matériel de nettoyage, ou encore les bidons, fûts et sprays de lavage de la marque Lavatrans (LAVPL, LAVALU, NETDRIVE, NETLAV…)\n\nDécouvrez la gamme de certains produits professionnels pour le lavage de vos véhicules :",
        items: [
          {
            type: "product",
            name: "NETLAV",
            description:
              "Notre gamme complète de produits de lavage professionnels",
            images: [
              "/images/article-lavatrans/netlav-jante.jpg",
              "/images/article-lavatrans/netlav-plastique.jpg",
              "/images/article-lavatrans/netlav-tissu.jpg",
              "/images/article-lavatrans/netlavcuir.jpg",
              "/images/article-lavatrans/netlavinsect.jpg",
              "/images/article-lavatrans/netlavlustran.jpg",
              "/images/article-lavatrans/netlavvitre.jpg",
            ],
            link: "https://boutique.lavatrans.com/recherche.php?search=netlav",
          },
          {
            type: "product",
            name: "Shampooing Carrosserie",
            description:
              "Shampooing haute performance pour un nettoyage en profondeur.<br/>Disponible en formats : <span class='text-blue-500 font-bold bg-blue-100 px-2 py-1 rounded-md'>✨ 5L</span> <span class='text-blue-500 font-bold bg-blue-100 px-2 py-1 rounded-md'>✨ 20L</span> <span class='text-blue-500 font-bold bg-blue-100 px-2 py-1 rounded-md'>✨ 200L</span>",
            image: "/images/article-lavatrans/netdrive5l.jpg",
            link: "https://boutique.lavatrans.com/produit/netdrive-shampoing-carrosserie-tous-vehicules-bidon-5l.php",
          },
          {
            type: "product",
            name: "Dégraissant Jantes",
            description:
              "Solution puissante pour des jantes impeccables.<br/>Disponible en formats : <span class='text-blue-500 font-bold bg-blue-100 px-2 py-1 rounded-md'>✨ 5L</span> <span class='text-blue-500 font-bold bg-blue-100 px-2 py-1 rounded-md'>✨ 20L</span> <span class='text-blue-500 font-bold bg-blue-100 px-2 py-1 rounded-md'>✨ 200L</span>",
            image: "/images/article-lavatrans/lavalu.jpg",
            link: "https://boutique.lavatrans.com/produit/lavalu-nettoyant-et-renovateur-alu-bidon-5l.php",
          },
          {
            type: "product",
            name: "Polish Protection",
            description:
              "Protection longue durée pour une brillance exceptionnelle.<br/>Disponible en formats : <span class='text-blue-500 font-bold bg-blue-100 px-2 py-1 rounded-md'>✨ 5L</span> <span class='text-blue-500 font-bold bg-blue-100 px-2 py-1 rounded-md'>✨ 20L</span> <span class='text-blue-500 font-bold bg-blue-100 px-2 py-1 rounded-md'>✨ 200L</span>",
            image: "/images/article-lavatrans/lavpl.jpg",
            link: "https://boutique.lavatrans.com/produit/lavpl-shampoing-carrosserie-poids-lourds-bidon-5l.php",
          },
        ],
      },
      {
        subtitle: "Nos packs de nettoyage professionnels",
        text: "Découvrez notre sélection de packs complets pour l'entretien de votre véhicule :",
        items: [
          {
            type: "product",
            name: "Pack Complet Camping-Car",
            description:
              "Le Pack Camping-Car est idéal pour nettoyer en profondeur son véhicule. Le pack est composé d'un shampoing carrosserie dégraissant, d'une brosse articulée pour la carrosserie, une raclette pour le parebrise et d'un manche adaptable.",
            image: "/images/article-lavatrans/pack-complet-camping-car.png",
            link: "https://boutique.lavatrans.com/produit/pack-complet-camping-car.php",
          },
          {
            type: "product",
            name: "Pack STARTER",
            description:
              "Le pack STARTER est idéal pour nettoyer votre voiture, votre utilitaire ou votre camping-car à l'extérieur (carrosserie, vitres, jantes) et à l'intérieur. Les différents produits qui sont proposés vous permettront de réaliser un lavage complet de votre véhicule à un prix préférentiel.",
            image: "/images/article-lavatrans/pack-starter.png",
            link: "https://boutique.lavatrans.com/produit/pack-starter.php",
          },
        ],
      },
      {
        subtitle: "Boutique en ligne",
        text: "Retrouvez l'ensemble de nos produits et accessoires de lavage professionnel sur notre boutique en ligne : https://boutique.lavatrans.com/",
      },
      {
        subtitle: "Témoignages de nos clients",
        text: "Découvrez ce que nos clients disent de nos services",
        items: [
          {
            type: "testimonial",
            author: "Utilisateur satisfait",
            role: "Transporteur routier",
            content:
              "Les stations de lavage Lavatrans sont modernes et efficaces. Je suis impressionné par la rapidité du service et la qualité du nettoyage de mon camion.",
            rating: 5,
          },
          {
            type: "testimonial",
            author: "Client régulier",
            role: "Entreprise de transport",
            content:
              "J'apprécie particulièrement la disponibilité et le professionnalisme des équipes Lavatrans.",
            rating: 5,
          },
          {
            type: "testimonial",
            author: "Propriétaire de camping-car",
            role: "Particulier",
            content:
              "Lavatrans se distingue non seulement par la qualité de ses prestations, mais aussi par son engagement pour l'environnement.",
            rating: 5,
          },
          {
            type: "testimonial",
            author: "Transporteur professionnel",
            role: "Société de logistique",
            content:
              "De l'entretien à domicile aux stations de lavage, en passant par la boutique en ligne, Lavatrans propose une solution globale et professionnelle.",
            rating: 5,
          },
        ],
      },
    ],
    customStyle: {
      headerBg: "bg-gradient-to-r from-purple-600 to-indigo-700",
      accentColor: "text-purple-600",
      buttonBg: "bg-purple-600 hover:bg-purple-700",
      cardBg: "bg-purple-50",
      textColor: "text-gray-800",
    },
  },
  {
    id: 8,
    title: "Groupe Delisle : Une Référence en Transport, Logistique et Lavage",
    category: "Entreprise Partenaire",
    image: "/images/delisle-article/delisle-logo.png",
    description:
      "Découvrez Delisle Transport, un leader dans le domaine de la logistique et du lavage de véhicules professionnels.",
    content: [
      {
        subtitle: "Une Histoire de Croissance et d'Engagement",
        text: "",
        items: [
          {
            type: "image",
            src: "/images/delisle-article/delisle-logo.png",
            alt: "Logo Delisle Lavage",
            caption:
              "Delisle Transport, une référence dans le secteur du transport et du lavage",
            className:
              "w-1/3 h-auto max-w-xs mx-auto rounded-none shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200",
          },
        ],
      },
      {
        subtitle: "La Naissance d'un Leader",
        text: "Fondée le 1er janvier 1979, le groupe <strong>Delisle</strong> s&#39;est imposée comme un acteur majeur du transport routier de fret interurbain. Dotée du statut de <strong>SAS (Société par Actions Simplifiée)</strong>, elle a su évoluer et s&#39;adapter aux exigences du secteur. En 2022, le groupe Delisle a atteint le statut <strong>d&#39;Entreprise de Taille Intermédiaire</strong>, confirmant ainsi sa croissance \n\n.Depuis 1994, le groupe a obtenu plusieurs certifications attestant de son engagement enmatière de qualité et de satisfaction client. Ces distinctions lui ont permis de <strong>fidéliser sa clientèle</strong> et d&#39;attirer de nouveaux partenaires.",
        items: [
          {
            type: "image",
            src: "/images/delisle-article/certificat.png",
            alt: "Certificat Delisle",
            caption: "Certification qualité obtenue par Delisle Logistique",
            className:
              "w-auto h-auto max-w-full mx-auto rounded-none shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200",
          },
          {
            type: "image",
            src: "/images/delisle-article/label.png",
            alt: "Label Delisle",
            caption: "Label de qualité attestant de l'engagement de Delisle",
            className:
              "w-auto h-auto max-w-full mx-auto rounded-none shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200",
          },
        ],
      },
      {
        subtitle: "Une Direction Dynamique",
        text: "Le 1er juillet 2017, <strong>Jonathan Delisle</strong> a repris les rênes de l'entreprise en tant que Directeur et actionnaire principal.\n\nSous sa direction, le groupe a <strong>doublé son activité</strong> et a réalisé <strong>35 opérations de croissance externe en 40 ans d'existence</strong>. Parmi ces acquisitions, on note notamment celle du transport <strong>Antoine en 2021</strong>. Plus récemment, en <strong>2024, Delisle a obtenue la deuxieme place de transporteur de l'année,</strong> une distinction qui récompense son engagement et son professionnalisme.",
        items: [
          {
            type: "image",
            src: "/images/delisle-article/jonathan-delisle.webp",
            alt: "Jonathan Delisle",
            caption: "Jonathan Delisle, Directeur et actionnaire principal",
            className:
              "w-1/3 max-w-xs mx-auto rounded-none shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200",
          },
        ],
      },

      {
        subtitle: "Un Réseau de Stations en Pleine Expansion",
        text: "Au sein du groupe, la division <strong>Delisle Lavage</strong> possède actuellement <strong>23 stations de lavage</strong>, <strong>dont 19 habilitées pour le lavage de camping-car notament,</strong> réparties sur l'ensemble du territoire français. <strong>Une carte interactive</strong> est mise à disposition des utilisateurs pour localiser facilement les stations disponibles.",
        items: [
          {
            type: "quote",
            text: "Consultez la carte des stations sur : https://delisle-lavage.com/#mapid",
          },
        ],
      },
      {
        subtitle: "Des Services de Lavage Adaptés aux Professionnels",
        text: "",
      },
      {
        subtitle: "Un Large Éventail de Prestations",
        text: "Les services de lavage proposés par Delisle incluent :",
        items: [
          "Lavage intérieur : citernes, bennes, frigos",
          "Lavage extérieur : poids-lourds, utilitaires, camping-cars",
          "Lavage de GRV : notamment pour le secteur alimentaire",
          "Réchauffage de citerne pour les besoins spécifiques",
          {
            type: "image",
            src: "/images/delisle-article/lavageint-fil.jpeg",
            alt: "Lavage intérieur",
            caption: "Service de lavage intérieur pour citernes et bennes",
            className: "inline-block w-1/5 mx-2",
          },
          {
            type: "image",
            src: "/images/delisle-article/Lav_ext-fil.jpg",
            alt: "Lavage extérieur",
            caption: "Service de lavage extérieur pour tous types de véhicules",
            className: "inline-block w-1/5 mx-2",
          },
          {
            type: "image",
            src: "/images/delisle-article/nofood-fil.jpg",
            alt: "Lavage GRV",
            caption: "Service de lavage de GRV pour le secteur alimentaire",
            className: "inline-block w-1/5 mx-2",
          },
          {
            type: "image",
            src: "/images/delisle-article/rechauffage-fil.jpg",
            alt: "Réchauffage de citerne",
            caption:
              "Service de réchauffage de citerne pour besoins spécifiques",
            className: "inline-block w-1/5 mx-2",
          },
        ],
      },
      {
        subtitle: "Un Programme de Fidélité Attractif",
        text: "Delisle Lavage récompense ses clients fidèles avec un système de <strong>points cumulable</strong> :\n\n<strong>1 lavage = 3 points</strong>\n\nUne fois un certain seuil atteint, les clients peuvent <strong>réserver des cadeaux</strong>.\n\nLes cadeaux peuvent être récupérés dans plusieurs stations, notamment :\n\n- La Ferté-Gaucher (77)\n- Claye-Souilly (77)\n- Saran (45)\n- Lillebonne (76)\n- Bollène (84)\n- Verdun (55)\n- Torcy-Le-Grand (10) \n- Tilloy-Lès-Mofflaines (62) \n- Breny (02) \n- Fagnières (51)",
        items: [
          {
            type: "image",
            src: "/images/delisle-article/cadeau-fidelite.png",
            alt: "Programme de fidélité",
            caption: "Programme de fidélité avec cadeaux à la clé",
            className:
              "w-full max-w-lg mx-auto rounded-none shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200",
          },
          {
            type: "quote",
            text: "Consultez la liste complète des stations et cadeaux sur : https://delisle-lavage.com/loyalty.html",
          },
        ],
      },
      {
        subtitle: "Découvrez notre programme de fidélité",
        text: "Accumulez des points à chaque lavage et échangez-les contre des cadeaux exclusifs Delisle Lavage.",
        items: [
          {
            type: "quote",
            text: `<div class="flex justify-center">
              <a
                href="https://delisle-lavage.com/loyalty.html"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
              >
                Découvrir le programme de fidélité
              </a>
            </div>`,
          },
        ],
      },
      {
        subtitle: "Une Priorité : L'Hygiène et l'Environnement",
        text: "<strong>Engagement en matière d'Hygiène</strong>\n\n L'hygiène est une <strong>priorité absolue</strong> pour Delisle. Chaque conducteur et opérateur est formé aux <strong>bonnes pratiques d'entretien des véhicules</strong> afin d'assurer la <strong>sécurité alimentaire</strong> des produits transportés.\n\nSur chaque station de lavage, <strong>un indicateur de CO²</strong> est disponible pour informer les clients sur leur impact environnemental.",
        items: [
          {
            type: "image",
            src: "/images/delisle-article/emissionc02.png",
            alt: "Indicateur CO2",
            caption: "Indicateur de CO² pour mesurer l'impact environnemental",
            className:
              "w-full max-w-md mx-auto rounded-none shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200",
          },
          {
            type: "quote",
            text: "Découvrez ces informations sur : https://delisle-lavage.com/",
          },
        ],
      },
      {
        subtitle: "Un Traitement des Eaux Innovant",
        text: "Depuis <strong>2023</strong>, Delisle a installé une <strong>station de traitement des effluents industriels sur differents site,</strong>notamment à Connantre.\n\nCette station permet le lavage de citernes et cuves contenant des produits sensibles tout en respectant les règles de <strong>non-pollution</strong>.",
        items: [
          {
            type: "image",
            src: "/images/delisle-article/station-traitement.png",
            alt: "Station de traitement",
            caption:
              "Station de traitement des effluents industriels à Connantre",
            className:
              "w-full max-w-lg mx-auto rounded-none shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200",
          },
          {
            type: "quote",
            text: "Pour en savoir plus : https://cohin-environnement.com/station-de-traitement-des-effluents-industrielles/",
          },
        ],
      },
      {
        subtitle: "La Sécurité Avant Tout",
        text: "Le groupe Delisle met un point d'honneur à garantir la <strong>sécurité</strong> de ses opérateurs et de ses clients :\n\n- <strong>Renouvellement régulier du matériel</strong> pour respecter les normes\n- <strong>Maintenance assurée</strong> directement par les constructeurs\n- <strong>Formation continue des conducteurs</strong> à une conduite souple et sécurisée\n- <strong>Contrôle rigoureux</strong> du respect des procédures de sécurité",
        items: [
          {
            type: "quote",
            text: "« <strong>La sécurité n'est pas une option, c'est un engagement au quotidien.</strong> » - Jonathan Delisle",
          },
        ],
      },
      {
        subtitle: "Conclusion",
        text: "Delisle Logistique continue de se développer tout en maintenant des standards de <strong>qualité, de sécurité et de respect environnemental</strong> exemplaires.\n\n <strong>Un modèle de référence dans le monde du transport et du lavage !</strong>",
        items: [
          {
            type: "quote",
            text: `<div class="mt-6 flex justify-center">
              <a
                href="https://delisle-lavage.com/index.html"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
              >
                Visiter le site officiel de Delisle Lavage
              </a>
            </div>`,
          },
        ],
      },
    ],
    customStyle: {
      headerBg: "bg-gradient-to-r from-purple-600 to-indigo-700",
      accentColor: "text-purple-600",
      buttonBg: "bg-purple-600 hover:bg-purple-700",
      cardBg: "bg-purple-50",
      textColor: "text-gray-800",
    },
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
          <div
            className={`rounded-lg p-4 sm:p-8 ${
              selectedGuide.customStyle
                ? selectedGuide.customStyle.cardBg
                : "bg-[#1a1f37]"
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2
                className={`text-2xl sm:text-3xl font-bold ${
                  selectedGuide.customStyle
                    ? selectedGuide.customStyle.textColor
                    : "text-white"
                }`}
              >
                {selectedGuide.title}
              </h2>
              <Button
                onClick={() => setSelectedGuide(null)}
                variant="outline"
                className={`${
                  selectedGuide.customStyle
                    ? selectedGuide.customStyle.buttonBg + " text-white"
                    : "border-gray-700 text-gray-400 hover:text-white"
                } w-full sm:w-auto`}
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

            <div
              className={`prose max-w-none ${
                selectedGuide.customStyle ? "" : "prose-invert"
              }`}
            >
              {selectedGuide.content.map((section, index) => (
                <div key={index} className="mb-8">
                  <h3
                    className={`text-xl font-semibold mb-4 ${
                      selectedGuide.customStyle
                        ? `text-[${selectedGuide.customStyle.accentColor}]`
                        : "text-cyan-400"
                    }`}
                  >
                    {section.subtitle}
                  </h3>
                  {section.text && (
                    <p
                      className={`mb-4 whitespace-pre-line ${
                        selectedGuide.customStyle
                          ? selectedGuide.customStyle.textColor
                          : "text-gray-300"
                      }`}
                    >
                      {section.text.includes("<strong") ? (
                        <span
                          dangerouslySetInnerHTML={{ __html: section.text }}
                        />
                      ) : (
                        section.text
                      )}
                    </p>
                  )}
                  {section.items && (
                    <ul className="space-y-4">
                      {section.items.some(
                        (item): item is ImageItem =>
                          typeof item === "object" && item.type === "image"
                      ) ? (
                        <div className="flex flex-row flex-wrap justify-center items-center gap-4 py-6">
                          {section.items.map((item, itemIndex) => {
                            if (
                              typeof item === "object" &&
                              item.type === "image"
                            ) {
                              return (
                                <div
                                  key={itemIndex}
                                  className={
                                    item.className ||
                                    "w-1/2 flex flex-col items-center"
                                  }
                                >
                                  <Image
                                    src={item.src}
                                    alt={item.alt}
                                    width={800}
                                    height={600}
                                    className={`object-contain p-0 max-w-full h-auto ${
                                      item.src.includes("-fil.")
                                        ? "rounded-full"
                                        : ""
                                    }`}
                                    style={{
                                      objectPosition: "center center",
                                    }}
                                    unoptimized={true}
                                  />
                                  <p
                                    className={`text-center italic mt-4 ${
                                      selectedGuide.customStyle
                                        ? selectedGuide.customStyle.textColor
                                        : "text-gray-300"
                                    }`}
                                  >
                                    {item.caption}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {section.items.map((item, itemIndex) => {
                            if (typeof item === "string") {
                              return (
                                <li
                                  key={itemIndex}
                                  className={`flex items-start gap-3 ${
                                    selectedGuide.customStyle
                                      ? selectedGuide.customStyle.textColor
                                      : "text-gray-300"
                                  }`}
                                >
                                  <div
                                    className={`w-2 h-2 mt-2 rounded-full ${
                                      selectedGuide.customStyle
                                        ? `bg-[${selectedGuide.customStyle.accentColor}]`
                                        : "bg-cyan-400"
                                    }`}
                                  />
                                  <span>{item}</span>
                                </li>
                              );
                            } else if (item.type === "video") {
                              return (
                                <li
                                  key={itemIndex}
                                  className="flex flex-col items-center my-8 mx-auto w-1/2"
                                >
                                  <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                                    <iframe
                                      src={`https://www.youtube.com/embed/${item.videoId}`}
                                      title={item.title}
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      className="absolute top-0 left-0 w-full h-full text-black"
                                    />
                                  </div>
                                  <h4 className="text-lg font-semibold mt-4 text-center text-black">
                                    {item.title}
                                  </h4>
                                </li>
                              );
                            } else if (item.type === "testimonial") {
                              return (
                                <li key={itemIndex} className="w-full ">
                                  <div
                                    className={`p-6 rounded-xl shadow-lg  ${
                                      selectedGuide.customStyle
                                        ? "bg-white/5 backdrop-blur-sm"
                                        : "bg-gray-800/50"
                                    } transition-all duration-300 hover:transform hover:scale-[1.02]`}
                                  >
                                    <div className="flex items-start gap-4">
                                      <div className="flex-shrink-0">
                                        <div
                                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                            selectedGuide.customStyle
                                              ?.buttonBg || "bg-blue-600"
                                          }`}
                                        >
                                          <span className="text-xl font-bold text-white">
                                            {item.author.charAt(0)}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex-grow">
                                        <div className="flex items-center justify-between mb-2">
                                          <div>
                                            <h4
                                              className={`font-semibold ${
                                                selectedGuide.customStyle
                                                  ?.textColor || "text-black"
                                              }`}
                                            >
                                              {item.author}
                                            </h4>
                                            <p className="text-sm text-black">
                                              {item.role}
                                            </p>
                                          </div>

                                          <div className="flex gap-1">
                                            {[...Array(item.rating)].map(
                                              (_, i) => (
                                                <svg
                                                  key={i}
                                                  className={`w-5 h-5 ${
                                                    selectedGuide.customStyle
                                                      ? "text-[#FFD700]"
                                                      : "text-yellow-400"
                                                  }`}
                                                  fill="currentColor"
                                                  viewBox="0 0 20 20"
                                                >
                                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                              )
                                            )}
                                          </div>
                                        </div>
                                        <p
                                          className={`text-base ${
                                            selectedGuide.customStyle
                                              ?.textColor || "text-gray-300"
                                          }`}
                                        >
                                          "{item.content}"
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              );
                            } else if (item.type === "stats") {
                              return (
                                <li key={itemIndex} className="mb-6">
                                  <ul className="space-y-2">
                                    {item.items.map((stat, statIndex) => (
                                      <li
                                        key={statIndex}
                                        className={`flex items-start gap-3 ${
                                          selectedGuide.customStyle
                                            ? selectedGuide.customStyle
                                                .textColor
                                            : "text-gray-300"
                                        }`}
                                      >
                                        <div
                                          className={`w-2 h-2 mt-2 rounded-full ${
                                            selectedGuide.customStyle
                                              ? `bg-[${selectedGuide.customStyle.accentColor}]`
                                              : "bg-cyan-400"
                                          }`}
                                        />
                                        <span>{stat}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </li>
                              );
                            } else if (item.type === "product") {
                              if (item.images) {
                                return (
                                  <li key={itemIndex} className="w-full mt-8">
                                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
                                      <h4 className="text-xl font-semibold mb-4 text-black">
                                        {item.name}
                                      </h4>
                                      <p className="text-sm text-gray-400 mb-4">
                                        {item.description}
                                      </p>
                                      <div className="grid grid-cols-7 gap-2">
                                        {item.images.map((img, imgIndex) => (
                                          <div
                                            key={imgIndex}
                                            className="relative aspect-square rounded-lg overflow-hidden"
                                          >
                                            <Image
                                              src={img}
                                              alt={`${item.name} ${
                                                imgIndex + 1
                                              }`}
                                              fill
                                              className="object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                      {item.link && (
                                        <div className="mt-6 flex justify-center">
                                          <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                              Découvrir toute la gamme
                                            </Button>
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  </li>
                                );
                              } else {
                                return (
                                  <li key={itemIndex} className="w-full">
                                    <a
                                      href={item.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block"
                                    >
                                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:transform hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                                        <div className="flex items-center gap-4">
                                          <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                                            <Image
                                              src={item.image!}
                                              alt={item.name}
                                              fill
                                              className="object-cover"
                                            />
                                          </div>
                                          <div>
                                            <h4 className="text-xl font-semibold mb-2 text-black">
                                              {item.name}
                                            </h4>
                                            <p
                                              className="text-sm text-gray-400"
                                              dangerouslySetInnerHTML={{
                                                __html: item.description,
                                              }}
                                            />
                                            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                                              Voir sur la boutique
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </a>
                                  </li>
                                );
                              }
                            } else if (item.type === "quote") {
                              return (
                                <li key={itemIndex} className="my-6">
                                  <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700">
                                    {item.text.includes("<div") ||
                                    item.text.includes("<a") ||
                                    item.text.includes("<strong") ? (
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: item.text,
                                        }}
                                      />
                                    ) : (
                                      item.text
                                    )}
                                  </blockquote>
                                </li>
                              );
                            }
                          })}
                        </div>
                      )}
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

            {selectedGuide.id === 5 && (
              <div className="mt-8 border-t border-gray-200 pt-8">
                <div className="flex justify-center">
                  <a
                    href="https://boutique.lavatrans.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center px-6 py-3 rounded-lg ${
                      selectedGuide.customStyle?.buttonBg ||
                      "bg-blue-600 hover:bg-blue-700"
                    } text-white font-medium transition-colors`}
                  >
                    Visitez la boutique Lavatrans
                  </a>
                </div>
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
                <div className="relative h-80">
                  <Image
                    src={guide.image}
                    alt={guide.title}
                    fill
                    className={`${
                      guide.id === 5
                        ? "object-contain bg-white p-4"
                        : "object-cover hover:scale-105"
                    } transition-transform duration-300`}
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
