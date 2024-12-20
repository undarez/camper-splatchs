import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { StationStatus } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStatusColor(status: StationStatus) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "en_attente":
      return "bg-yellow-100 text-yellow-800";
    case "inactive":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
