import {
  StationType,
  HighPressureType,
  ElectricityType,
  StationStatus,
  PaymentMethod,
} from "@prisma/client";
import type { StationWithOptionalFields } from "@/app/components/Map/index";

interface Station {
  id: string;
  name: string;
  address: string;
  city: string | null;
  postalCode: string | null;
  latitude: number;
  longitude: number;
  status: StationStatus;
  type: StationType;
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
    createdAt: Date;
  } | null;
}

export function convertStationsToOptionalFields(
  stations: Station[]
): StationWithOptionalFields[] {
  return stations.map((station) => ({
    id: station.id,
    name: station.name,
    address: station.address,
    city: station.city,
    postalCode: station.postalCode,
    latitude: station.latitude,
    longitude: station.longitude,
    status: station.status as StationStatus,
    type: station.type as StationType,
    services: station.services
      ? {
          id: station.services.id,
          highPressure: station.services.highPressure as HighPressureType,
          tirePressure: station.services.tirePressure,
          vacuum: station.services.vacuum,
          handicapAccess: station.services.handicapAccess,
          wasteWater: station.services.wasteWater,
          waterPoint: station.services.waterPoint,
          wasteWaterDisposal: station.services.wasteWaterDisposal,
          blackWaterDisposal: station.services.blackWaterDisposal,
          electricity: station.services.electricity as ElectricityType,
          maxVehicleLength: station.services.maxVehicleLength,
          paymentMethods: station.services.paymentMethods.map(
            (method) => method as PaymentMethod
          ),
        }
      : null,
    parkingDetails: station.parkingDetails
      ? {
          id: station.parkingDetails.id,
          isPayant: station.parkingDetails.isPayant,
          tarif: station.parkingDetails.tarif,
          hasElectricity: station.parkingDetails
            .hasElectricity as ElectricityType,
          commercesProches: station.parkingDetails.commercesProches,
          handicapAccess: station.parkingDetails.handicapAccess,
        }
      : null,
  }));
}
