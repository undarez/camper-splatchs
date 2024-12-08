"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Station, Review, Service } from "@prisma/client";
import { StarIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { Separator } from "../../../../components/ui/separator";
import Link from "next/link";

interface StationWithDetails extends Station {
  services: Service;
  reviews: Review[];
}

interface ReviewFormData {
  content: string;
  rating: number;
}

const FORBIDDEN_WORDS = ["list", "of", "forbidden", "words"];

function validateReview(content: string): boolean {
  const lowercaseContent = content.toLowerCase();
  if (content.length > 800) return false;
  return !FORBIDDEN_WORDS.some((word) => lowercaseContent.includes(word));
}

interface ServiceLabels {
  highPressure: string;
  electricity: string;
  paymentMethods: string;
  tirePressure: string;
  vacuum: string;
  handicapAccess: string;
  wasteWater: string;
  maxVehicleLength: string;
}

const serviceLabels: ServiceLabels = {
  highPressure: "Type de haute pression",
  electricity: "Type d'électricité",
  paymentMethods: "Modes de paiement",
  tirePressure: "Gonflage pneus",
  vacuum: "Aspirateur",
  handicapAccess: "Accès handicapé",
  wasteWater: "Eaux usées",
  maxVehicleLength: "Longueur maximale du véhicule",
};

interface BooleanLabels {
  true: string;
  false: string;
}

interface BooleanServiceLabels {
  tirePressure: BooleanLabels;
  vacuum: BooleanLabels;
  handicapAccess: BooleanLabels;
  wasteWater: BooleanLabels;
}

const booleanServiceLabels: BooleanServiceLabels = {
  tirePressure: {
    true: "Disponible",
    false: "Non disponible",
  },
  vacuum: {
    true: "Disponible",
    false: "Non disponible",
  },
  handicapAccess: {
    true: "Disponible",
    false: "Non disponible",
  },
  wasteWater: {
    true: "Disponible",
    false: "Non disponible",
  },
};

type HighPressureType = "NONE" | "PASSERELLE" | "ECHAFAUDAGE" | "PORTIQUE";
type ElectricityType = "NONE" | "AMP_8" | "AMP_15";
type PaymentMethodType = "JETON" | "ESPECES" | "CARTE_BANCAIRE";

const renderServiceValue = (key: string, value: unknown): string => {
  if (key === "maxVehicleLength") {
    if (typeof value === "number") {
      return `${value} mètres`;
    }
    if (value === null || value === undefined) {
      return "Non spécifié";
    }
    return String(value);
  }

  if (key === "highPressure") {
    const labels: Record<HighPressureType, string> = {
      NONE: "Aucune haute pression",
      PASSERELLE: "Passerelle",
      ECHAFAUDAGE: "Échafaudage",
      PORTIQUE: "Portique",
    };
    return labels[value as HighPressureType] || String(value);
  }

  if (key === "electricity") {
    const labels: Record<ElectricityType, string> = {
      NONE: "Pas d'électricité",
      AMP_8: "8 Ampères",
      AMP_15: "15 Ampères",
    };
    return labels[value as ElectricityType] || String(value);
  }

  if (key === "paymentMethods" && Array.isArray(value)) {
    const labels: Record<PaymentMethodType, string> = {
      JETON: "Jeton",
      ESPECES: "Espèces",
      CARTE_BANCAIRE: "Carte bancaire",
    };
    return value
      .map((method) => labels[method as PaymentMethodType] || String(method))
      .join(", ");
  }

  if (typeof value === "boolean" && key in booleanServiceLabels) {
    const serviceKey = key as keyof BooleanServiceLabels;
    const boolStr = value ? "true" : "false";
    return booleanServiceLabels[serviceKey][boolStr];
  }

  return String(value);
};

const StationDetail = () => {
  const { data: session } = useSession();
  const params = useParams();
  const [station, setStation] = useState<StationWithDetails | null>(null);
  const [formData, setFormData] = useState<ReviewFormData>({
    content: "",
    rating: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStationDetails = useCallback(async () => {
    try {
      // Assurez-vous que params.id existe
      if (!params.id) return;

      const response = await fetch(`/api/content_card_Station/${params.id}`);
      if (!response.ok) {
        throw new Error("Station non trouvée");
      }
      const data = await response.json();
      setStation(data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement de la station:", error);
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchStationDetails();
  }, [fetchStationDetails]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateReview(formData.content)) {
      setError(
        "Votre avis contient du contenu inapproprié ou dépasse 800 caractères"
      );
      return;
    }

    try {
      const response = await fetch(
        `/api/stationValidate/validateReview/${params.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setFormData({ content: "", rating: 0 });
        fetchStationDetails();
      } else {
        setError("Erreur lors de l'envoi de l'avis");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'avis:", error);
      setError("Erreur lors de l'envoi de l'avis");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!station) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <h1 className="text-3xl font-bold">{station.name}</h1>
          <p className="text-xl text-muted-foreground">{station.address}</p>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold mb-2">Services disponibles:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(station.services).map(
              ([key, value]) =>
                key !== "id" &&
                key !== "stationId" && (
                  <div key={key} className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="flex justify-between w-full"
                    >
                      <span>
                        {serviceLabels[key as keyof ServiceLabels] || key}
                      </span>
                      <span className="ml-2">
                        {renderServiceValue(key, value)}
                      </span>
                    </Badge>
                  </div>
                )
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-2xl font-bold">Laisser un avis</h2>
        </CardHeader>
        <CardContent>
          {session?.user ? (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label htmlFor="rating" className="block mb-2">
                  Note
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      type="button"
                      variant="ghost"
                      className="p-1"
                      onClick={() => setFormData({ ...formData, rating: star })}
                    >
                      <StarIcon
                        className={`h-8 w-8 ${
                          star <= formData.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="content" className="block mb-2">
                  Votre avis (max 800 caractères)
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  maxLength={800}
                  rows={4}
                  placeholder="Partagez votre expérience..."
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full">
                Envoyer l&apos;avis
              </Button>
            </form>
          ) : (
            <Alert>
              <AlertDescription>
                Vous devez être{" "}
                <Link href="/signin" className="underline font-medium">
                  connecté
                </Link>{" "}
                pour laisser un avis
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Avis des utilisateurs</h2>
        </CardHeader>
        <CardContent>
          {station.reviews.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Aucun avis pour le moment
            </p>
          ) : (
            <div className="space-y-4">
              {station.reviews.map((review, index) => (
                <div key={review.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm">{review.content}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StationDetail;
