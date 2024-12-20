"use client";

import { useEffect, useState } from "react";
import { Station } from "@prisma/client";
import { NavigationGpsButton } from "../../../components/NavigationGpsButton";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "../../../lib/utils";
import Image from "next/image";

const StationDetail = ({ params }: { params: { id: string } }) => {
  const [station, setStation] = useState<Station | null>(null);

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const response = await fetch(`/api/stations/${params.id}`);
        const data = await response.json();
        setStation(data);

        // Enregistrer la visite
        await fetch("/api/visits", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stationId: params.id }),
        });
      } catch (error) {
        console.error("Erreur lors de la récupération de la station:", error);
      }
    };

    fetchStation();
  }, [params.id]);

  if (!station) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{station.name}</h1>
          <Badge variant="outline" className={getStatusColor(station.status)}>
            {station.status}
          </Badge>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">Adresse</h2>
                <p>{station.address}</p>
                <div className="mt-4">
                  <NavigationGpsButton
                    latitude={station.latitude}
                    longitude={station.longitude}
                    className="w-full"
                  />
                </div>
              </div>

              {station.images && station.images.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">Photos</h2>
                  <Carousel>
                    {station.images.map((image, index) => (
                      <div key={index} className="relative w-full h-64">
                        <Image
                          src={image}
                          alt={`${station.name} ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </Carousel>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StationDetail;
