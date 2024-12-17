"use client";

import { useEffect } from "react";

interface GoogleAdsenseProps {
  slot: string;
  style?: React.CSSProperties;
  format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  responsive?: boolean;
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
}) => {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error("Erreur AdSense:", err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    />
  );
};

export default GoogleAdsense;
