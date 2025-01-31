"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";
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
  Phone,
  Info,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type PaymentMethod = "CARTE_BANCAIRE" | "ESPECES" | "JETON";

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

interface Review {
  id: string;
  content: string;
  rating: number;
  created_at: string;
  author_id: string;
  author?: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
}

interface StationWithDetails {
  id: string;
  name: string;
  address: string;
  city: string | null;
  postal_code: string | null;
  latitude: number;
  longitude: number;
  images: string[];
  status: string;
  type: string;
  description: string | null;
  phone_number: string | null;
  services: {
    id: string;
    high_pressure: string;
    tire_pressure: boolean;
    vacuum: boolean;
    handicap_access: boolean;
    waste_water: boolean;
    water_point: boolean;
    waste_water_disposal: boolean;
    black_water_disposal: boolean;
    electricity: string;
    max_vehicle_length: number | null;
  } | null;
  parking_details: {
    id: string;
    is_payant: boolean;
    tarif: number | null;
    taxe_sejour: number | null;
    has_electricity: string;
    commerces_proches: string[];
    handicap_access: boolean;
    total_places: number;
    has_wifi: boolean;
    has_charging_point: boolean;
    water_point: boolean;
    waste_water: boolean;
    waste_water_disposal: boolean;
    black_water_disposal: boolean;
  } | null;
  reviews: Review[];
  author: {
    id: string;
    email: string | null;
  } | null;
}

interface StationDetailProps {
  params: {
    id: string;
  };
}

