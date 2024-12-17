"use client";

import { GeoapifyResult, CamperWashStation } from "@/app/types";
import AddStationModal from "./AddStationModal";

interface AddStationModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: GeoapifyResult | null;
  onAddStation: (
    station: Omit<CamperWashStation, "id" | "createdAt">
  ) => Promise<void>;
}

export default function AddStationModalWrapper(
  props: AddStationModalWrapperProps
) {
  return <AddStationModal {...props} />;
}
