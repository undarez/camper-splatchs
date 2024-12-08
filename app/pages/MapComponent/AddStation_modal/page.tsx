"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GeoapifyResult, CamperWashStation } from "@/app/types/typesGeoapify";
import { v4 as uuidv4 } from "uuid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: GeoapifyResult | null;
  onAddStation: (
    station: Omit<CamperWashStation, "id" | "createdAt">
  ) => Promise<void>;
}

type StationServicesData = {
  id: string;
  highPressure: "NONE" | "PASSERELLE" | "ECHAFAUDAGE" | "PORTIQUE";
  tirePressure: boolean;
  vacuum: boolean;
  handicapAccess: boolean;
  wasteWater: boolean;
  electricity: "NONE" | "AMP_8" | "AMP_15";
  paymentMethods: ("JETON" | "ESPECES" | "CARTE_BANCAIRE")[];
  maxVehicleLength: number | null;
  stationId: string;
};

const AddStationModal = ({
  isOpen,
  onClose,
  selectedLocation,
  onAddStation,
}: AddStationModalProps) => {
  const [name, setName] = useState("");
  const [services, setServices] = useState<StationServicesData>({
    id: uuidv4(),
    highPressure: "NONE",
    tirePressure: false,
    vacuum: false,
    handicapAccess: false,
    wasteWater: false,
    electricity: "NONE",
    paymentMethods: [],
    maxVehicleLength: null,
    stationId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) return;

    setIsSubmitting(true);
    try {
      await onAddStation({
        name,
        address: selectedLocation.properties.formatted,
        lat: selectedLocation.properties.lat,
        lng: selectedLocation.properties.lon,
        images: [],
        services,
        status: "en_attente",
        author: {
          name: null,
          email: "",
        },
      });

      await fetch("/api/notify-new-station", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          address: selectedLocation.properties.formatted,
        }),
      });

      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la station:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset le formulaire quand il se ferme
  const handleClose = () => {
    setName("");
    setServices({
      id: uuidv4(),
      highPressure: "NONE",
      tirePressure: false,
      vacuum: false,
      handicapAccess: false,
      wasteWater: false,
      electricity: "NONE",
      paymentMethods: [],
      maxVehicleLength: null,
      stationId: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter une station</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom de la station</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Station Paris Centre"
              required
            />
          </div>

          <div>
            <Label>Adresse</Label>
            <p className="text-sm text-muted-foreground">
              {selectedLocation?.properties.formatted}
            </p>
          </div>

          <div className="space-y-4">
            <Label>Services disponibles</Label>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="highPressure">Type de haute pression</Label>
                <Select
                  value={services.highPressure}
                  onValueChange={(value) =>
                    setServices({
                      ...services,
                      highPressure: value as
                        | "NONE"
                        | "PASSERELLE"
                        | "ECHAFAUDAGE"
                        | "PORTIQUE",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Aucune haute pression</SelectItem>
                    <SelectItem value="PASSERELLE">Passerelle</SelectItem>
                    <SelectItem value="ECHAFAUDAGE">Échafaudage</SelectItem>
                    <SelectItem value="PORTIQUE">Portique</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="electricity">Type d&apos;électricité</Label>
                <Select
                  value={services.electricity}
                  onValueChange={(value: "NONE" | "AMP_8" | "AMP_15") =>
                    setServices({
                      ...services,
                      electricity: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Pas d&apos;électricité</SelectItem>
                    <SelectItem value="AMP_8">8 Ampères</SelectItem>
                    <SelectItem value="AMP_15">15 Ampères</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Modes de paiement acceptés</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="JETON"
                      checked={services.paymentMethods.includes("JETON")}
                      onCheckedChange={(checked) => {
                        setServices({
                          ...services,
                          paymentMethods: checked
                            ? [...services.paymentMethods, "JETON"]
                            : services.paymentMethods.filter(
                                (m) => m !== "JETON"
                              ),
                        });
                      }}
                    />
                    <Label htmlFor="JETON">Jeton</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ESPECES"
                      checked={services.paymentMethods.includes("ESPECES")}
                      onCheckedChange={(checked) => {
                        setServices({
                          ...services,
                          paymentMethods: checked
                            ? [...services.paymentMethods, "ESPECES"]
                            : services.paymentMethods.filter(
                                (m) => m !== "ESPECES"
                              ),
                        });
                      }}
                    />
                    <Label htmlFor="ESPECES">Espèces</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="CARTE_BANCAIRE"
                      checked={services.paymentMethods.includes(
                        "CARTE_BANCAIRE"
                      )}
                      onCheckedChange={(checked) => {
                        setServices({
                          ...services,
                          paymentMethods: checked
                            ? [...services.paymentMethods, "CARTE_BANCAIRE"]
                            : services.paymentMethods.filter(
                                (m) => m !== "CARTE_BANCAIRE"
                              ),
                        });
                      }}
                    />
                    <Label htmlFor="CARTE_BANCAIRE">Carte bancaire</Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tirePressure"
                    checked={services.tirePressure}
                    onCheckedChange={(checked) =>
                      setServices({
                        ...services,
                        tirePressure: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="tirePressure">Gonflage pneus</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="vacuum"
                    checked={services.vacuum}
                    onCheckedChange={(checked) =>
                      setServices({ ...services, vacuum: checked as boolean })
                    }
                  />
                  <Label htmlFor="vacuum">Aspirateur</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="handicapAccess"
                    checked={services.handicapAccess}
                    onCheckedChange={(checked) =>
                      setServices({
                        ...services,
                        handicapAccess: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="handicapAccess">Accès handicapé</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wasteWater"
                    checked={services.wasteWater}
                    onCheckedChange={(checked) =>
                      setServices({
                        ...services,
                        wasteWater: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="wasteWater">Eaux usées</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxVehicleLength">
                    Longueur maximale du véhicule (en mètres)
                  </Label>
                  <Input
                    type="number"
                    id="maxVehicleLength"
                    value={services.maxVehicleLength ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setServices({
                        ...services,
                        maxVehicleLength: value ? Number(value) : null,
                      });
                    }}
                    placeholder="Ex: 8"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Ajout en cours..." : "Ajouter la station"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStationModal;
