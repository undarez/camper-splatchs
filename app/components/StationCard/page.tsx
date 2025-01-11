"use client";

import { Station } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

interface StationCardProps {
  station: Station;
}

export default function StationCard({ station }: StationCardProps) {
  const { data: sessionData } = useSession();
  const isGuest = !sessionData && localStorage.getItem("guestSessionId");
  const shouldBlur = !sessionData && isGuest;

  return (
    <Card className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className={`p-6 ${shouldBlur ? "relative" : ""}`}>
        {shouldBlur && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-md z-10 flex flex-col items-center justify-center p-4 text-center">
            <p className="text-gray-800 font-medium mb-2">
              Connectez-vous pour voir les détails complets
            </p>
            <Button
              onClick={() => (window.location.href = "/auth/signin")}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Se connecter
            </Button>
          </div>
        )}
        <div className={shouldBlur ? "blur-md" : ""}>
          <h2 className="text-2xl font-bold mb-2">{station.name}</h2>
          <p className="text-gray-600 mb-4">{station.address}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p className="text-gray-900">
                {station.type === "STATION_LAVAGE"
                  ? "Station de lavage"
                  : "Parking"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Statut</p>
              <p className="text-gray-900">
                {station.status === "active"
                  ? "Active"
                  : station.status === "en_attente"
                  ? "En attente"
                  : "Inactive"}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Button
              onClick={() =>
                (window.location.href = `/pages/StationDetail/${station.id}`)
              }
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
            >
              Voir les détails
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
