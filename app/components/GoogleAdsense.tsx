"use client";

import { useEffect, useRef } from "react";

interface GoogleAdsenseProps {
  slot: string;
  style?: React.CSSProperties;
  format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  responsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const ADSENSE_CLIENT_ID = "ca-pub-9668851625466214";

const GoogleAdsense: React.FC<GoogleAdsenseProps> = ({
  slot,
  style = {},
  format = "auto",
  responsive = true,
  className = "",
}) => {
  const advertRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && advertRef.current) {
        // Vérifier si le contenu est chargé
        if (advertRef.current.offsetHeight === 0) {
          console.warn("Avertissement: La publicité n'a pas de hauteur");
        }
        // Initialiser la publicité
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error("Erreur lors de l'initialisation d'AdSense:", err);
    }
  }, []);

  return (
    <div className={`adsbygoogle-container ${className}`}>
      <ins
        ref={advertRef}
        className="adsbygoogle"
        style={{
          display: "block",
          minHeight: "100px",
          ...style,
        }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default GoogleAdsense;
