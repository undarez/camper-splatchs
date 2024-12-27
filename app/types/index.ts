import type { LatLngTuple } from "leaflet";
import { ServiceType } from "./typesGeoapify";

export type StationStatus = "active" | "en_attente" | "inactive";

export type HighPressureType =
  | "NONE"
  | "PASSERELLE"
  | "ECHAFAUDAGE"
  | "PORTIQUE";
export type ElectricityType = "NONE" | "AMP_8" | "AMP_15";
export type PaymentMethodType = "JETON" | "ESPECES" | "CARTE_BANCAIRE";

export type { ServiceType };

export interface StationServices {
  id?: string;
  highPressure: HighPressureType;
  tirePressure: boolean;
  vacuum: boolean;
  handicapAccess: boolean;
  wasteWater: boolean;
  waterPoint: boolean;
  wasteWaterDisposal: boolean;
  blackWaterDisposal: boolean;
  electricity: ElectricityType;
  paymentMethods: PaymentMethodType[];
  maxVehicleLength: number | null;
  stationId?: string;
}

export const SERVICE_LABELS: Record<string, string> = {
  highPressure: "Haute pression",
  tirePressure: "Gonflage pneus",
  vacuum: "Aspirateur",
  handicapAccess: "Accès PMR",
  wasteWater: "Eaux usées",
  waterPoint: "Point d'eau",
  wasteWaterDisposal: "Vidange eaux usées",
  blackWaterDisposal: "Vidange eaux noires",
  electricity: "Électricité",
};

export type StationAuthor = {
  name: string | null;
  email: string;
  image?: string | null;
};

export interface CamperWashStation {
  id: string;
  name: string;
  address: string;
  city: string | null;
  postalCode: string | null;
  latitude: number;
  longitude: number;
  images: string[];
  status: string;
  type: string;
  services: {
    id: string;
    highPressure: string;
    tirePressure: boolean;
    vacuum: boolean;
    handicapAccess: boolean;
    wasteWater: boolean;
    waterPoint: boolean;
    wasteWaterDisposal: boolean;
    blackWaterDisposal: boolean;
    electricity: string;
    maxVehicleLength: number | null;
    paymentMethods: string[];
  } | null;
  parkingDetails: {
    id: string;
    isPayant: boolean;
    tarif: number | null;
    hasElectricity: string;
    commercesProches: string[];
    handicapAccess: boolean;
  } | null;
  author: {
    name: string | null;
    email: string | null;
  };
  createdAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  stationId: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName?: string;
}

export interface GeoapifyResult {
  properties: {
    lat: number;
    lon: number;
    formatted: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    postcode?: string;
    country?: string;
  };
}

export type StationFilters = {
  services: Partial<
    Record<
      keyof Omit<
        ServiceType,
        | "id"
        | "electricity"
        | "paymentMethods"
        | "maxVehicleLength"
        | "stationId"
      >,
      boolean
    >
  >;
  status: StationStatus | "all";
  search: string;
};

export type MapComponentProps = {
  position: LatLngTuple;
  selectedLocation: CamperWashStation | null;
  existingLocations: CamperWashStation[];
  onLocationSelect: (location: CamperWashStation) => void;
  onMarkerDragEnd?: (lat: number, lng: number) => void;
};

export type FormValues = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  services: Omit<ServiceType, "id" | "stationId">;
  images: string[];
};

export type IconType = StationStatus | "default" | "selected";

export type StationStats = {
  totalStations: number;
  activeStations: number;
  pendingStations: number;
  inactiveStations: number;
  stationsPerService: Array<{
    name: string;
    count: number;
  }>;
  recentActivity: Array<{
    date: string;
    count: number;
    type: "creation" | "validation" | "deletion";
  }>;
};

export type StationCardProps = {
  station: CamperWashStation;
  onStatusChange?: (id: string, status: StationStatus) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  isAdmin?: boolean;
  showActions?: boolean;
};
