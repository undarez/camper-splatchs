"use client";

import { Card } from "@/app/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Droplet,
  Wifi,
  Plug,
  ShoppingBag,
  Accessibility,
  CreditCard,
  Car,
  MapPin,
  Star,
} from "lucide-react";

interface StationCardProps {
  station: {
    id: string;
    name: string;
    address: string;
    status: string;
    type: string;
    images: string[];
    rating?: number;
    services?: {
      waterPoint?: boolean;
      hasWifi?: boolean;
      hasElectricity?: string;
      commercesProches?: string[];
      handicapAccess?: boolean;
      paymentMethods?: string[];
    };
  };
}

interface ServiceIcons {
  waterPoint: JSX.Element;
  hasWifi: JSX.Element;
  hasElectricity: JSX.Element;
  commercesProches: JSX.Element;
  handicapAccess: JSX.Element;
  paymentMethods: JSX.Element;
}

const StationCard = ({ station }: StationCardProps) => {
  const getServiceIcon = (
    service: string,
    value: boolean | string | string[] | undefined
  ) => {
    if (!value) return null;

    const icons: ServiceIcons = {
      waterPoint: <Droplet className="h-5 w-5 text-blue-500" />,
      hasWifi: <Wifi className="h-5 w-5 text-green-500" />,
      hasElectricity: <Plug className="h-5 w-5 text-yellow-500" />,
      commercesProches: <ShoppingBag className="h-5 w-5 text-purple-500" />,
      handicapAccess: <Accessibility className="h-5 w-5 text-blue-600" />,
      paymentMethods: <CreditCard className="h-5 w-5 text-gray-600" />,
    };

    return icons[service as keyof ServiceIcons];
  };

  return (
    <Link href={`/pages/StationDetail/${station.id}`}>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-white dark:bg-[#252B43] border-0">
        <div className="relative aspect-[16/9] overflow-hidden">
          {station.images && station.images[0] ? (
            <Image
              src={station.images[0]}
              alt={station.name}
              fill
              className="object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Car className="h-12 w-12 text-gray-400" />
            </div>
          )}
          <Badge
            variant="outline"
            className={cn("absolute top-4 right-4 z-10", {
              "bg-green-100 text-green-800": station.status === "active",
              "bg-yellow-100 text-yellow-800": station.status === "en_attente",
              "bg-red-100 text-red-800": station.status === "inactive",
            })}
          >
            {station.status}
          </Badge>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {station.name}
            </h3>
            {station.rating && (
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 text-sm font-medium">
                  {station.rating}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
            <MapPin className="h-4 w-4 mr-2" />
            <p className="text-sm">{station.address}</p>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            {station.services &&
              Object.entries(station.services).map(([service, value]) => {
                const icon = getServiceIcon(service, value);
                if (icon) {
                  return (
                    <div
                      key={service}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      title={service}
                    >
                      {icon}
                    </div>
                  );
                }
                return null;
              })}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default StationCard;
