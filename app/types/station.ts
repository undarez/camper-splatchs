import {
  ElectricityType,
  HighPressureType,
  type Station,
  type Review as PrismaReview,
  StationType,
  Prisma,
  StationStatus,
} from "@prisma/client";
import { Icon } from "leaflet";

export type BaseStation = Prisma.StationGetPayload<{
  include: {
    services: true;
    parkingDetails: true;
    reviews: true;
  };
}>;

// Type pour les services avec tous les champs requis
export interface ServiceDetails {
  id: string;
  createdAt: Date;
  stationId: string;
  highPressure: HighPressureType;
  tirePressure: boolean;
  vacuum: boolean;
  handicapAccess: boolean;
  wasteWater: boolean;
  waterPoint: boolean;
  wasteWaterDisposal: boolean;
  blackWaterDisposal: boolean;
  electricity: ElectricityType;
  maxVehicleLength: number | null;
  maxVehicleHeight: number | null;
  maxVehicleWidth: number | null;
  paymentMethods: string[];
}

// Interface pour les détails de parking
export interface ParkingDetails {
  id: string;
  createdAt: Date;
  stationId: string;
  isPayant: boolean;
  tarif: string | null;
  taxeSejour: string | null;
  hasElectricity: ElectricityType;
  commercesProches: string[];
  handicapAccess: boolean;
  totalPlaces: number;
  hasWifi: boolean;
  hasChargingPoint: boolean;
  waterPoint: boolean;
  wasteWater: boolean;
  wasteWaterDisposal: boolean;
  blackWaterDisposal: boolean;
  hasCctv: boolean;
  hasBarrier: boolean;
  maxDuration: string | null;
  maxVehicleHeight: number | null;
  maxVehicleLength: number | null;
  maxVehicleWidth: number | null;
}

// Interface de base pour les stations
export interface ExtendedStation extends Station {
  isLavaTrans: boolean;
  phoneNumber: string | null;
  description: string | null;
  iconType: "PASSERELLE" | "PORTIQUE" | "ECHAFAUDAGE" | null;
  status: "active" | "en_attente" | "inactive";
  services: ServiceDetails | null;
  parkingDetails: ParkingDetails | null;
}

// Interface pour les stations avec champs optionnels
export interface StationWithOptionalFields
  extends Omit<Station, "parkingDetails" | "services"> {
  isLavaTrans?: boolean;
  iconType: "PASSERELLE" | "PORTIQUE" | "ECHAFAUDAGE" | null;
  status: StationStatus;
  phoneNumber: string | null;
  description: string | null;
  parkingDetails?: {
    id: string;
    createdAt: Date;
    stationId: string;
    isPayant: boolean;
    tarif: number | null;
    taxeSejour: string | null;
    hasElectricity: ElectricityType;
    commercesProches: string[];
    handicapAccess: boolean;
    totalPlaces: number;
    hasWifi: boolean;
    hasChargingPoint: boolean;
    waterPoint: boolean;
    wasteWater: boolean;
    wasteWaterDisposal: boolean;
    blackWaterDisposal: boolean;
    hasCctv: boolean;
    hasBarrier: boolean;
    maxDuration: string | null;
    maxVehicleHeight: number | null;
    maxVehicleLength: number | null;
    maxVehicleWidth: number | null;
  } | null;
  services?: {
    id: string;
    createdAt: Date;
    stationId: string;
    highPressure: HighPressureType;
    tirePressure: boolean;
    vacuum: boolean;
    handicapAccess: boolean;
    wasteWater: boolean;
    waterPoint: boolean;
    wasteWaterDisposal: boolean;
    blackWaterDisposal: boolean;
    electricity: ElectricityType;
    maxVehicleLength: number | null;
    maxVehicleHeight: number | null;
    maxVehicleWidth: number | null;
    paymentMethods: string[];
  } | null;
  author?: {
    name: string | null;
    email: string | null;
  } | null;
  reviews?:
    | {
        id: string;
        rating: number;
        comment: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string;
        stationId: string;
      }[]
    | null;
}

// Interface pour les stations avec la fonction getMarkerIcon
export interface StationWithMarker extends ExtendedStation {
  getMarkerIcon: () => Icon;
}

export interface StationWithDetails extends ExtendedStation {
  services: ServiceDetails | null;
  images: string[];
  reviews: PrismaReview[];
  averageRating: number;
  parkingDetails: ParkingDetails | null;
  phoneNumber: string | null;
  description: string | null;
}

export interface Review extends PrismaReview {
  id: string;
  stationId: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export { StationType, StationStatus };
