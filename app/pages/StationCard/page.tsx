"use client";

import dynamic from "next/dynamic";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";

const StationCardClient = dynamic(
  () => import("./StationCardClient").then((mod) => mod.StationCardClient),
  {
    ssr: false,
    loading: () => <LoadingScreen />,
  }
);

export default function StationCardPage() {
  return <StationCardClient />;
}