export default function StationDetail({ params }: StationDetailProps) {
  const [station, setStation] = useState<StationWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [newRating, setNewRating] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  // const supabase = createClientComponentClient({
  //   supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  //   supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  // });
  const [error, setError] = useState<string | null>(null);
  // Nouveaux états pour l'édition
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [editPhoneNumber, setEditPhoneNumber] = useState("");

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

      // Recharger les détails de la station pour avoir les avis à jour
      const updatedResponse = await fetch(`/api/stations/${params.id}`);
      const updatedData = await updatedResponse.json();

      if (!updatedResponse.ok) {
        throw new Error("Erreur lors de la mise à jour des avis");
      }

      setStation(updatedData);
      setReviewsCount(updatedData.reviews?.length || 0);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'avis:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'ajout de l'avis"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchStationDetails = async () => {
      if (!params.id) {
        setError("Identifiant de station invalide");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/stations/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Erreur lors du chargement de la station"
          );
        }

        if (!data) {
          setError("Station non trouvée");
          return;
        }

        console.log("Données complètes de la station:", {
          description: data.description,
          phone_number: data.phone_number,
          name: data.name,
          address: data.address,
          // autres champs pour vérification
        });

        setStation(data);
        setReviewsCount(data.reviews?.length || 0);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Une erreur inattendue s'est produite lors du chargement de la station"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStationDetails();
  }, [params.id]);

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

  if (error) {
    return (
      <div className="min-h-screen bg-[#1E2337] flex items-center justify-center p-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg shadow-lg max-w-md w-full">
          <h3 className="text-lg font-semibold mb-2">Erreur</h3>
          <p className="mb-4">{error}</p>
          <div className="flex justify-between">
            <Button
              onClick={() => window.history.back()}
              className="bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Retour
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen bg-[#1E2337] flex items-center justify-center p-4">
        <div className="bg-yellow-50 text-yellow-600 p-6 rounded-lg shadow-lg max-w-md w-full">
          <h3 className="text-lg font-semibold mb-2">Station non trouvée</h3>
          <p className="mb-4">
            La station que vous recherchez n'existe pas ou a été supprimée.
          </p>
          <Button
            onClick={() => window.history.back()}
            className="bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
          >
            Retour aux stations
          </Button>
        </div>
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

          {/* Section pour le téléphone et la description */}
          <div className="mt-6 space-y-4">
            {station.phone_number && (
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <Phone className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Contact
                  </h3>
                  <a
                    href={`tel:${station.phone_number}`}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {station.phone_number}
                  </a>
                </div>
              </div>
            )}

            {station.description && (
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <Info className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Description
                  </h3>
                  <p className="text-gray-600 whitespace-pre-wrap mt-1">
                    {station.description}
                  </p>
                </div>
              </div>
            )}
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
            {station.services?.handicap_access && (
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
                {station.parking_details?.total_places || "N/A"}
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
              {station.type === "PARKING" && station.parking_details && (
                <>
                  {Object.entries(station.parking_details)
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

        {/* Section Contact et Description */}
        {(station.description || station.phone_number || isEditing) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Contact et Description</h3>
              {(session?.user?.email === station.author?.email ||
                session?.user?.email === "fortuna77320@gmail.com") && (
                <Button
                  onClick={() => {
                    if (isEditing) {
                      setIsEditing(false);
                    } else {
                      setEditDescription(station.description || "");
                      setEditPhoneNumber(station.phone_number || "");
                      setIsEditing(true);
                    }
                  }}
                  variant="outline"
                  className="text-blue-600 hover:text-blue-800"
                >
                  {isEditing ? "Annuler" : "Modifier"}
                </Button>
              )}
            </div>

            {isEditing ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const response = await fetch(`/api/stations/${params.id}`, {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        description: editDescription.trim(),
                        phone_number: editPhoneNumber.trim(),
                      }),
                    });

                    if (!response.ok) {
                      const error = await response.json();
                      console.error("Erreur lors de la mise à jour:", error);
                      return;
                    }

                    const updatedStation = await response.json();
                    setStation({
                      ...station,
                      description: updatedStation.description,
                      phone_number: updatedStation.phoneNumber,
                    });
                    setIsEditing(false);
                  } catch (error) {
                    console.error("Erreur:", error);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="phone_number"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Numéro de téléphone
                  </label>
                  <input
                    id="phone_number"
                    type="tel"
                    value={editPhoneNumber}
                    onChange={(e) => setEditPhoneNumber(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 0123456789"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Décrivez votre station..."
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Enregistrer
                  </Button>
                </div>
              </form>
            ) : (
              <>
                {station.phone_number && (
                  <div className="flex items-center gap-3 mb-4">
                    <Phone className="h-5 w-5 text-blue-500" />
                    <a
                      href={`tel:${station.phone_number}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {station.phone_number}
                    </a>
                  </div>
                )}

                {station.description && (
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-gray-500 mt-1" />
                    <p className="text-gray-700">{station.description}</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

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
                          {new Date(review.created_at).toLocaleDateString()}
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

        {/* Boutons d'action */}
        <div className="flex gap-4 mt-6">
          <Button
            onClick={() =>
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`,
                "_blank"
              )
            }
            className="flex-1 bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600"
          >
            <MapPin className="w-4 h-4 mr-2" />Y aller
          </Button>

          {station.phone_number && (
            <Button
              onClick={() =>
                (window.location.href = `tel:${station.phone_number}`)
              }
              className="flex-1 bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600"
            >
              <Phone className="w-4 h-4 mr-2" />
              Appeler
            </Button>
          )}

          {/* Bouton temporaire pour tester la mise à jour */}
          <Button
            onClick={async () => {
              try {
                const response = await fetch(`/api/stations/${params.id}`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    description:
                      "Station de lavage poids lourds avec portique haute pression. Accueil chaleureux et professionnel.",
                    phone_number: "0123456789",
                  }),
                });

                if (!response.ok) {
                  const error = await response.json();
                  console.error("Erreur lors de la mise à jour:", error);
                  return;
                }

                const updatedStation = await response.json();
                console.log("Station mise à jour:", updatedStation);
                window.location.reload();
              } catch (error) {
                console.error("Erreur:", error);
              }
            }}
            className="flex-1 bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600"
          >
            Mettre à jour les infos
          </Button>
        </div>
      </div>
    </div>
  );
}
