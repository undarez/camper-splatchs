"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";
import NavigationButton from "@/app/pages/MapComponent/NavigationGpsButton/NavigationButton";
import { Carousel } from "@/app/components/ui/carousel";
import { Badge } from "@/app/components/ui/badge";
import {
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
  StarIcon,
  Trash,
  Banknote,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import WashLanesCorrected from "@/app/components/WashLanesCorrected";
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
  portique_price: "Prix du portique",
  manual_wash_price: "Prix du lavage manuel",
};

const renderServiceIcon = (key: string): JSX.Element | null => {
  switch (key) {
    case "highPressure":
    case "high_pressure":
      return <Wrench className="h-5 w-5 text-blue-500" />;
    case "tirePressure":
    case "tire_pressure":
      return <Wind className="h-5 w-5 text-green-500" />;
    case "vacuum":
      return <Wind className="h-5 w-5 text-purple-500" />;
    case "handicapAccess":
    case "handicap_access":
      return <Accessibility className="h-5 w-5 text-blue-500" />;
    case "wasteWater":
    case "waste_water":
      return <Droplet className="h-5 w-5 text-blue-500" />;
    case "waterPoint":
    case "water_point":
      return <Droplet className="h-5 w-5 text-cyan-500" />;
    case "wasteWaterDisposal":
    case "waste_water_disposal":
      return <Droplets className="h-5 w-5 text-blue-500" />;
    case "blackWaterDisposal":
    case "black_water_disposal":
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
    case "portiquePrice":
    case "portique_price":
      return <Euro className="h-5 w-5 text-green-500" />;
    case "manualWashPrice":
    case "manual_wash_price":
      return <Banknote className="h-5 w-5 text-green-500" />;
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
  if (key === "portique_price" || key === "portiquePrice") {
    if (value !== null && value !== undefined) {
      return `${Number(value).toFixed(2)}€ HT`;
    }
    return "Non spécifié";
  }
  if (key === "manual_wash_price" || key === "manualWashPrice") {
    if (value !== null && value !== undefined) {
      return `${Number(value).toFixed(2)}€ HT / 10min`;
    }
    return "Non spécifié";
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
  if (value === null || value === undefined) {
    return "Non spécifié";
  }
  return String(value);
};

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
  type: "STATION_LAVAGE" | "PARKING";
  description: string | null;
  phone_number: string | null;
  isDelisle?: boolean;
  isLavaTrans?: boolean;
  services?: {
    id: string;
    high_pressure?: string;
    tire_pressure?: boolean;
    vacuum?: boolean;
    water_point?: boolean;
    waste_water?: boolean;
    waste_water_disposal?: boolean;
    black_water_disposal?: boolean;
    handicap_access?: boolean;
    portique_price?: number | null;
    manual_wash_price?: number | null;
    // Propriétés originales
    highPressure?: string;
    tirePressure?: boolean;
    waterPoint?: boolean;
    wasteWater?: boolean;
    wasteWaterDisposal?: boolean;
    blackWaterDisposal?: boolean;
    handicapAccess?: boolean;
    portiquePrice?: number | null;
    manualWashPrice?: number | null;
    paymentMethods?: string[];
  };
  parking_details?: {
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
  };
  wash_lanes?: Array<{
    id: string;
    lane_number?: number;
    has_high_pressure?: boolean;
    has_buses_portique?: boolean;
    has_roller_portique?: boolean;
    // Propriétés originales
    laneNumber?: number;
    hasHighPressure?: boolean;
    hasBusesPortique?: boolean;
    hasRollerPortique?: boolean;
  }>;
  washLanes?: Array<{
    id: string;
    laneNumber: number;
    hasHighPressure: boolean;
    hasBusesPortique: boolean;
    hasRollerPortique: boolean;
  }>;
  reviews?: Array<{
    id: string;
    rating: number;
    content: string;
    created_at: string;
  }>;
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
      try {
        setLoading(true);
        const response = await fetch(`/api/stations/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Erreur lors du chargement de la station"
          );
        }

        // Vérification et transformation des données
        const transformedData: StationWithDetails = {
          ...data,
          type: data.type || "PARKING",
          isDelisle:
            data.isDelisle === true ||
            (data.name && data.name.includes("Delisle")),
          services: data.services
            ? {
                ...data.services,
                id: data.services.id || `service_${params.id}`,
                high_pressure:
                  data.services.highPressure || data.services.high_pressure,
                tire_pressure:
                  data.services.tirePressure || data.services.tire_pressure,
                water_point:
                  data.services.waterPoint || data.services.water_point,
                waste_water:
                  data.services.wasteWater || data.services.waste_water,
                waste_water_disposal:
                  data.services.wasteWaterDisposal ||
                  data.services.waste_water_disposal,
                black_water_disposal:
                  data.services.blackWaterDisposal ||
                  data.services.black_water_disposal,
                handicap_access:
                  data.services.handicapAccess || data.services.handicap_access,
                portique_price:
                  data.services.portiquePrice !== undefined
                    ? Number(data.services.portiquePrice)
                    : data.services.portique_price !== undefined
                    ? Number(data.services.portique_price)
                    : null,
                manual_wash_price:
                  data.services.manualWashPrice !== undefined
                    ? Number(data.services.manualWashPrice)
                    : data.services.manual_wash_price !== undefined
                    ? Number(data.services.manual_wash_price)
                    : null,
                portiquePrice:
                  data.services.portiquePrice !== undefined
                    ? Number(data.services.portiquePrice)
                    : data.services.portique_price !== undefined
                    ? Number(data.services.portique_price)
                    : null,
                manualWashPrice:
                  data.services.manualWashPrice !== undefined
                    ? Number(data.services.manualWashPrice)
                    : data.services.manual_wash_price !== undefined
                    ? Number(data.services.manual_wash_price)
                    : null,
              }
            : {
                id: `service_${params.id}`,
                high_pressure: undefined,
                tire_pressure: undefined,
                water_point: undefined,
                waste_water: undefined,
                waste_water_disposal: undefined,
                black_water_disposal: undefined,
                handicap_access: undefined,
                portique_price: null,
                manual_wash_price: null,
                portiquePrice: null,
                manualWashPrice: null,
              },
          wash_lanes: data.wash_lanes || data.washLanes || [],
          washLanes: data.washLanes || data.wash_lanes || [],
          parking_details: data.parkingDetails
            ? {
                id: data.parkingDetails.id,
                is_payant: Boolean(data.parkingDetails.isPayant),
                tarif: data.parkingDetails.tarif,
                taxe_sejour: data.parkingDetails.taxeSejour,
                has_electricity: data.parkingDetails.hasElectricity,
                commerces_proches: data.parkingDetails.commercesProches,
                handicap_access: Boolean(data.parkingDetails.handicapAccess),
                total_places: data.parkingDetails.totalPlaces,
                has_wifi: Boolean(data.parkingDetails.hasWifi),
                has_charging_point: Boolean(
                  data.parkingDetails.hasChargingPoint
                ),
                water_point: Boolean(data.parkingDetails.waterPoint),
                waste_water: Boolean(data.parkingDetails.wasteWater),
                waste_water_disposal: Boolean(
                  data.parkingDetails.wasteWaterDisposal
                ),
                black_water_disposal: Boolean(
                  data.parkingDetails.blackWaterDisposal
                ),
              }
            : undefined,
          reviews: data.reviews || [],
        };

        // Créer manuellement les pistes de lavage pour la station 17 si nécessaire
        if (
          params.id === "station_17" &&
          (!transformedData.wash_lanes ||
            transformedData.wash_lanes.length === 0)
        ) {
          const manualLanes = [
            {
              id: "lane_1",
              lane_number: 1,
              has_high_pressure: true,
              has_buses_portique: false,
              has_roller_portique: false,
              laneNumber: 1,
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
            {
              id: "lane_2",
              lane_number: 2,
              has_high_pressure: false,
              has_buses_portique: true,
              has_roller_portique: false,
              laneNumber: 2,
              hasHighPressure: false,
              hasBusesPortique: true,
              hasRollerPortique: false,
            },
            {
              id: "lane_3",
              lane_number: 3,
              has_high_pressure: true,
              has_buses_portique: false,
              has_roller_portique: false,
              laneNumber: 3,
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
            {
              id: "lane_4",
              lane_number: 4,
              has_high_pressure: true,
              has_buses_portique: false,
              has_roller_portique: false,
              laneNumber: 4,
              hasHighPressure: true,
              hasBusesPortique: false,
              hasRollerPortique: false,
            },
          ];
          transformedData.wash_lanes = manualLanes;
          transformedData.washLanes = manualLanes;
        }

        // Définir manuellement les prix pour la station 17 si nécessaire
        if (
          params.id === "station_17" &&
          !transformedData.services?.portiquePrice &&
          !transformedData.services?.portique_price
        ) {
          transformedData.services = {
            ...transformedData.services,
            id: transformedData.services?.id || "service_station_17",
            portiquePrice: 40,
            portique_price: 40,
            manualWashPrice: 10,
            manual_wash_price: 10,
          };
        }

        // Vérifier si c'est une station Delisle et définir les prix par défaut si nécessaire
        if (
          (transformedData.isDelisle ||
            (transformedData.name &&
              transformedData.name.includes("Delisle"))) &&
          !transformedData.services?.portiquePrice &&
          !transformedData.services?.portique_price
        ) {
          transformedData.services = {
            ...transformedData.services,
            id: transformedData.services?.id || `service_${params.id}`,
            portiquePrice: 40, // Prix par défaut pour les stations Delisle
            portique_price: 40,
            manualWashPrice: 10, // Prix par défaut pour les stations Delisle
            manual_wash_price: 10,
          };
        }

        setStation(transformedData);
        setReviewsCount(transformedData.reviews?.length || 0);

        // Initialiser les champs d'édition avec les valeurs actuelles
        if (transformedData.description)
          setEditDescription(transformedData.description);
        if (transformedData.phone_number)
          setEditPhoneNumber(transformedData.phone_number);
      } catch (error) {
        console.error("Erreur:", error);
        setError(
          error instanceof Error ? error.message : "Une erreur est survenue"
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

  if (loading) return <LoadingScreen />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!station)
    return <div className="text-gray-500 p-4">Station non trouvée</div>;

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Composant de débogage temporaire */}
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

          {/* Logo Delisle pour les stations Delisle */}
          {(station.isDelisle ||
            (station.name && station.name.includes("Delisle"))) && (
            <div className="flex justify-center my-6">
              <Image
                src="/images/delisle-article/delisle-logo.png"
                alt="Logo Delisle Lavage"
                width={240}
                height={120}
                className="object-contain"
              />
            </div>
          )}

          {/* Logo Lavatrans pour les stations Lavatrans */}
          {(station.isLavaTrans ||
            (station.name && station.name.includes("Lavatrans"))) && (
            <div className="flex justify-center my-6">
              <Image
                src="/images/article-lavatrans/lavatrans-logo.png"
                alt="Logo Lavatrans"
                width={280}
                height={120}
                className="object-contain"
              />
            </div>
          )}

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

        {/* Section Pistes de Lavage - Déplacée ici, juste après la présentation */}
        {station.type === "STATION_LAVAGE" && (
          <>
            {/* ID passé au composant: {params.id} */}
            <WashLanesCorrected stationId={params.id} />
          </>
        )}

        {/* Photos - placées juste après les pistes de lavage */}
        {station.images && station.images.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Photos de la station
            </h2>
            <div className="space-y-2">
              <Carousel className="w-full">
                {station.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-[16/9] md:aspect-[21/9] rounded-lg overflow-hidden h-[200px] md:h-[250px]"
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

        {/* Services disponibles - placés en dessous des photos en deux colonnes compactes */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
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

          {/* Prix des services - Affichage amélioré */}
          {((station.services?.portiquePrice !== undefined &&
            station.services?.portiquePrice !== null) ||
            (station.services?.portique_price !== undefined &&
              station.services?.portique_price !== null) ||
            (station.services?.manualWashPrice !== undefined &&
              station.services?.manualWashPrice !== null) ||
            (station.services?.manual_wash_price !== undefined &&
              station.services?.manual_wash_price !== null)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {((station.services?.portiquePrice !== undefined &&
                station.services?.portiquePrice !== null) ||
                (station.services?.portique_price !== undefined &&
                  station.services?.portique_price !== null)) && (
                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Euro className="h-5 w-5 text-green-500" />
                    <span className="text-gray-800 font-medium">
                      Prix du portique
                    </span>
                  </div>
                  <span className="text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-sm">
                    {`${Number(
                      station.services?.portiquePrice ||
                        station.services?.portique_price
                    ).toFixed(2)}€ HT`}
                  </span>
                </div>
              )}

              {((station.services?.manualWashPrice !== undefined &&
                station.services?.manualWashPrice !== null) ||
                (station.services?.manual_wash_price !== undefined &&
                  station.services?.manual_wash_price !== null)) && (
                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Banknote className="h-5 w-5 text-green-500" />
                    <span className="text-gray-800 font-medium">
                      Prix du lavage manuel
                    </span>
                  </div>
                  <span className="text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-sm">
                    {`${Number(
                      station.services?.manualWashPrice ||
                        station.services?.manual_wash_price
                    ).toFixed(2)}€ HT / 10min`}
                  </span>
                </div>
              )}
            </div>
          )}

          {station.type === "STATION_LAVAGE" && station.services && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(station.services)
                .filter(
                  ([key]) =>
                    key !== "id" &&
                    key !== "stationId" &&
                    key !== "createdAt" &&
                    key !== "portiquePrice" &&
                    key !== "portique_price" &&
                    key !== "manualWashPrice" &&
                    key !== "manual_wash_price"
                )
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      {renderServiceIcon(key)}
                      <span className="text-gray-800 font-medium">
                        {serviceLabels[key] || key}
                      </span>
                    </div>
                    <span className="text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-sm">
                      {renderServiceValue(key, value)}
                    </span>
                  </div>
                ))}
            </div>
          )}
          {station.type === "PARKING" && station.parking_details && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Prix des services */}
              <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                <div className="flex items-center gap-3">
                  <Euro className="h-5 w-5 text-green-500" />
                  <span className="text-gray-800 font-medium">Tarif</span>
                </div>
                <span className="text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-sm">
                  {station.parking_details.is_payant
                    ? `${station.parking_details.tarif}€/jour`
                    : "Gratuit"}
                </span>
              </div>

              {/* Électricité */}
              <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                <div className="flex items-center gap-3">
                  <Plug className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-800 font-medium">Électricité</span>
                </div>
                <span className="text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-sm">
                  {station.parking_details.has_electricity !== "NONE"
                    ? station.parking_details.has_electricity.replace(
                        "AMP_",
                        ""
                      ) + "A"
                    : "Non disponible"}
                </span>
              </div>

              {/* WiFi */}
              <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                <div className="flex items-center gap-3">
                  <Wifi className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-800 font-medium">WiFi</span>
                </div>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-sm",
                    station.parking_details.has_wifi
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-50 text-gray-600"
                  )}
                >
                  {station.parking_details.has_wifi
                    ? "Disponible"
                    : "Non disponible"}
                </span>
              </div>

              {/* Accès handicapé */}
              <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                <div className="flex items-center gap-3">
                  <Accessibility className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-800 font-medium">
                    Accès handicapé
                  </span>
                </div>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-sm",
                    station.parking_details.handicap_access
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-50 text-gray-600"
                  )}
                >
                  {station.parking_details.handicap_access
                    ? "Disponible"
                    : "Non disponible"}
                </span>
              </div>

              {/* Point d'eau */}
              <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                <div className="flex items-center gap-3">
                  <Droplet className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-800 font-medium">Point d'eau</span>
                </div>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-sm",
                    station.parking_details.water_point
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-50 text-gray-600"
                  )}
                >
                  {station.parking_details.water_point
                    ? "Disponible"
                    : "Non disponible"}
                </span>
              </div>

              {/* Vidange eaux usées */}
              <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                <div className="flex items-center gap-3">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-800 font-medium">
                    Vidange eaux usées
                  </span>
                </div>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-sm",
                    station.parking_details.waste_water
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-50 text-gray-600"
                  )}
                >
                  {station.parking_details.waste_water
                    ? "Disponible"
                    : "Non disponible"}
                </span>
              </div>

              {/* Évacuation eaux usées */}
              <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                <div className="flex items-center gap-3">
                  <Trash className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-800 font-medium">
                    Évacuation eaux usées
                  </span>
                </div>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-sm",
                    station.parking_details.waste_water_disposal
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-50 text-gray-600"
                  )}
                >
                  {station.parking_details.waste_water_disposal
                    ? "Disponible"
                    : "Non disponible"}
                </span>
              </div>

              {/* Évacuation eaux noires */}
              <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                <div className="flex items-center gap-3">
                  <Trash2 className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-800 font-medium">
                    Évacuation eaux noires
                  </span>
                </div>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-sm",
                    station.parking_details.black_water_disposal
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-50 text-gray-600"
                  )}
                >
                  {station.parking_details.black_water_disposal
                    ? "Disponible"
                    : "Non disponible"}
                </span>
              </div>

              {/* Commerces à proximité */}
              {station.parking_details.commerces_proches &&
                station.parking_details.commerces_proches.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 md:col-span-2">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="h-5 w-5 text-purple-500" />
                      <span className="text-gray-800 font-medium">
                        Commerces à proximité
                      </span>
                    </div>
                    <span className="text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-sm max-w-[50%] truncate">
                      {station.parking_details.commerces_proches.join(", ")}
                    </span>
                  </div>
                )}
            </div>
          )}
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
                    className={cn(
                      "w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      isSubmitting && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isSubmitting}
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
                    className={cn(
                      "w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      isSubmitting && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isSubmitting}
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
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {station.phone_number}
                    </a>
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
              {station?.reviews && station.reviews.length > 0 ? (
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
      </div>
    </div>
  );
}
