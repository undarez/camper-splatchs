"use client";

import { useEffect, useState } from "react";
import GoogleAdsense from "./GoogleAdsense";

interface HomeClientWrapperProps {
  children: React.ReactNode;
}

export default function HomeClientWrapper({
  children,
}: HomeClientWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showAds, setShowAds] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowAds(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Publicité gauche */}
      {showAds && (
        <div className="fixed left-0 top-1/2 transform -translate-y-1/2 hidden lg:block z-10">
          <GoogleAdsense
            slot="7211071956"
            style={{ display: "block", width: "160px", height: "600px" }}
            format="vertical"
          />
        </div>
      )}

      {/* Contenu principal */}
      <main className="container mx-auto px-4 relative">{children}</main>

      {/* Publicité droite */}
      {showAds && (
        <div className="fixed right-0 top-1/2 transform -translate-y-1/2 hidden lg:block z-10">
          <GoogleAdsense
            slot="7211071956"
            style={{ display: "block", width: "160px", height: "600px" }}
            format="vertical"
          />
        </div>
      )}
    </div>
  );
}
