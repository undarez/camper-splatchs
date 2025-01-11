"use client";

import { Button } from "@/app/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/app/components/ui/dropdown-menu";
import { Navigation, Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface NavigationButtonProps {
  lat: number;
  lng: number;
  address: string;
  className?: string;
}

const NavigationButton = ({
  lat,
  lng,
  address,
  className,
}: NavigationButtonProps) => {
  const navigationApps = [
    {
      name: "Google Maps",
      url: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(
        address
      )}`,
      icon: "/icons/google-maps.png",
    },
    {
      name: "Waze",
      url: `https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes&address=${encodeURIComponent(
        address
      )}`,
      icon: "/icons/waze.png",
    },
    {
      name: "Apple Plans",
      url: `http://maps.apple.com/?daddr=${encodeURIComponent(
        address
      )}&ll=${lat},${lng}`,
      icon: "/icons/apple-maps.png",
    },
  ];

  const handleNavigation = (app: (typeof navigationApps)[0]) => {
    try {
      window.open(app.url, "_blank");
      toast.success(`Navigation lancée vers ${address} avec ${app.name}`);
    } catch (error) {
      console.error(error);
      toast.error(`Impossible d'ouvrir ${app.name}`);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Emplacement station",
          text: `Station située à : ${address}`,
          url: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        });
      } else {
        // Fallback pour les navigateurs qui ne supportent pas l'API de partage
        navigator.clipboard.writeText(address);
        toast.success("Adresse copiée dans le presse-papier");
      }
    } catch (error) {
      console.error(error);
      toast.error("Impossible de partager l'emplacement");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-2 bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white border-none shadow-md hover:shadow-lg transition-all duration-200",
              className
            )}
          >
            <Navigation className="h-4 w-4" />
            <span className="hidden sm:inline">Y aller</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-xs text-muted-foreground truncate">
            {address}
          </DropdownMenuLabel>
          {navigationApps.map((app) => (
            <DropdownMenuItem
              key={app.name}
              onClick={() => handleNavigation(app)}
              className="flex items-center gap-2 cursor-pointer"
            >
              {app.icon && (
                <Image
                  src={app.icon}
                  alt={`${app.name} icon`}
                  width={16}
                  height={16}
                />
              )}
              <span>{app.name}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem
            onClick={handleShare}
            className="flex items-center gap-2 cursor-pointer bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white rounded-md mt-2"
          >
            <Share2 className="h-4 w-4" />
            Partager l&apos;emplacement
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NavigationButton;
