"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  GeoapifyResult,
  CamperWashStation,
  PaymentMethodType,
  StationServices,
  HighPressureType,
  ElectricityType,
} from "@/app/types";
import { StationType } from "@prisma/client";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";

const AdressGeoapifyWithNoSSR = dynamic(
  () => import("@/app/components/AdressGeoapify/AdressGeoapify"),
  { ssr: false }
);

interface AddStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: GeoapifyResult | null;
  onAddStation: (
    station: Omit<CamperWashStation, "id" | "createdAt">
  ) => Promise<void>;
}

const PAYMENT_METHODS: PaymentMethodType[] = [
  "JETON",
  "ESPECES",
  "CARTE_BANCAIRE",
];

const defaultServices: StationServices = {
  highPressure: "NONE",
  tirePressure: false,
  vacuum: false,
  handicapAccess: false,
  wasteWater: false,
  waterPoint: false,
  wasteWaterDisposal: false,
  blackWaterDisposal: false,
  electricity: "NONE",
  paymentMethods: [],
  maxVehicleLength: null,
};

export default function AddStationModal({
  isOpen,
  onClose,
  selectedLocation,
  onAddStation,
}: AddStationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    services: defaultServices,
    lat: selectedLocation?.properties?.lat || 0,
    lng: selectedLocation?.properties?.lon || 0,
  });

  useEffect(() => {
    if (selectedLocation?.properties) {
      setFormData((prev) => ({
        ...prev,
        lat: selectedLocation.properties.lat,
        lng: selectedLocation.properties.lon,
      }));
    }
  }, [selectedLocation]);

  const handleServiceChange = (
    serviceName: keyof StationServices,
    value:
      | boolean
      | HighPressureType
      | ElectricityType
      | PaymentMethodType[]
      | number
      | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [serviceName]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation?.properties) {
      toast.error("Veuillez sélectionner une adresse valide");
      return;
    }

    const stationData = {
      name: formData.name,
      address: selectedLocation.properties.formatted,
      city: "",
      postalCode: "",
      latitude: selectedLocation.properties.lat,
      longitude: selectedLocation.properties.lon,
      type: StationType.STATION_LAVAGE,
      status: "en_attente" as const,
      images: [],
      services: {
        id: `service-${Date.now()}`,
        highPressure: formData.services.highPressure,
        tirePressure: formData.services.tirePressure,
        vacuum: formData.services.vacuum,
        handicapAccess: formData.services.handicapAccess,
        wasteWater: formData.services.wasteWater,
        waterPoint: formData.services.waterPoint,
        wasteWaterDisposal: formData.services.wasteWaterDisposal,
        blackWaterDisposal: formData.services.blackWaterDisposal,
        electricity: formData.services.electricity,
        maxVehicleLength: formData.services.maxVehicleLength,
        paymentMethods: formData.services.paymentMethods,
      },
      parkingDetails: null,
      author: {
        name: null,
        email: null,
      },
    };

    onAddStation(stationData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle station</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom de la station</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Adresse</Label>
              <AdressGeoapifyWithNoSSR
                onAddressSelect={(location: Partial<CamperWashStation>) => {
                  setFormData((prev) => ({
                    ...prev,
                    address: location.address || "",
                    lat: location.latitude || 0,
                    lng: location.longitude || 0,
                  }));
                }}
                existingLocations={[]}
                isModalOpen={isOpen}
              />
            </div>

            <div className="grid gap-2">
              <Label>Services disponibles</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="highPressure">Haute pression</Label>
                  <select
                    id="highPressure"
                    value={formData.services.highPressure}
                    onChange={(e) =>
                      handleServiceChange(
                        "highPressure",
                        e.target.value as HighPressureType
                      )
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="NONE">Aucune</option>
                    <option value="PASSERELLE">Passerelle</option>
                    <option value="ECHAFAUDAGE">Échafaudage</option>
                    <option value="PORTIQUE">Portique</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="electricity">Électricité</Label>
                  <select
                    id="electricity"
                    value={formData.services.electricity}
                    onChange={(e) =>
                      handleServiceChange(
                        "electricity",
                        e.target.value as ElectricityType
                      )
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="NONE">Aucune</option>
                    <option value="AMP_8">8 Ampères</option>
                    <option value="AMP_15">15 Ampères</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="tirePressure"
                    checked={formData.services.tirePressure}
                    onChange={(e) =>
                      handleServiceChange("tirePressure", e.target.checked)
                    }
                  />
                  <Label htmlFor="tirePressure">Pression des pneus</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="vacuum"
                    checked={formData.services.vacuum}
                    onChange={(e) =>
                      handleServiceChange("vacuum", e.target.checked)
                    }
                  />
                  <Label htmlFor="vacuum">Aspirateur</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="handicapAccess"
                    checked={formData.services.handicapAccess}
                    onChange={(e) =>
                      handleServiceChange("handicapAccess", e.target.checked)
                    }
                  />
                  <Label htmlFor="handicapAccess">Accès handicapé</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="wasteWater"
                    checked={formData.services.wasteWater}
                    onChange={(e) =>
                      handleServiceChange("wasteWater", e.target.checked)
                    }
                  />
                  <Label htmlFor="wasteWater">Eaux usées</Label>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Moyens de paiement</Label>
              <div className="flex gap-4">
                {PAYMENT_METHODS.map((method) => (
                  <div key={method} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={method}
                      checked={formData.services.paymentMethods.includes(
                        method
                      )}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          services: {
                            ...prev.services,
                            paymentMethods: e.target.checked
                              ? [...prev.services.paymentMethods, method]
                              : prev.services.paymentMethods.filter(
                                  (m) => m !== method
                                ),
                          },
                        }));
                      }}
                    />
                    <Label htmlFor={method}>
                      {method === "JETON"
                        ? "Jeton"
                        : method === "ESPECES"
                        ? "Espèces"
                        : "Carte bancaire"}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="maxVehicleLength">
                Longueur maximale du véhicule (en mètres)
              </Label>
              <Input
                type="number"
                id="maxVehicleLength"
                value={formData.services.maxVehicleLength ?? ""}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    services: {
                      ...prev.services,
                      maxVehicleLength: e.target.value
                        ? Number(e.target.value)
                        : null,
                    },
                  }));
                }}
                className="w-full"
                placeholder="Longueur maximale du véhicule"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">Ajouter la station</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
