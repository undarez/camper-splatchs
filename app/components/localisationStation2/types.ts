import { StationType, HighPressureType, ElectricityType } from "@prisma/client";

export interface StationData {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  lat: number | null;
  lng: number | null;
  type: StationType;
  highPressure: HighPressureType;
  tirePressure: boolean;
  vacuum: boolean;
  handicapAccess: boolean;
  wasteWater: boolean;
  waterPoint: boolean;
  wasteWaterDisposal: boolean;
  blackWaterDisposal: boolean;
  electricity: ElectricityType;
  hasElectricity: ElectricityType;
  maxVehicleLength: string;
  paymentMethods: string[];
  isPayant: boolean;
  tarif: string;
  commercesProches: string[];
  taxeSejour: string;
  totalPlaces: number;
  hasWifi: boolean;
  hasChargingPoint: boolean;
  isCosmeticar: boolean;
  phoneNumber?: string;
  description?: string;
}
