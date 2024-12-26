"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { StationType, HighPressureType, ElectricityType } from "@prisma/client";

const Map = dynamic(() => import("@/app/components/Map"), {
  ssr: false,
});

interface FormData {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  lat: number | null;
  lng: number | null;
  // Champs pour station de lavage
  highPressure: HighPressureType;
  tirePressure: boolean;
  vacuum: boolean;
  handicapAccess: boolean;
  wasteWater: boolean;
  electricity: ElectricityType;
  maxVehicleLength: string;
  paymentMethods: string[];
  // Champs pour parking
  isPayant: boolean;
  tarif: string;
  commercesProches: string[];
}

interface Location {
  lat: number;
  lng: number;
}

export default function LocalisationStation2() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stationType, setStationType] = useState<StationType>(
    StationType.STATION_LAVAGE
  );
  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    lat: null,
    lng: null,
    // Champs pour station de lavage
    highPressure: HighPressureType.NONE,
    tirePressure: false,
    vacuum: false,
    handicapAccess: false,
    wasteWater: false,
    electricity: ElectricityType.NONE,
    maxVehicleLength: "",
    paymentMethods: [],
    // Champs pour parking
    isPayant: false,
    tarif: "",
    commercesProches: [],
  });

  const handleLocationSelect = (location: Location) => {
    setFormData({
      ...formData,
      lat: location.lat,
      lng: location.lng,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter une station",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/stationUpdapte", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          type: stationType,
          // Données spécifiques au parking si nécessaire
          ...(stationType === "PARKING" && {
            parkingDetails: {
              isPayant: formData.isPayant,
              tarif: formData.isPayant ? parseFloat(formData.tarif) : null,
              hasElectricity: formData.electricity,
              commercesProches: formData.commercesProches,
              handicapAccess: formData.handicapAccess,
            },
          }),
        }),
      });

      if (response.ok) {
        toast({
          title: "Succès",
          description:
            stationType === "PARKING"
              ? "Place de parking ajoutée avec succès"
              : "Station ajoutée avec succès",
        });
        setIsDialogOpen(false);
        router.refresh();
      } else {
        throw new Error("Erreur lors de l'ajout");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la station:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout",
        variant: "destructive",
      });
    }
  };

  const commerceTypes = [
    { value: "NOURRITURE", label: "Nourriture" },
    { value: "BANQUE", label: "Banque" },
    { value: "CENTRE_VILLE", label: "Centre-ville" },
    { value: "STATION_SERVICE", label: "Station-service" },
    { value: "LAVERIE", label: "Laverie" },
    { value: "GARAGE", label: "Garage" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Ajouter une Station ou Place de Parking
        </h1>
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <Map onLocationSelect={handleLocationSelect} />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {stationType === "PARKING"
                  ? "Ajouter une place de parking"
                  : "Ajouter une station de lavage"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type de point d'intérêt */}
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={stationType}
                  onValueChange={(value: StationType) => setStationType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STATION_LAVAGE">
                      Station de lavage
                    </SelectItem>
                    <SelectItem value="PARKING">Place de parking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Champs communs */}
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Adresse</Label>
                <Input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ville</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Code postal</Label>
                  <Input
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Champs spécifiques aux stations de lavage */}
              {stationType === "STATION_LAVAGE" && (
                <>
                  <div className="space-y-2">
                    <Label>Type de haute pression</Label>
                    <Select
                      value={formData.highPressure}
                      onValueChange={(value: HighPressureType) =>
                        setFormData({ ...formData, highPressure: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NONE">Aucun</SelectItem>
                        <SelectItem value="PASSERELLE">Passerelle</SelectItem>
                        <SelectItem value="ECHAFAUDAGE">Échafaudage</SelectItem>
                        <SelectItem value="PORTIQUE">Portique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="tirePressure"
                        checked={formData.tirePressure}
                        onCheckedChange={(checked: boolean) =>
                          setFormData({ ...formData, tirePressure: checked })
                        }
                      />
                      <Label htmlFor="tirePressure">Gonflage des pneus</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="vacuum"
                        checked={formData.vacuum}
                        onCheckedChange={(checked: boolean) =>
                          setFormData({ ...formData, vacuum: checked })
                        }
                      />
                      <Label htmlFor="vacuum">Aspirateur</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="wasteWater"
                        checked={formData.wasteWater}
                        onCheckedChange={(checked: boolean) =>
                          setFormData({ ...formData, wasteWater: checked })
                        }
                      />
                      <Label htmlFor="wasteWater">Vidange eaux usées</Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Longueur maximale du véhicule (en mètres)</Label>
                    <Input
                      type="number"
                      value={formData.maxVehicleLength}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxVehicleLength: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}

              {/* Champs spécifiques aux parkings */}
              {stationType === "PARKING" && (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isPayant"
                        checked={formData.isPayant}
                        onCheckedChange={(checked: boolean) =>
                          setFormData({ ...formData, isPayant: checked })
                        }
                      />
                      <Label htmlFor="isPayant">Parking payant</Label>
                    </div>

                    {formData.isPayant && (
                      <div className="space-y-2">
                        <Label>Tarif approximatif (€/jour)</Label>
                        <Input
                          type="number"
                          value={formData.tarif}
                          onChange={(e) =>
                            setFormData({ ...formData, tarif: e.target.value })
                          }
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Commerces à proximité</Label>
                      {commerceTypes.map((commerce) => (
                        <div
                          key={commerce.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={commerce.value}
                            checked={formData.commercesProches.includes(
                              commerce.value
                            )}
                            onCheckedChange={(checked) => {
                              const newCommerces = checked
                                ? [...formData.commercesProches, commerce.value]
                                : formData.commercesProches.filter(
                                    (c) => c !== commerce.value
                                  );
                              setFormData({
                                ...formData,
                                commercesProches: newCommerces,
                              });
                            }}
                          />
                          <Label htmlFor={commerce.value}>
                            {commerce.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Champs communs aux deux types */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="handicapAccess"
                    checked={formData.handicapAccess}
                    onCheckedChange={(checked: boolean) =>
                      setFormData({ ...formData, handicapAccess: checked })
                    }
                  />
                  <Label htmlFor="handicapAccess">Accès handicapé</Label>
                </div>

                <div className="space-y-2">
                  <Label>Électricité</Label>
                  <Select
                    value={formData.electricity}
                    onValueChange={(value: ElectricityType) =>
                      setFormData({ ...formData, electricity: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">Non disponible</SelectItem>
                      <SelectItem value="AMP_8">8 ampères</SelectItem>
                      <SelectItem value="AMP_15">15 ampères</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full">
                {stationType === "PARKING"
                  ? "Ajouter le parking"
                  : "Ajouter la station"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
