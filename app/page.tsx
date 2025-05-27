"use client";

import dynamic from "next/dynamic";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";

// Import dynamique pour éviter les erreurs SSR avec les APIs de navigateur
const NetworkStatus = dynamic(() => import("@/app/components/NetworkStatus"), {
  ssr: false,
});

const HomePage = dynamic(() => import("@/app/pages/Home/page"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

export default function Home() {
  return (
    <>
      <HomePage />
      {/* Composant qui affiche une alerte quand l'appareil est hors ligne */}
      <NetworkStatus />
    </>
  );
}
