"use client";

import { useEffect, useState } from "react";
import GoogleAdsense from "./GoogleAdsense";

interface LoginAdProps {
  onContinue: () => void;
  onStayHere?: () => void;
}

export default function LoginAd({ onContinue, onStayHere }: LoginAdProps) {
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAd(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!showAd) return null;

  const handleStayHere = () => {
    if (onStayHere) {
      onStayHere();
    } else {
      setShowAd(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">
            Bienvenue sur CamperWash!
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Merci de votre connexion.
          </p>
          <GoogleAdsense
            slot="3018978839"
            style={{ display: "block", textAlign: "center" }}
            format="auto"
            responsive={true}
          />
        </div>
        <div className="space-y-2">
          <button
            onClick={onContinue}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Continuer vers le site
          </button>
          <button
            onClick={handleStayHere}
            className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
          >
            Rester ici
          </button>
        </div>
      </div>
    </div>
  );
}
