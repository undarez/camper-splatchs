import { Station, Service } from "@prisma/client";

export type StationWithServices = Station & {
  services: Service[];
  author: {
    name: string | null;
    image: string | null;
  };
};

export interface Location {
  properties: {
    lat: number;
    lon: number;
    address_line1: string;
    address_line2: string;
  };
}
