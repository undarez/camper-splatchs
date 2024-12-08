import { Service as PrismaService } from "@prisma/client";

export interface StationWithServices {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  services: PrismaService[];
}

export interface Location {
  properties: {
    lat: number;
    lon: number;
    address_line1: string;
    address_line2: string;
  };
}

export interface StationFilters {
  distance: number;
  highPressure: boolean;
  vacuum: boolean;
  wasteWater: boolean;
  handicapAccess: boolean;
  tirePressure: boolean;
}

// Pour une utilisation future avec le formulaire de création
export interface CreateStationInput {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  services: {
    highPressure: boolean;
    vacuum: boolean;
    wasteWater: boolean;
    handicapAccess: boolean;
    tirePressure: boolean;
  };
}
