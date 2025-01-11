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
  Calendar,
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

const serviceLabels: Record<string, string> = {
  highPressure: "Type de haute pression",
  electricity: "Type d'électricité",
  paymentMethods: "Modes de paiement",
  tirePressure: "Gonflage pneus",
  vacuum: "Aspirateur",
  handicapAccess: "Accès handicapé",
  wasteWater: "Eaux usées",
  waterPoint: "Point d'eau",
  wasteWaterDisposal: "Évacuation eaux usées",
  blackWaterDisposal: "Évacuation eaux noires",
  maxVehicleLength: "Longueur maximale du véhicule",
  isPayant: "Parking payant",
  tarif: "Tarif",
  taxeSejour: "Taxe de séjour",
  hasElectricity: "Électricité",
  commercesProches: "Commerces à proximité",
  totalPlaces: "Nombre de places",
  hasWifi: "WiFi",
  hasChargingPoint: "Point de recharge",
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

  if (key === "electricity" || key === "hasElectricity") {
    const labels: Record<string, string> = {
      NONE: "Pas d'électricité",
      AMP_8: "8 Ampères",
      AMP_15: "15 Ampères",
    };
    return labels[value as string] || String(value);
  }

  if (key === "paymentMethods" && Array.isArray(value)) {
    const labels: Record<string, string> = {
      JETON: "Jeton",
      ESPECES: "Espèces",
      CARTE_BANCAIRE: "Carte bancaire",
    };
    return value.map((method) => labels[method as string] || method).join(", ");
  }

  if (key === "commercesProches" && Array.isArray(value)) {
    const labels: Record<string, string> = {
      NOURRITURE: "Alimentation",
      BANQUE: "Banque",
      CENTRE_VILLE: "Centre-ville",
      STATION_SERVICE: "Station-service",
      LAVERIE: "Laverie",
      GARAGE: "Garage",
    };
    return value
      .map((commerce) => labels[commerce as string] || commerce)
      .join(", ");
  }

  if (key === "isPayant" && typeof value === "boolean") {
    return value ? "Payant" : "Gratuit";
  }

  if (key === "tarif" && value) {
    return `${value}€/jour`;
  }

  if (key === "taxeSejour" && value) {
    return `${value}€/jour`;
  }

  if (key === "totalPlaces" && value) {
    return `${value} places`;
  }

  if (typeof value === "boolean") {
    return value ? "Disponible" : "Non disponible";
  }

  return value ? String(value) : "Non spécifié";
};

interface ServiceIcons {
  waterPoint: JSX.Element;
  hasWifi: JSX.Element;
  hasElectricity: JSX.Element;
  commercesProches: JSX.Element;
  handicapAccess: JSX.Element;
  paymentMethods: JSX.Element;
  isPayant: JSX.Element;
  taxeSejour: JSX.Element;
  maxVehicleLength: JSX.Element;
  tirePressure: JSX.Element;
  vacuum: JSX.Element;
  wasteWater: JSX.Element;
  wasteWaterDisposal: JSX.Element;
  blackWaterDisposal: JSX.Element;
  maintenance: JSX.Element;
}

const getServiceIcon = (service: string) => {
  const icons: ServiceIcons = {
    waterPoint: <Droplet className="h-5 w-5 text-blue-500" />,
    hasWifi: <Wifi className="h-5 w-5 text-green-500" />,
    hasElectricity: <Plug className="h-5 w-5 text-yellow-500" />,
    commercesProches: <ShoppingBag className="h-5 w-5 text-purple-500" />,
    handicapAccess: <Accessibility className="h-5 w-5 text-blue-600" />,
    paymentMethods: <CreditCard className="h-5 w-5 text-gray-600" />,
    isPayant: <Euro className="h-5 w-5 text-green-600" />,
    taxeSejour: <Calendar className="h-5 w-5 text-orange-500" />,
    maxVehicleLength: <Ruler className="h-5 w-5 text-indigo-500" />,
    tirePressure: <Wind className="h-5 w-5 text-cyan-500" />,
    vacuum: <Wind className="h-5 w-5 text-purple-500" />,
    wasteWater: <Droplets className="h-5 w-5 text-red-500" />,
    wasteWaterDisposal: <Trash2 className="h-5 w-5 text-brown-500" />,
    blackWaterDisposal: <Trash2 className="h-5 w-5 text-gray-700" />,
    maintenance: <Wrench className="h-5 w-5 text-gray-500" />,
  };

  return icons[service as keyof ServiceIcons] || null;
};

const StationDetail = ({ params }: { params: { id: string } }) => {
  const [station, setStation] = useState<StationWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewsCount, setReviewsCount] = useState(0);
  const { data: session } = useSession();
  const supabase = createClientComponentClient();

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

        {/* Services disponibles */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Services disponibles</h2>
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
              {station.type === "STATION_LAVAGE" &&
                station.services &&
                Object.entries(station.services)
                  .filter(([key]) => key !== "id" && key !== "stationId")
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getServiceIcon(key)}
                        <span className="text-gray-700 font-medium">
                          {serviceLabels[key] || key}
                        </span>
                      </div>
                      <span className="text-gray-600">
                        {renderServiceValue(key, value)}
                      </span>
                    </div>
                  ))}
            </div>
          </div>

          {/* Photos */}
          {station.images && station.images.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Photos</h2>
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
          )}
        </div>

        {/* Avis */}
        {station.reviews && station.reviews.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
            <h2 className="text-xl font-semibold mb-4">
              Avis des utilisateurs
            </h2>
            <div className="grid gap-4">
              {station.reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
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
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StationDetail;
