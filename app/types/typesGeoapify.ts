import type { LatLngTuple } from "leaflet";

export type GeoapifyResult = {
  properties: {
    formatted: string;
    lat: number;
    lon: number;
  };
};

export type StationStatus = "active" | "en_attente" | "inactive";

export type ServiceType = {
  id: string;
  highPressure: "NONE" | "PASSERELLE" | "ECHAFAUDAGE" | "PORTIQUE";
  tirePressure: boolean;
  vacuum: boolean;
  handicapAccess: boolean;
  wasteWater: boolean;
  waterPoint: boolean;
  wasteWaterDisposal: boolean;
  blackWaterDisposal: boolean;
  electricity: "NONE" | "AMP_8" | "AMP_15";
  maxVehicleLength: number | null;
  paymentMethods: ("JETON" | "ESPECES" | "CARTE_BANCAIRE")[];
};

export const SERVICE_LABELS: Record<
  keyof Omit<ServiceType, "id" | "paymentMethods">,
  string
> = {
  highPressure: "Haute pression",
  tirePressure: "Gonflage pneus",
  vacuum: "Aspirateur",
  handicapAccess: "Accès PMR",
  wasteWater: "Eaux usées",
  waterPoint: "Point d'eau",
  wasteWaterDisposal: "Vidange eaux usées",
  blackWaterDisposal: "Vidange eaux noires",
  electricity: "Électricité",
  maxVehicleLength: "Longueur maximale",
};

export interface StationServices {
  id?: string;
  highPressure: "NONE" | "PASSERELLE" | "ECHAFAUDAGE" | "PORTIQUE";
  tirePressure: boolean;
  vacuum: boolean;
  handicapAccess: boolean;
  wasteWater: boolean;
  waterPoint: boolean;
  wasteWaterDisposal: boolean;
  blackWaterDisposal: boolean;
  electricity: "NONE" | "AMP_8" | "AMP_15" | null;
  paymentMethods: ("JETON" | "ESPECES" | "CARTE_BANCAIRE")[];
  maxVehicleLength: number | null;
  stationId?: string;
}

export interface StationAuthor {
  name: string | null;
  email: string;
}

export interface CamperWashStation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  images?: string[];
  services: StationServices;
  status: StationStatus;
  author: {
    name: string | null;
    email: string;
  };
  createdAt: Date;
}
export type AddStationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: GeoapifyResult | null;
  onAddStation: (
    station: Omit<CamperWashStation, "id" | "createdAt">
  ) => Promise<void>;
};

export type StationFilters = {
  services: Partial<Record<keyof Omit<ServiceType, "id">, boolean>>;
  status: StationStatus | "all";
  search: string;
};

// export interface AddressProps {
//   onAddressSelect: (formatted: string, lat: number, lon: number) => void;
//   errors?: Record<string, { message?: string }>;
//   existingLocations?: CamperWashStation[];
//   defaultValue?: {
//     formatted: string;
//     lat: number;
//     lon: number;
//   };
// }

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
  services: Omit<ServiceType, "id">;
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
