"use client";

import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { StationWithDetails } from "@/app/types/station";
import { Navigation } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

interface StationCardProps {
  station: StationWithDetails;
  showActions?: boolean;
}

export default function StationCard({
  station,
  showActions = true,
}: StationCardProps) {
  const router = useRouter();

  const openGPS = (type: string) => {
    const { latitude, longitude } = station;

    switch (type) {
      case "google":
        window.open(
          `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
          "_blank"
        );
        break;
      case "waze":
        window.open(
          `https://www.waze.com/ul?ll=${latitude},${longitude}&navigate=yes`,
          "_blank"
        );
        break;
      case "apple":
        window.open(
          `http://maps.apple.com/?daddr=${latitude},${longitude}`,
          "_blank"
        );
        break;
      case "here":
        window.open(
          `https://share.here.com/r/${latitude},${longitude}`,
          "_blank"
        );
        break;
      default:
        window.open(
          `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
          "_blank"
        );
    }
  };

  return (
    <Card className="w-full bg-[#252b43] border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="relative h-48 sm:h-56 w-full overflow-hidden">
        {station.images && station.images.length > 0 ? (
          <div className="relative h-full w-full">
            <Image
              src={station.images[0] || "/images/default-station.jpg"}
              alt={station.name}
              fill
              className="object-cover rounded-t-lg transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              priority
            />
            {station.images.length > 1 && (
              <div className="absolute bottom-2 right-2 flex space-x-1">
                {station.images.slice(0, 3).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === 0 ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="h-full w-full bg-gray-700 rounded-t-lg flex items-center justify-center">
            <p className="text-gray-400 text-sm">Aucune image disponible</p>
          </div>
        )}
        {(station.isLavaTrans || station.isDelisle) && (
          <div className="absolute top-2 left-2 flex gap-1">
            {station.isLavaTrans && (
              <div className="bg-cyan-500/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                LavaTrans
              </div>
            )}
            {station.isDelisle && (
              <div className="bg-orange-500/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                Delisle
              </div>
            )}
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-white line-clamp-2">
              {station.name}
            </h3>
            <div className="flex gap-2 mt-1">
              {station.isLavaTrans && (
                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full text-xs">
                  Lavatrans
                </span>
              )}
              {station.isDelisle && (
                <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded-full text-xs">
                  Delisle
                </span>
              )}
            </div>
          </div>
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
            <div className="flex flex-wrap gap-1.5">
              {station.services.highPressure !== "NONE" && (
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                  </svg>
                  Haute pression
                </span>
              )}
              {station.services.waterPoint && (
                <span className="px-2 py-0.5 bg-teal-500/20 text-teal-300 rounded-full text-xs flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2c-5.33 4-8 8.27-8 12 0 4.42 3.58 8 8 8s8-3.58 8-8c0-3.73-2.67-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-1.77.79-3.92 2.65-6.15C9.92 6.03 10.85 5 12 5c1.15 0 2.08 1.03 3.35 2.84C17.21 10.08 18 12.23 18 14c0 3.31-2.69 6-6 6z" />
                  </svg>
                  Point d'eau
                </span>
              )}
              {station.services.wasteWater && (
                <span className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded-full text-xs flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                  Eaux usées
                </span>
              )}
            </div>
          )}

          {station.parkingDetails && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {station.parkingDetails.totalPlaces > 0 && (
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm0 8h-3V7h3c1.1 0 2 .9 2 2s-.9 2-2 2z" />
                  </svg>
                  {station.parkingDetails.totalPlaces} places
                </span>
              )}
              {station.parkingDetails.hasElectricity !== "NONE" && (
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded-full text-xs flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7 2v11h3v9l7-12h-4l4-8z" />
                  </svg>
                  Électricité
                </span>
              )}
            </div>
          )}

          {showActions && (
            <div className="flex items-center gap-2 mt-2">
              <Button
                onClick={() =>
                  router.push(`/pages/StationDetail/${station.id}`)
                }
                className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white text-sm py-1 h-auto"
              >
                Voir détails
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-auto py-1">
                    <Navigation className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-[#1E2337] border-gray-700"
                >
                  <DropdownMenuItem
                    onClick={() => openGPS("google")}
                    className="text-gray-200 hover:bg-blue-600/20 cursor-pointer flex items-center"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 mr-2"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.527 4.473c-4.63-4.63-12.424-4.63-17.054 0-4.63 4.63-4.63 12.424 0 17.054 4.63 4.63 12.424 4.63 17.054 0 4.63-4.63 4.63-12.424 0-17.054zM12 21.54c-5.273 0-9.54-4.267-9.54-9.54S6.727 2.46 12 2.46s9.54 4.267 9.54 9.54-4.267 9.54-9.54 9.54z"
                        fill="#34A853"
                      />
                      <path
                        d="M12 3.46c-2.65 0-5.05 1.07-6.78 2.8-1.73 1.73-2.8 4.13-2.8 6.78s1.07 5.05 2.8 6.78c1.73 1.73 4.13 2.8 6.78 2.8s5.05-1.07 6.78-2.8c1.73-1.73 2.8-4.13 2.8-6.78s-1.07-5.05-2.8-6.78c-1.73-1.73-4.13-2.8-6.78-2.8z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
                        fill="#FBBC05"
                      />
                    </svg>
                    Google Maps
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openGPS("waze")}
                    className="text-gray-200 hover:bg-blue-600/20 cursor-pointer flex items-center"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 mr-2"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                        fill="#33CCFF"
                      />
                      <path
                        d="M12 15.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 8.5 12 8.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"
                        fill="#FFFFFF"
                      />
                      <path
                        d="M12 9.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z"
                        fill="#33CCFF"
                      />
                    </svg>
                    Waze
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openGPS("apple")}
                    className="text-gray-200 hover:bg-blue-600/20 cursor-pointer flex items-center"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 mr-2"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                        fill="#000000"
                      />
                      <path
                        d="M12 5c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 11.5c-2.48 0-4.5-2.02-4.5-4.5S9.52 7.5 12 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z"
                        fill="#FFFFFF"
                      />
                      <path
                        d="M12 8.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5z"
                        fill="#000000"
                      />
                    </svg>
                    Apple Plans
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openGPS("here")}
                    className="text-gray-200 hover:bg-blue-600/20 cursor-pointer flex items-center"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 mr-2"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                        fill="#48DAD0"
                      />
                      <path
                        d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"
                        fill="#00C3A5"
                      />
                      <path
                        d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"
                        fill="#48DAD0"
                      />
                    </svg>
                    Here WeGo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
