"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const CookiesConsentModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà accepté les cookies
    const hasConsent = localStorage.getItem("cookiesConsent");
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesConsent", "true");
    setIsVisible(false);
  };

  const handleRefuse = () => {
    localStorage.setItem("cookiesConsent", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          <h2 className="font-bold mb-2">
            Politique de confidentialité et cookies
          </h2>
          <p>
            Nous utilisons des cookies pour améliorer votre expérience sur notre
            site. En continuant à naviguer, vous acceptez notre utilisation des
            cookies.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefuse}>
            Refuser
          </Button>
          <Button onClick={handleAccept}>Accepter</Button>
        </div>
      </div>
    </div>
  );
};

export default CookiesConsentModal;
