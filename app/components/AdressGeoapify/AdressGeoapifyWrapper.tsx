"use client";

import { CamperWashStation } from "@/app/types";
import dynamic from "next/dynamic";

// Import dynamique du composant AdressGeoapify
const AdressGeoapify = dynamic(() => import("./AdressGeoapify"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-10">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
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
  return (
    <div className="address-search-container">
      <AdressGeoapify
        onAddressSelect={onAddressSelect}
        existingLocations={existingLocations}
        isModalOpen={isModalOpen}
        persistSearchBar={persistSearchBar}
      />
    </div>
  );
}
