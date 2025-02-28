import {
  StationType,
  HighPressureType,
  ElectricityType,
  StationStatus,
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
  iconType: "PASSERELLE" | "ECHAFAUDAGE" | "PORTIQUE" | null;
  phoneNumber: string | null;
  description: string | null;
  images: string[] | null;
  validatedAt: Date | null;
  validatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  isLavaTrans: boolean;
  isDelisle: boolean;
  authorId: string;
  encryptedName: string | null;
  encryptedAddress: string | null;
  hasParking: boolean;
  userId: string;
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
    maxVehicleHeight: number | null;
    maxVehicleWidth: number | null;
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
    hasCctv: boolean;
    hasBarrier: boolean;
    maxDuration: string | null;
    maxVehicleHeight: number | null;
    maxVehicleLength: number | null;
    maxVehicleWidth: number | null;
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
    iconType: station.iconType,
    phoneNumber: station.phoneNumber,
    description: station.description,
    images: station.images || [],
    validatedAt: station.validatedAt,
    validatedBy: station.validatedBy,
    createdAt: station.createdAt,
    updatedAt: station.updatedAt,
    isLavaTrans: station.isLavaTrans,
    isDelisle: station.isDelisle ?? false,
    authorId: station.authorId,
    encryptedName: station.encryptedName,
    encryptedAddress: station.encryptedAddress,
    hasParking: station.hasParking,
    userId: station.userId,
    services: station.services
      ? {
          id: station.services.id,
          stationId: station.id,
          createdAt: station.createdAt,
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
          maxVehicleHeight: station.services.maxVehicleHeight || null,
          maxVehicleWidth: station.services.maxVehicleWidth || null,
          paymentMethods: station.services.paymentMethods,
        }
      : null,
    parkingDetails: station.parkingDetails
      ? {
          id: station.parkingDetails.id,
          stationId: station.id,
          isPayant: station.parkingDetails.isPayant,
          tarif: station.parkingDetails.tarif?.toString() || null,
          taxeSejour: station.parkingDetails.taxeSejour?.toString() || null,
          hasElectricity: station.parkingDetails
            .hasElectricity as ElectricityType,
          commercesProches: station.parkingDetails.commercesProches,
          handicapAccess: station.parkingDetails.handicapAccess,
          totalPlaces: station.parkingDetails.totalPlaces,
          hasWifi: station.parkingDetails.hasWifi,
          hasChargingPoint: station.parkingDetails.hasChargingPoint,
          waterPoint: station.parkingDetails.waterPoint,
          wasteWater: station.parkingDetails.wasteWater,
          wasteWaterDisposal: station.parkingDetails.wasteWaterDisposal,
          blackWaterDisposal: station.parkingDetails.blackWaterDisposal,
          hasCctv: station.parkingDetails.hasCctv,
          hasBarrier: station.parkingDetails.hasBarrier,
          maxDuration: station.parkingDetails.maxDuration?.toString() || null,
          maxVehicleHeight: station.parkingDetails.maxVehicleHeight,
          maxVehicleLength: station.parkingDetails.maxVehicleLength,
          maxVehicleWidth: station.parkingDetails.maxVehicleWidth,
          createdAt: station.parkingDetails.createdAt,
        }
      : null,
  }));
}
