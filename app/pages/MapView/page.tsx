/* eslint-disable */
import { default as dynamicImport } from "next/dynamic";

// Configuration pour empêcher explicitement le prérendu
export const dynamic = "force-dynamic";
export const dynamicParams = false;
export const revalidate = 0;

// Composant de chargement simple
function LoadingComponent() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#1E2337]">
      <div className="text-white text-xl">Chargement de la carte...</div>
    </div>
  );
}

// Import dynamique du composant client avec ssr: false
const MapViewClientComponent = dynamicImport(() => import("./MapViewClient"), {
  ssr: false,
  loading: () => <LoadingComponent />,
});

export default function MapViewPage() {
  return <MapViewClientComponent />;
}
