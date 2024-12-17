import { icon } from "leaflet";
import type { Icon } from "leaflet";
import { IconType } from "@/app/types";

export const createIcon = (color: string): Icon => {
  return icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

export const icons: Record<IconType, Icon> = {
  default: createIcon("blue"),
  active: createIcon("green"),
  inactive: createIcon("red"),
  en_attente: createIcon("orange"),
  selected: createIcon("yellow"),
};
