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
            <div className="flex items-center gap-2">
              <Button
                onClick={() =>
                  router.push(`/pages/StationDetail/${station.id}`)
                }
                className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white"
              >
                Voir les détails
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
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
