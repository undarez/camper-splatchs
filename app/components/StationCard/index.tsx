"use client";

import { Station, Service, Review } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import NavigationButton from "@/app/pages/MapComponent/NavigationGpsButton/NavigationButton";

interface StationWithDetails extends Station {
  services: Service | null;
  images: string[];
  parkingDetails: {
    isPayant: boolean;
    tarif: number | null;
    taxeSejour: number | null;
    hasElectricity: string;
    commercesProches: string[];
    handicapAccess: boolean;
    totalPlaces: number;
    hasWifi: boolean;
    hasChargingPoint: boolean;
    waterPoint: boolean;
    wasteWater: boolean;
    wasteWaterDisposal: boolean;
    blackWaterDisposal: boolean;
  } | null;
  reviews: Review[];
  averageRating?: number;
}

interface StationCardProps {
  station: StationWithDetails;
}

export default function StationCard({ station }: StationCardProps) {
  const { data: sessionData } = useSession();
  const isGuest = !sessionData && localStorage.getItem("guestSessionId");
  const shouldBlur = !sessionData && isGuest;
  const router = useRouter();

  const averageRating = station.reviews?.length
    ? station.reviews.reduce((acc, review) => acc + review.rating, 0) /
      station.reviews.length
    : 0;

  return (
    <Card className="w-full bg-[#1E2337] shadow-lg rounded-lg overflow-hidden border border-gray-700/50">
      <div className="relative h-48 w-full">
        {station.images && station.images.length > 0 ? (
          <Image
            src={station.images[0]}
            alt={station.name}
            fill
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className={`p-6 ${shouldBlur ? "relative" : ""}`}>
        {shouldBlur && (
          <div className="absolute inset-0 bg-[#1E2337]/50 backdrop-blur-md z-10 flex flex-col items-center justify-center p-4 text-center">
            <p className="text-gray-200 font-medium mb-2">
              Connectez-vous pour voir les détails complets
            </p>
            <Link href="/signin">
              <Button className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white">
                Se connecter
              </Button>
            </Link>
          </div>
        )}
        <div className={shouldBlur ? "blur-md" : ""}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
              {station.name}
            </h3>
            <div className="flex items-center">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating)
                        ? "text-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-400">
                ({station.reviews?.length || 0})
              </span>
            </div>
          </div>
          <p className="text-gray-300 text-sm mb-4">{station.address}</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-400">Type</p>
              <p className="text-gray-200">
                {station.type === "STATION_LAVAGE"
                  ? "Station de lavage"
                  : "Parking"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Statut</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  station.status === "active"
                    ? "bg-green-900/50 text-green-400"
                    : station.status === "en_attente"
                    ? "bg-yellow-900/50 text-yellow-400"
                    : "bg-red-900/50 text-red-400"
                }`}
              >
                {station.status === "active"
                  ? "Active"
                  : station.status === "en_attente"
                  ? "En attente"
                  : "Inactive"}
              </span>
            </div>
          </div>

          {station.type === "STATION_LAVAGE" &&
            "services" in station &&
            station.services && (
              <div className="mt-2 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(station.services).map(([key, value]) => {
                    if (value && typeof value !== "object") {
                      return (
                        <span
                          key={key}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700"
                        >
                          {key === "highPressure"
                            ? value
                            : key === "vacuum"
                            ? "Aspirateur"
                            : key === "tirePressure"
                            ? "Gonflage pneus"
                            : key === "waterPoint"
                            ? "Point d'eau"
                            : key === "wasteWater"
                            ? "Eaux usées"
                            : key === "wasteWaterDisposal"
                            ? "Évacuation eaux usées"
                            : key === "blackWaterDisposal"
                            ? "Évacuation eaux noires"
                            : key === "handicapAccess"
                            ? "Accès handicapé"
                            : key}
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

          {station.type === "PARKING" &&
            "parkingDetails" in station &&
            station.parkingDetails && (
              <div className="mt-2 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(station.parkingDetails).map(
                    ([key, value]) => {
                      if (value && typeof value === "boolean") {
                        return (
                          <span
                            key={key}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700"
                          >
                            {key === "waterPoint"
                              ? "Point d'eau"
                              : key === "hasWifi"
                              ? "WiFi"
                              : key === "hasElectricity"
                              ? "Électricité"
                              : key === "handicapAccess"
                              ? "Accès handicapé"
                              : key === "wasteWater"
                              ? "Eaux usées"
                              : key === "blackWaterDisposal"
                              ? "Eaux noires"
                              : key}
                          </span>
                        );
                      }
                      return null;
                    }
                  )}
                </div>
                {station.parkingDetails.totalPlaces > 0 && (
                  <p className="text-sm text-gray-300">
                    {station.parkingDetails.totalPlaces} places disponibles
                  </p>
                )}
                {station.parkingDetails.isPayant && (
                  <p className="text-sm text-gray-300">
                    Parking payant{" "}
                    {station.parkingDetails.tarif &&
                      `- ${station.parkingDetails.tarif}€`}
                  </p>
                )}
              </div>
            )}

          <div className="mt-4 flex gap-2">
            <Button
              onClick={() => router.push(`/pages/StationDetail/${station.id}`)}
              className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white"
            >
              Voir les détails
            </Button>
            <NavigationButton
              lat={station.latitude}
              lng={station.longitude}
              address={station.address}
              className="flex-none"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
