import { Service as PrismaService } from "@prisma/client";
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
