"use client";

import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { StationWithDetails } from "@/app/types/station";

interface StationCardProps {
  station: StationWithDetails;
  showActions?: boolean;
}

export default function StationCard({
  station,
  showActions = true,
}: StationCardProps) {
  const router = useRouter();

  return (
    <Card className="w-full bg-[#252b43] border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={station.images?.[0] || "/images/default-station.jpg"}
          alt={station.name}
          fill
          className="object-cover rounded-t-lg"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-white line-clamp-2">
            {station.name}
          </h3>
          <div className="flex items-center space-x-1">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <span className="text-white">
              {station.averageRating?.toFixed(1) || "N/A"}
            </span>
          </div>
        </div>
        <p className="text-gray-400 text-sm line-clamp-2">{station.address}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {station.services && (
            <div className="flex flex-wrap gap-2">
              {station.services.highPressure !== "NONE" && (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                  Haute pression
                </span>
              )}
              {station.services.waterPoint && (
                <span className="px-2 py-1 bg-teal-500/20 text-teal-300 rounded-full text-sm">
                  Point d'eau
                </span>
              )}
            </div>
          )}

          {showActions && (
            <div className="flex justify-between items-center space-x-4">
              <Button
                onClick={() =>
                  router.push(`/pages/StationDetail/${station.id}`)
                }
                className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white"
              >
                Voir les détails
              </Button>
              <Button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`,
                    "_blank"
                  )
                }
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                Y aller
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
