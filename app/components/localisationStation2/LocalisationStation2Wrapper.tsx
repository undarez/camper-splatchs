"use client";

import dynamic from "next/dynamic";

const LocalisationStation2 = dynamic(
  () => import("@/app/components/localisationStation2/LocalisationStation2"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center">
        <p>Chargement de la carte...</p>
      </div>
    ),
  }
);

export default function LocalisationStation2Wrapper() {
  return <LocalisationStation2 />;
}
