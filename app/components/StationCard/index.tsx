"use client";

import { Station, Service, Review } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";

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

  const averageRating = station.reviews?.length
    ? station.reviews.reduce((acc, review) => acc + review.rating, 0) /
      station.reviews.length
    : 0;

  return (
    <Card className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
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
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
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
          <div className="absolute inset-0 bg-white/50 backdrop-blur-md z-10 flex flex-col items-center justify-center p-4 text-center">
            <p className="text-gray-800 font-medium mb-2">
              Connectez-vous pour voir les détails complets
            </p>
            <Link href="/signin">
              <Button className="bg-blue-500 text-white hover:bg-blue-600">
                Se connecter
              </Button>
            </Link>
          </div>
        )}
        <div className={shouldBlur ? "blur-md" : ""}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
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
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-400">
                ({station.reviews?.length || 0})
              </span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            {station.address}
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="text-gray-900">
                {station.type === "STATION_LAVAGE"
                  ? "Station de lavage"
                  : "Parking"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Statut</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  station.status === "active"
                    ? "bg-green-100 text-green-800"
                    : station.status === "en_attente"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
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
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                    {station.services.highPressure || "Portique"}
                  </span>
                  {station.services.vacuum && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      Aspirateur
                    </span>
                  )}
                  {station.services.tirePressure && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      Gonflage pneus
                    </span>
                  )}
                  {station.services.waterPoint && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      Point d'eau
                    </span>
                  )}
                  {station.services.wasteWater && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      Eaux usées
                    </span>
                  )}
                  {station.services.wasteWaterDisposal && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      Évacuation eaux usées
                    </span>
                  )}
                  {station.services.blackWaterDisposal && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      Évacuation eaux noires
                    </span>
                  )}
                  {station.services.handicapAccess && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      Accès handicapé
                    </span>
                  )}
                </div>
              </div>
            )}

          {station.type === "PARKING" &&
            "parkingDetails" in station &&
            station.parkingDetails && (
              <div className="mt-2 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {station.parkingDetails.waterPoint && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      Point d'eau
                    </span>
                  )}
                  {station.parkingDetails.hasWifi && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      WiFi
                    </span>
                  )}
                  {station.parkingDetails.hasElectricity && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      Électricité
                    </span>
                  )}
                  {station.parkingDetails.handicapAccess && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      Accès handicapé
                    </span>
                  )}
                  {station.parkingDetails.wasteWater && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      Eaux usées
                    </span>
                  )}
                  {station.parkingDetails.blackWaterDisposal && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                      Eaux noires
                    </span>
                  )}
                </div>
                {station.parkingDetails.totalPlaces > 0 && (
                  <p className="text-sm text-gray-600">
                    {station.parkingDetails.totalPlaces} places disponibles
                  </p>
                )}
                {station.parkingDetails.isPayant && (
                  <p className="text-sm text-gray-600">
                    Parking payant{" "}
                    {station.parkingDetails.tarif &&
                      `- ${station.parkingDetails.tarif}€`}
                  </p>
                )}
              </div>
            )}

          <div className="mt-4">
            <Button
              onClick={() =>
                (window.location.href = `/pages/StationDetail/${station.id}`)
              }
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
            >
              Voir les détails
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
