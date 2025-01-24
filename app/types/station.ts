import {
  Service as PrismaService,
  Station as PrismaStation,
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

export interface StationWithDetails extends PrismaStation {
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

export interface Station {
  id: string;
  name: string;
  address: string;
  city?: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  images: string[];
  status: "active" | "en_attente" | "inactive";
  type: "STATION_LAVAGE" | "PARKING";
  validatedAt?: Date;
  validatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  userId?: string;
  hasParking?: boolean;
}
