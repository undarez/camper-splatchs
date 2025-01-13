"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";
import { Station, Review, Service } from "@prisma/client";
import NavigationButton from "@/app/pages/MapComponent/NavigationGpsButton/NavigationButton";
import { Carousel } from "@/app/components/ui/carousel";
import { Badge } from "@/app/components/ui/badge";
import {
  StarIcon,
  Droplet,
  Wifi,
  Plug,
  ShoppingBag,
  Accessibility,
  CreditCard,
  Euro,
  Ruler,
  Wrench,
  Wind,
  Trash2,
  Droplets,
  Share2,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type PaymentMethod = "CARTE_BANCAIRE" | "ESPECES" | "JETON";

interface StationWithDetails extends Station {
  services: Service | null;
  parkingDetails: {
    isPayant: boolean;
    tarif: string | null;
    taxeSejour: string | null;
    hasElectricity: string;
    commercesProches: string[];
    handicapAccess: boolean;
    totalPlaces: number;
    hasWifi: boolean;
    hasChargingPoint: boolean;
  } | null;
  reviews: Review[];
}

interface ServiceValue {
  value: boolean | string | number | string[] | Date | PaymentMethod[] | null;
  key: string;
}

const serviceLabels: Record<string, string> = {
  highPressure: "Type de haute pression",
  tirePressure: "Gonflage pneus",
  vacuum: "Aspirateur",
  handicapAccess: "Accès handicapé",
  wasteWater: "Eaux usées",
  waterPoint: "Point d'eau",
  wasteWaterDisposal: "Évacuation eaux usées",
  blackWaterDisposal: "Évacuation eaux noires",
  maxVehicleLength: "Longueur max. véhicule",
  hasWifi: "WiFi",
  hasElectricity: "Électricité",
  isPayant: "Parking payant",
  tarif: "Tarif",
  taxeSejour: "Taxe de séjour",
  totalPlaces: "Nombre de places",
  hasChargingPoint: "Point de recharge",
  commercesProches: "Commerces à proximité",
  paymentMethods: "Moyens de paiement",
};

const renderServiceIcon = (key: string): JSX.Element | null => {
  switch (key) {
    case "highPressure":
      return <Wrench className="h-5 w-5 text-blue-500" />;
    case "tirePressure":
      return <Wind className="h-5 w-5 text-green-500" />;
    case "vacuum":
      return <Wind className="h-5 w-5 text-purple-500" />;
    case "handicapAccess":
      return <Accessibility className="h-5 w-5 text-blue-500" />;
    case "wasteWater":
      return <Droplet className="h-5 w-5 text-blue-500" />;
    case "waterPoint":
      return <Droplet className="h-5 w-5 text-cyan-500" />;
    case "wasteWaterDisposal":
      return <Droplets className="h-5 w-5 text-blue-500" />;
    case "blackWaterDisposal":
      return <Trash2 className="h-5 w-5 text-gray-500" />;
    case "maxVehicleLength":
      return <Ruler className="h-5 w-5 text-orange-500" />;
    case "hasWifi":
      return <Wifi className="h-5 w-5 text-blue-500" />;
    case "hasElectricity":
      return <Plug className="h-5 w-5 text-yellow-500" />;
    case "isPayant":
      return <Euro className="h-5 w-5 text-green-500" />;
    case "commercesProches":
      return <ShoppingBag className="h-5 w-5 text-purple-500" />;
    case "paymentMethods":
      return <CreditCard className="h-5 w-5 text-indigo-500" />;
    default:
      return null;
  }
};

const renderServiceValue = (
  key: string,
  value: ServiceValue["value"]
): string => {
  if (typeof value === "boolean") {
    return value ? "Disponible" : "Non disponible";
  }
  if (key === "maxVehicleLength" && typeof value === "number") {
    return `${value}m`;
  }
  if (key === "tarif" && value) {
    return `${value}€`;
  }
  if (key === "taxeSejour" && value) {
    return `${value}€/jour`;
  }
  if (key === "totalPlaces" && typeof value === "number") {
    return `${value} places`;
  }
  if (key === "paymentMethods" && Array.isArray(value)) {
    const methodLabels: Record<PaymentMethod, string> = {
      CARTE_BANCAIRE: "Carte bancaire",
      ESPECES: "Espèces",
      JETON: "Jeton",
    };
    return value
      .map((method) => methodLabels[method as PaymentMethod] || method)
      .join(", ");
  }
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return value?.toString() || "Non spécifié";
};

export default function Page({ params }: { params: { id: string } }) {
  const [station, setStation] = useState<StationWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [newRating, setNewRating] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const supabase = createClientComponentClient();

  const handleRatingChange = (rating: number) => {
    setNewRating(rating);
  };

  const handleSubmitReview = async () => {
    if (!session?.user || !newRating || !newComment.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stationId: params.id,
          rating: newRating,
          content: newComment.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de l'avis");
      }

      // Réinitialiser le formulaire
      setNewRating(null);
      setNewComment("");

      // Mettre à jour les avis
      const updatedStation = await fetch(`/api/stations/${params.id}`).then(
        (res) => res.json()
      );
      setStation(updatedStation);
      setReviewsCount(updatedStation.reviews?.length || 0);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'avis:", error);
      // Vous pouvez ajouter une notification d'erreur ici
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchStation = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/stations/${params.id}`);
        const data = await response.json();
        setStation(data);
        setReviewsCount(data.reviews?.length || 0);

        // Enregistrer la visite seulement si l'utilisateur est connecté
        if (session?.user) {
          await fetch("/api/visits", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ stationId: params.id }),
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la station:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStation();

    // Mettre à jour la subscription Supabase pour les avis
    const reviewsSubscription = supabase
      .channel("reviews-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Review",
          filter: `stationId=eq.${params.id}`,
        },
        async (_payload) => {
          // Mettre à jour le nombre d'avis et la station
          const response = await fetch(`/api/stations/${params.id}`);
          const updatedStation = await response.json();
          setStation(updatedStation);
          setReviewsCount(updatedStation.reviews?.length || 0);
        }
      )
      .subscribe();

    return () => {
      // Nettoyer la subscription lors du démontage du composant
      supabase.removeChannel(reviewsSubscription);
    };
  }, [params.id, session, supabase]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: station?.name,
          text: `Découvrez ${station?.name} sur Splatch Camper`,
          url: window.location.href,
        });
      } else {
        // Fallback - Copier le lien dans le presse-papier
        await navigator.clipboard.writeText(window.location.href);
        alert("Lien copié dans le presse-papier !");
      }
    } catch (error) {
      console.error("Erreur lors du partage:", error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!station) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600 mb-4">Station non trouvée</p>
        <Button onClick={() => window.history.back()}>Retour</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* En-tête avec informations principales */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {station.name}
              </h1>
              <p className="text-gray-500 mt-1">{station.address}</p>
            </div>
            <Badge
              variant="outline"
              className={cn("px-4 py-2 text-sm font-medium rounded-full", {
                "bg-green-100 text-green-800": station.status === "active",
                "bg-yellow-100 text-yellow-800":
                  station.status === "en_attente",
                "bg-red-100 text-red-800": station.status === "inactive",
              })}
            >
              {station.status === "active"
                ? "Active"
                : station.status === "en_attente"
                ? "En attente"
                : "Inactive"}
            </Badge>
          </div>

          {/* Tags et caractéristiques principales */}
          <div className="flex flex-wrap gap-2 mb-6">
            {station.type === "STATION_LAVAGE" && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Station de lavage
              </span>
            )}
            {station.type === "PARKING" && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                Parking
              </span>
            )}
            {station.services?.handicapAccess && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Accès handicapé
              </span>
            )}
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
            <div className="text-center">
              <p className="text-2xl font-semibold text-blue-600">
                {reviewsCount}
              </p>
              <p className="text-sm text-gray-500">Avis</p>
            </div>
            <div className="text-center border-l border-gray-100">
              <p className="text-2xl font-semibold text-blue-600">
                {station.parkingDetails?.totalPlaces || "N/A"}
              </p>
              <p className="text-sm text-gray-500">Places</p>
            </div>
          </div>
        </div>

        {/* Services et Photos */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Photos - maintenant en premier pour le mobile */}
          {station.images && station.images.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm md:order-2">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Photos de la station
              </h2>
              <div className="space-y-4">
                <Carousel className="w-full">
                  {station.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden"
                    >
                      <Image
                        src={image}
                        alt={`${station.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
          )}

          {/* Services disponibles - maintenant en second pour le mobile */}
          <div className="bg-white rounded-xl p-6 shadow-sm md:order-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                Services disponibles
              </h2>
              <div className="flex gap-2">
                <Button
                  onClick={handleShare}
                  className="bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Partager
                </Button>
                <NavigationButton
                  lat={station.latitude}
                  lng={station.longitude}
                  address={station.address}
                  className="bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 px-4 py-2 rounded-md"
                />
              </div>
            </div>
            <div className="space-y-3">
              {station.type === "STATION_LAVAGE" && station.services && (
                <>
                  {Object.entries(station.services)
                    .filter(
                      ([key]) =>
                        key !== "id" &&
                        key !== "stationId" &&
                        key !== "createdAt"
                    )
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {renderServiceIcon(key)}
                          <span className="text-gray-700 font-medium">
                            {serviceLabels[key] || key}
                          </span>
                        </div>
                        <span className="text-gray-600">
                          {renderServiceValue(key, value)}
                        </span>
                      </div>
                    ))}
                </>
              )}
              {station.type === "PARKING" && station.parkingDetails && (
                <>
                  {Object.entries(station.parkingDetails)
                    .filter(([key]) => key !== "id" && key !== "stationId")
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {renderServiceIcon(key)}
                          <span className="text-gray-700 font-medium">
                            {serviceLabels[key] || key}
                          </span>
                        </div>
                        <span className="text-gray-600">
                          {renderServiceValue(key, value)}
                        </span>
                      </div>
                    ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Avis et Commentaires */}
        <div className="mt-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Avis et Commentaires
            </h2>

            {session?.user ? (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Ajouter un avis</h3>
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingChange(star)}
                      className="focus:outline-none"
                      disabled={isSubmitting}
                    >
                      <StarIcon
                        className={cn("h-6 w-6", {
                          "text-yellow-400 fill-yellow-400":
                            star <= (newRating || 0),
                          "text-gray-300": star > (newRating || 0),
                          "opacity-50": isSubmitting,
                        })}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Partagez votre expérience..."
                  className={cn(
                    "w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    isSubmitting && "opacity-50 cursor-not-allowed"
                  )}
                  rows={4}
                  disabled={isSubmitting}
                />
                <Button
                  onClick={handleSubmitReview}
                  disabled={!newRating || !newComment.trim() || isSubmitting}
                  className={cn(
                    "mt-4 bg-blue-600 hover:bg-blue-700",
                    isSubmitting && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Publication en cours...
                    </div>
                  ) : (
                    "Publier l'avis"
                  )}
                </Button>
              </div>
            ) : (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600 mb-4">
                  Connectez-vous pour laisser un avis
                </p>
                <Button
                  onClick={() => (window.location.href = "/signin")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Se connecter
                </Button>
              </div>
            )}

            <div className="space-y-4">
              {station.reviews && station.reviews.length > 0 ? (
                station.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className={cn("h-4 w-4", {
                                "text-yellow-400 fill-yellow-400":
                                  star <= review.rating,
                                "text-gray-300 fill-gray-300":
                                  star > review.rating,
                              })}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  Aucun avis pour le moment
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
