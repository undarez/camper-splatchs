import {
  ElectricityType,
  HighPressureType,
  StationStatus,
  StationType,
} from "@prisma/client";

export interface StationWithDetails {
  id: string;
  name: string;
  address: string;
  city: string | null;
  postalCode: string | null;
  latitude: number;
  longitude: number;
  status: StationStatus;
  type: StationType;
  iconType: "PASSERELLE" | "ECHAFAUDAGE" | "PORTIQUE" | null;
  phoneNumber: string | null;
  description: string | null;
  images: string[];
  validatedAt: Date | null;
  validatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  isLavaTrans: boolean;
  isDelisle: boolean;
  isCosmeticar: boolean;
  authorId: string;
  encryptedName: string | null;
  encryptedAddress: string | null;
  hasParking: boolean;
  userId: string;
  services: {
    id: string;
    stationId: string;
    createdAt: Date;
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
  parkingDetails: {
    id: string;
    stationId: string;
    createdAt: Date;
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
  } | null;
  averageRating: number;
  reviews: {
    id: string;
    createdAt: Date;
    authorId: string;
    userId: string | null;
    content: string;
    encryptedContent: string;
    rating: number;
    stationId: string;
  }[];
}
