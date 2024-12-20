"use client";

import { Button } from "@/components/ui/button";
import { MapIcon } from "lucide-react";

interface NavigationGpsButtonProps {
  latitude: number;
  longitude: number;
  className?: string;
}

export function NavigationGpsButton({
  latitude,
  longitude,
  className,
}: NavigationGpsButtonProps) {
  const handleClick = () => {
    // Vérifier si l'appareil est mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Créer l'URL de navigation
    let navigationUrl;
    if (isMobile) {
      // Pour les appareils mobiles, utiliser geo: pour Android ou maps: pour iOS
      if (/Android/i.test(navigator.userAgent)) {
        navigationUrl = `geo:${latitude},${longitude}?q=${latitude},${longitude}`;
      } else {
        navigationUrl = `maps://maps.apple.com/?q=${latitude},${longitude}`;
      }
    } else {
      // Pour les navigateurs de bureau, utiliser Google Maps
      navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }

    // Ouvrir l'URL de navigation
    window.open(navigationUrl, "_blank");
  };

  return (
    <Button onClick={handleClick} className={className} variant="outline">
      <MapIcon className="mr-2 h-4 w-4" />
      Itinéraire
    </Button>
  );
}
