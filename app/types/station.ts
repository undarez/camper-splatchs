import {
  ElectricityType,
  HighPressureType,
  type Station as PrismaBaseStation,
  Service,
  Review,
  StationType,
} from "@prisma/client";
import { Icon } from "leaflet";

// Interface de base pour les stations
export interface ExtendedStation extends PrismaBaseStation {
  isLavaTrans?: boolean;
  services: {
    id: string;
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
    paymentMethods: string[];
  } | null;
  parkingDetails: {
    id: string;
    isPayant: boolean;
    tarif: number | null;
    taxeSejour: number | null;
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
  } | null;
}

export interface ParkingDetails {
  id: string;
  isPayant: boolean;
  tarif: number | null;
  hasElectricity: ElectricityType;
  commercesProches: string[];
  handicapAccess: boolean;
  hasWifi?: boolean;
  hasChargingPoint?: boolean;
  waterPoint?: boolean;
  wasteWater?: boolean;
  wasteWaterDisposal?: boolean;
  blackWaterDisposal?: boolean;
}

// Interface pour les stations avec champs optionnels
export interface StationWithOptionalFields {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  status: string;
  type: StationType;
  isLavaTrans?: boolean;
  services: {
    id: string;
    highPressure: HighPressureType;
    tirePressure: boolean;
    vacuum: boolean;
    handicapAccess: boolean;
    wasteWater: boolean;
    waterPoint: boolean;
    wasteWaterDisposal: boolean;
    blackWaterDisposal: boolean;
    electricity: ElectricityType;
    maxVehicleLength: string | null;
    paymentMethods: string[];
  } | null;
  parkingDetails: ParkingDetails | null;
}

// Interface pour les stations avec la fonction getMarkerIcon
export interface StationWithMarker extends ExtendedStation {
  getMarkerIcon: () => Icon;
}

export interface StationWithDetails extends ExtendedStation {
  services: Service | null;
  images: string[];
  reviews: Review[];
  averageRating: number;
}
