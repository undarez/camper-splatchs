"use client";

import dynamic from "next/dynamic";

const AdressGeoapifyWrapper = dynamic(
  () => import("@/app/components/AdressGeoapify/AdressGeoapifyWrapper"),
  {
    ssr: false,
  }
);

export default function Page() {
  const handleAddressSelect = (formatted: string, lat: number, lon: number) => {
    // Gérer la sélection d'adresse ici
    console.log(formatted, lat, lon);
  };

  return (
    <AdressGeoapifyWrapper
      onAddressSelect={handleAddressSelect}
      existingLocations={[]}
      isModalOpen={false}
      persistSearchBar={false}
    />
  );
}
