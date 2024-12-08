"use client";
import { useState, useEffect } from "react";
import { Station, Review, Service } from "@prisma/client";
import { StarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import ConnectYou from "../auth/connect-you/page";
import { useSession } from "next-auth/react";
import NavigationButton from "../MapComponent/NavigationGpsButton/page";

interface StationWithDetails extends Station {
  services: Service;
  reviews: Review[];
  averageRating?: number;
}

const serviceLabels: { [key: string]: { [key: string]: string } } = {
  highPressure: {
    NONE: "Aucune haute pression",
    PASSERELLE: "Passerelle",
    ECHAFAUDAGE: "Échafaudage",
    PORTIQUE: "Portique",
  },
  electricity: {
    NONE: "Pas d'électricité",
    AMP_8: "8 Ampères",
    AMP_15: "15 Ampères",
  },
};

const StationCard = ({ station }: { station: StationWithDetails }) => {
  const { status } = useSession();
  const averageRating = station.reviews?.length
    ? station.reviews.reduce((acc, review) => acc + review.rating, 0) /
      station.reviews.length
    : 0;

  const renderServiceValue = (
    key: string,
    value: string | boolean | string[]
  ) => {
    if (key === "highPressure") {
      return serviceLabels.highPressure[value as string] || value;
    }
    if (key === "electricity") {
      return serviceLabels.electricity[value as string] || value;
    }
    if (key === "paymentMethods" && Array.isArray(value)) {
      return value
        .map((method) => {
          switch (method) {
            case "JETON":
              return "Jeton";
            case "ESPECES":
              return "Espèces";
            case "CARTE_BANCAIRE":
              return "Carte bancaire";
            default:
              return method;
          }
        })
        .join(", ");
    }
    return value ? "✓" : "✗";
  };

  // Afficher le composant ConnectYou si non authentifié
  if (status === "unauthenticated") {
    return <ConnectYou />;
  }

  // Afficher un loader pendant la vérification
  if (status === "loading") {
    return <Skeleton className="h-[200px] rounded-lg" />;
  }

  return (
    <Link href={`/pages/StationDetail/${station.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-4">
        <h3 className="text-xl font-bold mb-2">{station.name}</h3>
        <p className="text-gray-600 mb-4">{station.address}</p>

        <div className="services mb-4">
          <h4 className="font-semibold mb-2">Services disponibles:</h4>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(station.services).map(
              ([key, value]) =>
                key !== "id" &&
                key !== "stationId" && (
                  <span key={key} className="text-sm">
                    <span className="font-medium">{key}: </span>
                    <span className="text-green-600">
                      {renderServiceValue(
                        key,
                        value as string | boolean | string[]
                      )}
                    </span>
                  </span>
                )
            )}
          </div>
        </div>

        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`h-5 w-5 ${
                star <= averageRating ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">
            ({station.reviews?.length || 0} avis)
          </span>
        </div>

        <div className="mt-4">
          <NavigationButton
            lat={station.latitude}
            lng={station.longitude}
            address={station.address}
          />
        </div>
      </div>
    </Link>
  );
};
const ValidatedStations = () => {
  const [stations, setStations] = useState<StationWithDetails[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStations() {
      try {
        const response = await fetch("/api/traking_User_API");
        const data = await response.json();
        if (data.success) {
          setStations(data.stations);
          setTotalPages(Math.ceil(data.stations.length / 6));
          setLoading(false);
        } else {
          console.error(
            "Erreur lors de la récupération des stations:",
            data.error
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des stations:", error);
      }
    }

    fetchStations();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Stations validées</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map((station) => (
          <StationCard key={station.id} station={station} />
        ))}
      </div>

      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ValidatedStations;
