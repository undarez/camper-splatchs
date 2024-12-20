"use client";

import { useEffect, useState } from "react";
import { Station, Review, Service } from "@prisma/client";
import NavigationButton from "@/app/pages/MapComponent/NavigationGpsButton/NavigationButton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Carousel } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface StationWithDetails extends Station {
  services: Service;
  reviews: Review[];
}

const serviceLabels: Record<string, string> = {
  highPressure: "Type de haute pression",
  electricity: "Type d'électricité",
  paymentMethods: "Modes de paiement",
  tirePressure: "Gonflage pneus",
  vacuum: "Aspirateur",
  handicapAccess: "Accès handicapé",
  wasteWater: "Eaux usées",
  maxVehicleLength: "Longueur maximale du véhicule",
};

const renderServiceValue = (key: string, value: unknown): string => {
  if (key === "maxVehicleLength" && typeof value === "number") {
    return `${value} mètres`;
  }

  if (key === "highPressure" && typeof value === "string") {
    const labels: Record<string, string> = {
      NONE: "Aucune haute pression",
      PASSERELLE: "Passerelle",
      ECHAFAUDAGE: "Échafaudage",
      PORTIQUE: "Portique",
    };
    return labels[value] || String(value);
  }

  if (key === "electricity" && typeof value === "string") {
    const labels: Record<string, string> = {
      NONE: "Pas d'électricité",
      AMP_8: "8 Ampères",
      AMP_15: "15 Ampères",
    };
    return labels[value] || String(value);
  }

  if (key === "paymentMethods" && Array.isArray(value)) {
    const labels: Record<string, string> = {
      JETON: "Jeton",
      ESPECES: "Espèces",
      CARTE_BANCAIRE: "Carte bancaire",
    };
    return value.map((method) => labels[method as string] || method).join(", ");
  }

  if (typeof value === "boolean") {
    return value ? "Disponible" : "Non disponible";
  }

  return value ? String(value) : "Non spécifié";
};

const StationDetail = ({ params }: { params: { id: string } }) => {
  const [station, setStation] = useState<StationWithDetails | null>(null);

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
      <div className="grid gap-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{station.name}</h1>
          <Badge
            variant="outline"
            className={cn({
              "bg-green-100 text-green-800": station.status === "active",
              "bg-yellow-100 text-yellow-800": station.status === "en_attente",
              "bg-red-100 text-red-800": station.status === "inactive",
            })}
          >
            {station.status}
          </Badge>
        </div>

        {/* Informations principales */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Carte d'informations */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <h2 className="text-xl font-semibold">Informations</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Adresse</h3>
                <p className="text-gray-600">{station.address}</p>
                <div className="mt-4">
                  <NavigationButton
                    lat={station.latitude}
                    lng={station.longitude}
                    address={station.address}
                  />
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Services disponibles</h3>
                <div className="grid gap-2">
                  {station.services &&
                    Object.entries(station.services)
                      .filter(([key]) => key !== "id" && key !== "stationId")
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <span className="text-gray-700">
                            {serviceLabels[key] || key}
                          </span>
                          <span className="text-gray-600 font-medium">
                            {renderServiceValue(key, value)}
                          </span>
                        </div>
                      ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          {station.images && station.images.length > 0 && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <h2 className="text-xl font-semibold">Photos</h2>
              </CardHeader>
              <CardContent>
                <Carousel className="w-full">
                  {station.images.map((image, index) => (
                    <div key={index} className="relative aspect-video">
                      <Image
                        src={image}
                        alt={`${station.name} ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </Carousel>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Avis */}
        {station.reviews && station.reviews.length > 0 && (
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <h2 className="text-xl font-semibold">Avis des utilisateurs</h2>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {station.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 bg-gray-50 rounded-lg space-y-2"
                  >
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={cn("h-4 w-4", {
                            "text-yellow-400 fill-yellow-400":
                              star <= review.rating,
                            "text-gray-300 fill-gray-300": star > review.rating,
                          })}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700">{review.content}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StationDetail;
