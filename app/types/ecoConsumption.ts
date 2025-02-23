import { User, Session } from "./auth";

export interface WashHistory {
  id: string;
  userId: string;
  stationId: string;
  date: Date;
  washType: string;
  vehicleSize: "small" | "medium" | "large";
  duration: number;
  waterUsed: number;
  waterSaved: number;
  ecoPoints: number;
  station?: {
    name: string;
  };
}

export interface WashType {
  id: string;
  name: string;
  baseConsumption: {
    min: number;
    max: number;
  };
}

export const washTypes: WashType[] = [
  {
    id: "high-pressure",
    name: "Haute pression manuel",
    baseConsumption: { min: 60, max: 80 },
  },
  {
    id: "rinse",
    name: "Rinçage seul",
    baseConsumption: { min: 30, max: 40 },
  },
];

export interface VehicleSize {
  id: "small" | "medium" | "large";
  name: string;
  factor: number;
}

export const vehicleSizes: VehicleSize[] = [
  { id: "small", name: "Petit (< 6m)", factor: 0.8 },
  { id: "medium", name: "Moyen (6-7m)", factor: 1 },
  { id: "large", name: "Grand (> 7m)", factor: 1.3 },
];

export interface EcoBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
}

export const ecoBadges: EcoBadge[] = [
  {
    id: "water-saver-1",
    name: "Économiseur Débutant",
    description: "Économisez 500L d'eau",
    icon: "💧",
    requirement: 500,
  },
  {
    id: "water-saver-2",
    name: "Économiseur Avancé",
    description: "Économisez 2000L d'eau",
    icon: "💧💧",
    requirement: 2000,
  },
  {
    id: "eco-warrior",
    name: "Guerrier Écologique",
    description: "10 lavages économiques consécutifs",
    icon: "🌱",
    requirement: 1000,
  },
  {
    id: "master-cleaner",
    name: "Maître du Nettoyage",
    description: "50 lavages enregistrés",
    icon: "🌟",
    requirement: 5000,
  },
];

export interface UserEcoStats {
  totalWaterSaved: number;
  totalEcoPoints: number;
  earnedBadges: EcoBadge[];
  washCount: number;
}

export interface WashResult {
  waterUsage: {
    min: number;
    max: number;
  };
  savings: number;
  ecoPoints: number;
  tips: string[];
}

export interface WashData {
  washType: string;
  vehicleSize: "small" | "medium" | "large";
  duration: number;
  waterUsed: number;
  waterSaved: number;
  ecoPoints: number;
}

export interface ExtendedUser extends User {
  ecoPoints: number;
}

export interface ExtendedSession extends Session {
  user: ExtendedUser;
}
