"use client";
import { useState, useEffect } from "react";
import { Station, Review, Service } from "@prisma/client";
import { StarIcon } from "@heroicons/react/24/solid";
import {
  MapIcon,
  ViewColumnsIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import ConnectYou from "../auth/connect-you/page";
import { useSession } from "next-auth/react";
import NavigationButton from "../MapComponent/NavigationGpsButton/NavigationButtonWrapper";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// Import dynamique de la carte pour éviter les problèmes de SSR
const MapView = dynamic(() => import("@/app/pages/MapView/MapView"), {
  ssr: false,
  loading: () => <Skeleton className="h-[600px] w-full rounded-lg" />,
});

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

const StationCard = ({ station }: { station: StationWithDetails }) => {
  const { status } = useSession();
  const averageRating = station.reviews?.length
    ? station.reviews.reduce((acc, review) => acc + review.rating, 0) /
      station.reviews.length
    : 0;

  if (status === "unauthenticated") {
    return <ConnectYou />;
  }

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
  const [viewMode, setViewMode] = useState<"cards" | "map">("cards");
  const stationsPerPage = 6;

  useEffect(() => {
    async function fetchStations() {
      try {
        const response = await fetch("/api/traking_User_API");
        const data = await response.json();
        if (data.success) {
          setStations(data.stations);
          setTotalPages(Math.ceil(data.stations.length / stationsPerPage));
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

  const indexOfLastStation = currentPage * stationsPerPage;
  const indexOfFirstStation = indexOfLastStation - stationsPerPage;
  const currentStations = stations.slice(
    indexOfFirstStation,
    indexOfLastStation
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <AdjustmentsHorizontalIcon className="h-6 w-6 text-blue-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Stations validées
            </h1>
          </div>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <Button
              onClick={() => setViewMode("cards")}
              variant={viewMode === "cards" ? "default" : "ghost"}
              className={`flex items-center gap-2 transition-all duration-200 ${
                viewMode === "cards"
                  ? "shadow-md transform scale-105"
                  : "hover:bg-white/50"
              }`}
            >
              <ViewColumnsIcon className="h-5 w-5" />
              Vue cartes
            </Button>
            <Button
              onClick={() => setViewMode("map")}
              variant={viewMode === "map" ? "default" : "ghost"}
              className={`flex items-center gap-2 transition-all duration-200 ${
                viewMode === "map"
                  ? "shadow-md transform scale-105"
                  : "hover:bg-white/50"
              }`}
            >
              <MapIcon className="h-5 w-5" />
              Vue carte
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "cards" ? (
          <motion.div
            key="cards"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentStations.map((station, index) => (
                <motion.div
                  key={station.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <StationCard station={station} />
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  className={`transition-all duration-200 ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white transform scale-105"
                      : "hover:bg-blue-50"
                  }`}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="map"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="h-[600px] rounded-lg overflow-hidden">
              <MapView stations={stations as unknown as Station[]} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ValidatedStations;
