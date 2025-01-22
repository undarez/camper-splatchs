import {
  Service as PrismaService,
  Station,
  Service,
  Review,
  ElectricityType,
} from "@prisma/client";
import { ServiceType, StationStatus } from "./index";

export type StationWithPrismaServices = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  services: PrismaService[];
  status: StationStatus;
};

export type CreateStationInput = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  services: Omit<ServiceType, "id" | "stationId">;
};

export interface StationWithDetails extends Station {
  services: Service | null;
  images: string[];
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
    createdAt: Date;
  } | null;
  reviews: Review[];
  averageRating: number;
}
