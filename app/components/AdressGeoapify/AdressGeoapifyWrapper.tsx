"use client";

import { CamperWashStation } from "@/app/types";
import dynamic from "next/dynamic";

// Import dynamique du composant AdressGeoapify
const AdressGeoapify = dynamic(() => import("./AdressGeoapify"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-input flex items-center justify-center bg-muted">
      <span className="text-muted-foreground">Chargement de la carte...</span>
    </div>
  ),
});

interface AdressGeoapifyWrapperProps {
  onAddressSelect: (formatted: string, lat: number, lon: number) => void;
  existingLocations?: CamperWashStation[];
  isModalOpen?: boolean;
  persistSearchBar?: boolean;
}

export default function AdressGeoapifyWrapper({
  onAddressSelect,
  existingLocations = [],
  isModalOpen = false,
  persistSearchBar = false,
}: AdressGeoapifyWrapperProps) {
  // Fonction d'adaptation pour convertir le nouveau format au format attendu
  const handleAddressSelect = (location: Partial<CamperWashStation>) => {
    if (location.latitude && location.longitude && location.address) {
      onAddressSelect(location.address, location.latitude, location.longitude);
    }
  };

  return (
    <div className="address-search-container">
      <AdressGeoapify
        onAddressSelect={handleAddressSelect}
        existingLocations={existingLocations}
        isModalOpen={isModalOpen}
        persistSearchBar={persistSearchBar}
      />
    </div>
  );
}
