/* eslint-disable */
"use client";

import { Suspense, lazy } from "react";

// Configuration pour indiquer que cette page ne doit pas être pré-rendue
export const config = {
  runtime: "client",
};

// Import lazy du composant client
const MapViewClientComponent = lazy(() => import("./MapViewClient"));

// Composant de chargement simple
function LoadingComponent() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#1E2337]">
      <div className="text-white text-xl">Chargement de la carte...</div>
    </div>
  );
}

export default function MapViewPage() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <MapViewClientComponent />
    </Suspense>
  );
}
