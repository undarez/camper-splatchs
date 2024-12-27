"use client";

import { StationType, HighPressureType, ElectricityType } from "@prisma/client";
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
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";

interface FormData {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  lat: number | null;
  lng: number | null;
  type: StationType;
  highPressure: HighPressureType;
  tirePressure: boolean;
  vacuum: boolean;
  handicapAccess: boolean;
  wasteWater: boolean;
  waterPoint: boolean;
  wasteWaterDisposal: boolean;
  blackWaterDisposal: boolean;
  electricity: ElectricityType;
  maxVehicleLength: string;
  paymentMethods: string[];
  isPayant: boolean;
  tarif: string;
  commercesProches: string[];
}

interface AddPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  onFormDataChange: (newData: Partial<FormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const commerceTypes = [
  { value: "NOURRITURE", label: "Nourriture" },
  { value: "BANQUE", label: "Banque" },
  { value: "CENTRE_VILLE", label: "Centre-ville" },
  { value: "STATION_SERVICE", label: "Station-service" },
  { value: "LAVERIE", label: "Laverie" },
  { value: "GARAGE", label: "Garage" },
];

const paymentMethods = [
  { value: "CB", label: "Carte bancaire" },
  { value: "ESPECES", label: "Espèces" },
  { value: "JETONS", label: "Jetons" },
];

export default function AddPointModal({
  isOpen,
  onClose,
  formData,
  onFormDataChange,
  onSubmit,
}: AddPointModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[9999] bg-white">
        <DialogHeader>
          <DialogTitle>Ajouter un point d'intérêt</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Type de point d'intérêt */}
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: StationType) =>
                onFormDataChange({ type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir le type" />
              </SelectTrigger>
              <SelectContent className="z-[10000]">
                <SelectItem value={StationType.STATION_LAVAGE}>
                  Station de lavage
                </SelectItem>
                <SelectItem value={StationType.PARKING}>
                  Place de parking
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="font-semibold">Informations générales</h3>
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input
                value={formData.name}
                onChange={(e) => onFormDataChange({ name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Adresse</Label>
              <Input
                value={formData.address}
                onChange={(e) => onFormDataChange({ address: e.target.value })}
                required
                disabled
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ville</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => onFormDataChange({ city: e.target.value })}
                  required
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label>Code postal</Label>
                <Input
                  value={formData.postalCode}
                  onChange={(e) =>
                    onFormDataChange({ postalCode: e.target.value })
                  }
                  required
                  disabled
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Champs spécifiques selon le type */}
          {formData.type === StationType.STATION_LAVAGE ? (
            <div className="space-y-6">
              <h3 className="font-semibold">Services de la station</h3>

              {/* Haute pression */}
              <div className="space-y-2">
                <Label>Type de haute pression</Label>
                <Select
                  value={formData.highPressure}
                  onValueChange={(value: HighPressureType) =>
                    onFormDataChange({ highPressure: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir le type" />
                  </SelectTrigger>
                  <SelectContent className="z-[10000]">
                    <SelectItem value={HighPressureType.NONE}>Aucun</SelectItem>
                    <SelectItem value={HighPressureType.PASSERELLE}>
                      Passerelle
                    </SelectItem>
                    <SelectItem value={HighPressureType.ECHAFAUDAGE}>
                      Échafaudage
                    </SelectItem>
                    <SelectItem value={HighPressureType.PORTIQUE}>
                      Portique
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Services disponibles */}
              <div className="space-y-4">
                <Label>Services disponibles</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.tirePressure}
                      onCheckedChange={(checked) =>
                        onFormDataChange({ tirePressure: checked as boolean })
                      }
                    />
                    <Label>Gonflage des pneus</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.vacuum}
                      onCheckedChange={(checked) =>
                        onFormDataChange({ vacuum: checked as boolean })
                      }
                    />
                    <Label>Aspirateur</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.waterPoint}
                      onCheckedChange={(checked) =>
                        onFormDataChange({ waterPoint: checked as boolean })
                      }
                    />
                    <Label>Point d'eau</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.wasteWater}
                      onCheckedChange={(checked) =>
                        onFormDataChange({ wasteWater: checked as boolean })
                      }
                    />
                    <Label>Vidange eaux usées</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.wasteWaterDisposal}
                      onCheckedChange={(checked) =>
                        onFormDataChange({
                          wasteWaterDisposal: checked as boolean,
                        })
                      }
                    />
                    <Label>Évacuation eaux usées</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.blackWaterDisposal}
                      onCheckedChange={(checked) =>
                        onFormDataChange({
                          blackWaterDisposal: checked as boolean,
                        })
                      }
                    />
                    <Label>Évacuation eaux noires</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.handicapAccess}
                      onCheckedChange={(checked) =>
                        onFormDataChange({ handicapAccess: checked as boolean })
                      }
                    />
                    <Label>Accès handicapé</Label>
                  </div>
                </div>
              </div>

              {/* Longueur maximale */}
              <div className="space-y-2">
                <Label>Longueur maximale du véhicule (en mètres)</Label>
                <Input
                  type="number"
                  value={formData.maxVehicleLength}
                  onChange={(e) =>
                    onFormDataChange({ maxVehicleLength: e.target.value })
                  }
                  placeholder="Ex: 12"
                />
              </div>

              {/* Moyens de paiement */}
              <div className="space-y-2">
                <Label>Moyens de paiement acceptés</Label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        checked={formData.paymentMethods.includes(method.value)}
                        onCheckedChange={(checked) => {
                          const newMethods = checked
                            ? [...formData.paymentMethods, method.value]
                            : formData.paymentMethods.filter(
                                (v) => v !== method.value
                              );
                          onFormDataChange({ paymentMethods: newMethods });
                        }}
                      />
                      <Label>{method.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="font-semibold">Informations du parking</h3>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.isPayant}
                  onCheckedChange={(checked) =>
                    onFormDataChange({ isPayant: checked as boolean })
                  }
                />
                <Label>Parking payant</Label>
              </div>

              {formData.isPayant && (
                <div className="space-y-2">
                  <Label>Tarif (€/jour)</Label>
                  <Input
                    type="number"
                    value={formData.tarif}
                    onChange={(e) =>
                      onFormDataChange({ tarif: e.target.value })
                    }
                    placeholder="Prix en euros"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Commerces à proximité</Label>
                <div className="grid grid-cols-2 gap-2">
                  {commerceTypes.map((commerce) => (
                    <div
                      key={commerce.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        checked={formData.commercesProches.includes(
                          commerce.value
                        )}
                        onCheckedChange={(checked) => {
                          const newCommerces = checked
                            ? [...formData.commercesProches, commerce.value]
                            : formData.commercesProches.filter(
                                (v) => v !== commerce.value
                              );
                          onFormDataChange({ commercesProches: newCommerces });
                        }}
                      />
                      <Label>{commerce.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.handicapAccess}
                  onCheckedChange={(checked) =>
                    onFormDataChange({ handicapAccess: checked as boolean })
                  }
                />
                <Label>Accès handicapé</Label>
              </div>
            </div>
          )}

          {/* Champ électricité commun aux deux types */}
          <div className="space-y-2">
            <Label>Électricité</Label>
            <Select
              value={formData.electricity}
              onValueChange={(value: ElectricityType) =>
                onFormDataChange({ electricity: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Type d'électricité" />
              </SelectTrigger>
              <SelectContent className="z-[10000]">
                <SelectItem value={ElectricityType.NONE}>
                  Non disponible
                </SelectItem>
                <SelectItem value={ElectricityType.AMP_8}>8 ampères</SelectItem>
                <SelectItem value={ElectricityType.AMP_15}>
                  15 ampères
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            {formData.type === StationType.PARKING
              ? "Ajouter le parking"
              : "Ajouter la station"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
