"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { StationType, HighPressureType, ElectricityType } from "@prisma/client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

interface FormDataType {
  type: StationType;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  lat: number | null;
  lng: number | null;
  highPressure?: HighPressureType;
  electricity?: ElectricityType;
  tirePressure?: boolean;
  vacuum?: boolean;
  handicapAccess?: boolean;
  wasteWater?: boolean;
  waterPoint?: boolean;
  wasteWaterDisposal?: boolean;
  blackWaterDisposal?: boolean;
  maxVehicleLength?: string;
  paymentMethods?: string[];
  isPayant?: boolean;
  tarif?: string;
  hasElectricity?: ElectricityType;
  commercesProches?: string[];
  hasChargingPoint?: boolean;
  latitude?: number;
  longitude?: number;
  services?: {
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
  };
  parkingDetails?: {
    isPayant: boolean;
    tarif: string;
    hasElectricity: ElectricityType;
    commercesProches: string[];
    handicapAccess: boolean;
  };
  author?: {
    name: string;
    email: string;
  };
  images?: string[];
}

export default function AddPointModal({
  isOpen,
  onClose,
  formData,
  onFormDataChange,
  uploadedImages,
  setUploadedImages,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  formData: FormDataType;
  onFormDataChange: (data: Partial<FormDataType>) => void;
  uploadedImages: string[];
  setUploadedImages: (images: string[]) => void;
  onSubmit: (data: FormDataType) => void;
}) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { data: sessionData } = useSession();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (uploadedImages.length + acceptedFiles.length > 3) {
        toast({
          title: "Erreur",
          description: "Vous ne pouvez pas uploader plus de 3 images",
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);
      const newImages: string[] = [];

      for (const file of acceptedFiles) {
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Erreur",
            description: `L'image ${file.name} dépasse la limite de 5Mo`,
            variant: "destructive",
          });
          continue;
        }

        try {
          // Upload sur Supabase Storage
          const fileExt = file.name.split(".").pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("station-images")
            .upload(filePath, file);

          if (uploadError) {
            throw uploadError;
          }

          // Récupérer l'URL publique
          const {
            data: { publicUrl },
          } = supabase.storage.from("station-images").getPublicUrl(filePath);

          newImages.push(publicUrl);
        } catch (error: unknown) {
          const err = error as Error;
          console.error("Erreur upload image:", err);
          toast({
            title: "Erreur",
            description: "Erreur lors de l'upload de l'image",
            variant: "destructive",
          });
        }
      }

      if (newImages.length > 0) {
        setUploadedImages([...uploadedImages, ...newImages]);
        toast({
          title: "Succès",
          description: `${newImages.length} image(s) ajoutée(s)`,
        });
      }

      setIsUploading(false);
    },
    [uploadedImages, setUploadedImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 3,
    maxSize: 5 * 1024 * 1024, // 5Mo
  });

  const removeImage = (imageToRemove: string) => {
    setUploadedImages(uploadedImages.filter((img) => img !== imageToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const dataToSubmit: FormDataType = {
        name: formData.name,
        address: formData.address,
        type: formData.type,
        city: formData.city || "",
        postalCode: formData.postalCode || "",
        lat: formData.lat,
        lng: formData.lng,
        latitude: Number(formData.lat) || 0,
        longitude: Number(formData.lng) || 0,
        services:
          formData.type === "STATION_LAVAGE"
            ? {
                highPressure: formData.highPressure as HighPressureType,
                tirePressure: formData.tirePressure === true,
                vacuum: formData.vacuum === true,
                handicapAccess: formData.handicapAccess === true,
                wasteWater: formData.wasteWater === true,
                waterPoint: formData.waterPoint === true,
                wasteWaterDisposal: formData.wasteWaterDisposal === true,
                blackWaterDisposal: formData.blackWaterDisposal === true,
                electricity: formData.electricity as ElectricityType,
                maxVehicleLength: String(formData.maxVehicleLength || ""),
                paymentMethods: formData.paymentMethods || [],
              }
            : undefined,
        parkingDetails:
          formData.type === "PARKING"
            ? {
                isPayant: formData.isPayant === true,
                tarif: String(formData.tarif || ""),
                hasElectricity: formData.hasElectricity as ElectricityType,
                commercesProches: formData.commercesProches || [],
                handicapAccess: formData.handicapAccess === true,
              }
            : undefined,
        author: {
          name: sessionData?.user?.name || "",
          email: sessionData?.user?.email || "",
        },
        images: uploadedImages,
      };

      await onSubmit(dataToSubmit);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Erreur détaillée:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la création de la station",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isOpen && formData.address) {
      onFormDataChange({
        address: formData.address,
        city: formData.city || "",
        postalCode: formData.postalCode || "",
      });
    }
  }, [
    isOpen,
    formData.address,
    formData.city,
    formData.postalCode,
    onFormDataChange,
  ]);

  useEffect(() => {
    if (isOpen) {
      onFormDataChange({
        type: StationType.STATION_LAVAGE,
        highPressure: HighPressureType.NONE,
        electricity: ElectricityType.NONE,
        hasElectricity: ElectricityType.NONE,
        tirePressure: false,
        vacuum: false,
        handicapAccess: false,
        wasteWater: false,
        waterPoint: false,
        wasteWaterDisposal: false,
        blackWaterDisposal: false,
        maxVehicleLength: "",
        tarif: "",
        paymentMethods: [],
      });
    }
  }, [isOpen, onFormDataChange]);

  if (isSuccess) {
    return (
      <Dialog open={isOpen}>
        <DialogContent className="bg-[#1E2337] border border-gray-700/50 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              Station ajoutée avec succès!
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-300">Merci de votre contribution.</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E2337] border border-gray-700/50 text-white w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
            Ajouter un point d'intérêt
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Type de point */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
            <button
              type="button"
              className={`p-4 rounded-lg border ${
                formData.type === StationType.STATION_LAVAGE
                  ? "bg-blue-500/20 border-blue-500 text-blue-400"
                  : "bg-[#252B43] border-gray-700/50 text-gray-400 hover:bg-[#2A3150]"
              } transition-all`}
              onClick={() =>
                onFormDataChange({
                  type: StationType.STATION_LAVAGE,
                  highPressure: "NONE",
                  electricity: "NONE",
                  tirePressure: false,
                  vacuum: false,
                  handicapAccess: false,
                  wasteWater: false,
                  waterPoint: false,
                  wasteWaterDisposal: false,
                  blackWaterDisposal: false,
                  maxVehicleLength: "",
                  paymentMethods: [],
                })
              }
            >
              Station de lavage
            </button>
            <button
              type="button"
              className={`p-4 rounded-lg border ${
                formData.type === StationType.PARKING
                  ? "bg-purple-500/20 border-purple-500 text-purple-400"
                  : "bg-[#252B43] border-gray-700/50 text-gray-400 hover:bg-[#2A3150]"
              } transition-all`}
              onClick={() =>
                onFormDataChange({
                  type: StationType.PARKING,
                  isPayant: false,
                  tarif: "",
                  hasElectricity: "NONE",
                  commercesProches: [],
                  handicapAccess: false,
                })
              }
            >
              Parking
            </button>
          </div>

          {/* Informations générales */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white">
              Informations générales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label className="text-gray-300">Nom</Label>
                <Input
                  className="bg-[#252B43] border-gray-700/50 text-white mt-1"
                  value={formData.name}
                  onChange={(e) => onFormDataChange({ name: e.target.value })}
                  placeholder="Nom du point d'intérêt"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Ville</Label>
                  <Input
                    className="bg-[#252B43] border-gray-700/50 text-white mt-1"
                    value={formData.city}
                    onChange={(e) => onFormDataChange({ city: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Code postal</Label>
                  <Input
                    className="bg-[#252B43] border-gray-700/50 text-white mt-1"
                    value={formData.postalCode}
                    onChange={(e) =>
                      onFormDataChange({ postalCode: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Services spécifiques selon le type */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Services disponibles
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {formData.type === StationType.STATION_LAVAGE ? (
                // Services pour station de lavage
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      Services de lavage
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">
                          Type de haute pression
                        </Label>
                        <select
                          className="w-full bg-[#252B43] border-gray-700/50 text-white mt-1 rounded-lg p-2"
                          value={formData.highPressure || HighPressureType.NONE}
                          onChange={(e) =>
                            onFormDataChange({
                              highPressure: e.target.value as HighPressureType,
                            })
                          }
                          required
                        >
                          <option value={HighPressureType.NONE}>Aucun</option>
                          <option value={HighPressureType.PASSERELLE}>
                            Passerelle
                          </option>
                          <option value={HighPressureType.ECHAFAUDAGE}>
                            Échafaudage
                          </option>
                          <option value={HighPressureType.PORTIQUE}>
                            Portique
                          </option>
                        </select>
                      </div>

                      <div>
                        <Label className="text-gray-300">Électricité</Label>
                        <select
                          className="w-full bg-[#252B43] border-gray-700/50 text-white mt-1 rounded-lg p-2"
                          value={formData.electricity || ElectricityType.NONE}
                          onChange={(e) =>
                            onFormDataChange({
                              electricity: e.target.value as ElectricityType,
                            })
                          }
                        >
                          <option value={ElectricityType.NONE}>Aucun</option>
                          <option value={ElectricityType.AMP_8}>
                            8 ampères
                          </option>
                          <option value={ElectricityType.AMP_15}>
                            15 ampères
                          </option>
                        </select>
                      </div>

                      <div className="col-span-2 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="tirePressure"
                            checked={formData.tirePressure}
                            onChange={(e) =>
                              onFormDataChange({
                                tirePressure: e.target.checked,
                              })
                            }
                            className="rounded bg-[#252B43] border-gray-700/50"
                          />
                          <Label
                            htmlFor="tirePressure"
                            className="text-gray-300"
                          >
                            Gonflage pneus
                          </Label>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="vacuum"
                            checked={formData.vacuum}
                            onChange={(e) =>
                              onFormDataChange({ vacuum: e.target.checked })
                            }
                            className="rounded bg-[#252B43] border-gray-700/50"
                          />
                          <Label htmlFor="vacuum" className="text-gray-300">
                            Aspirateur
                          </Label>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="handicapAccess"
                            checked={formData.handicapAccess}
                            onChange={(e) =>
                              onFormDataChange({
                                handicapAccess: e.target.checked,
                              })
                            }
                            className="rounded bg-[#252B43] border-gray-700/50"
                          />
                          <Label
                            htmlFor="handicapAccess"
                            className="text-gray-300"
                          >
                            Accès handicapé
                          </Label>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="wasteWater"
                            checked={formData.wasteWater}
                            onChange={(e) =>
                              onFormDataChange({ wasteWater: e.target.checked })
                            }
                            className="rounded bg-[#252B43] border-gray-700/50"
                          />
                          <Label htmlFor="wasteWater" className="text-gray-300">
                            Vidange eaux usées
                          </Label>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="waterPoint"
                            checked={formData.waterPoint}
                            onChange={(e) =>
                              onFormDataChange({ waterPoint: e.target.checked })
                            }
                            className="rounded bg-[#252B43] border-gray-700/50"
                          />
                          <Label htmlFor="waterPoint" className="text-gray-300">
                            Point d'eau
                          </Label>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="wasteWaterDisposal"
                            checked={formData.wasteWaterDisposal}
                            onChange={(e) =>
                              onFormDataChange({
                                wasteWaterDisposal: e.target.checked,
                              })
                            }
                            className="rounded bg-[#252B43] border-gray-700/50"
                          />
                          <Label
                            htmlFor="wasteWaterDisposal"
                            className="text-gray-300"
                          >
                            Évacuation eaux usées
                          </Label>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="blackWaterDisposal"
                            checked={formData.blackWaterDisposal}
                            onChange={(e) =>
                              onFormDataChange({
                                blackWaterDisposal: e.target.checked,
                              })
                            }
                            className="rounded bg-[#252B43] border-gray-700/50"
                          />
                          <Label
                            htmlFor="blackWaterDisposal"
                            className="text-gray-300"
                          >
                            Évacuation eaux noires
                          </Label>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <Label className="text-gray-300">
                          Moyens de paiement
                        </Label>
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="payment_jeton"
                              checked={formData.paymentMethods?.includes(
                                "JETON"
                              )}
                              onChange={(e) => {
                                const methods = e.target.checked
                                  ? [
                                      ...(formData.paymentMethods || []),
                                      "JETON",
                                    ]
                                  : (formData.paymentMethods || []).filter(
                                      (m) => m !== "JETON"
                                    );
                                onFormDataChange({ paymentMethods: methods });
                              }}
                              className="rounded bg-[#252B43] border-gray-700/50"
                            />
                            <Label
                              htmlFor="payment_jeton"
                              className="text-gray-300"
                            >
                              Jeton
                            </Label>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="payment_especes"
                              checked={formData.paymentMethods?.includes(
                                "ESPECES"
                              )}
                              onChange={(e) => {
                                const methods = e.target.checked
                                  ? [
                                      ...(formData.paymentMethods || []),
                                      "ESPECES",
                                    ]
                                  : (formData.paymentMethods || []).filter(
                                      (m) => m !== "ESPECES"
                                    );
                                onFormDataChange({ paymentMethods: methods });
                              }}
                              className="rounded bg-[#252B43] border-gray-700/50"
                            />
                            <Label
                              htmlFor="payment_especes"
                              className="text-gray-300"
                            >
                              Espèces
                            </Label>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="payment_cb"
                              checked={formData.paymentMethods?.includes(
                                "CARTE_BANCAIRE"
                              )}
                              onChange={(e) => {
                                const methods = e.target.checked
                                  ? [
                                      ...(formData.paymentMethods || []),
                                      "CARTE_BANCAIRE",
                                    ]
                                  : (formData.paymentMethods || []).filter(
                                      (m) => m !== "CARTE_BANCAIRE"
                                    );
                                onFormDataChange({ paymentMethods: methods });
                              }}
                              className="rounded bg-[#252B43] border-gray-700/50"
                            />
                            <Label
                              htmlFor="payment_cb"
                              className="text-gray-300"
                            >
                              Carte bancaire
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2">
                        <Label
                          htmlFor="maxVehicleLength"
                          className="text-gray-300"
                        >
                          Longueur maximale du véhicule (en mètres)
                        </Label>
                        <Input
                          id="maxVehicleLength"
                          type="number"
                          value={formData.maxVehicleLength ?? ""}
                          onChange={(e) =>
                            onFormDataChange({
                              maxVehicleLength: e.target.value || "",
                            })
                          }
                          className="bg-[#252B43] border-gray-700/50 text-white mt-1"
                          min="0"
                          step="0.1"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Services pour parking
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">
                      Détails du parking
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300">Tarification</Label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="rounded bg-[#252B43] border-gray-700/50"
                            checked={formData.isPayant}
                            onChange={(e) =>
                              onFormDataChange({ isPayant: e.target.checked })
                            }
                          />
                          <span className="text-gray-300">Parking payant</span>
                        </div>
                        {formData.isPayant && (
                          <Input
                            type="number"
                            className="bg-[#252B43] border-gray-700/50 text-white mt-1"
                            value={formData.tarif ?? ""}
                            onChange={(e) =>
                              onFormDataChange({
                                tarif: e.target.value || "",
                              })
                            }
                            placeholder="Tarif par jour"
                            required
                          />
                        )}
                      </div>
                      <div>
                        <Label className="text-gray-300">
                          Électricité disponible
                        </Label>
                        <select
                          className="w-full bg-[#252B43] border-gray-700/50 text-white mt-1 rounded-lg p-2"
                          value={
                            formData.hasElectricity || ElectricityType.NONE
                          }
                          onChange={(e) =>
                            onFormDataChange({
                              hasElectricity: e.target.value as ElectricityType,
                            })
                          }
                          required
                        >
                          <option value="NONE">Aucune</option>
                          <option value="AMP_8">8 ampères</option>
                          <option value="AMP_15">15 ampères</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-gray-300">
                      Commerces à proximité
                    </Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="commerce_nourriture"
                          checked={formData.commercesProches?.includes(
                            "NOURRITURE"
                          )}
                          onChange={(e) => {
                            const commerces = e.target.checked
                              ? [
                                  ...(formData.commercesProches || []),
                                  "NOURRITURE",
                                ]
                              : (formData.commercesProches || []).filter(
                                  (c) => c !== "NOURRITURE"
                                );
                            onFormDataChange({ commercesProches: commerces });
                          }}
                          className="rounded bg-[#252B43] border-gray-700/50"
                        />
                        <Label
                          htmlFor="commerce_nourriture"
                          className="text-gray-300"
                        >
                          Alimentation
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="commerce_banque"
                          checked={formData.commercesProches?.includes(
                            "BANQUE"
                          )}
                          onChange={(e) => {
                            const commerces = e.target.checked
                              ? [...(formData.commercesProches || []), "BANQUE"]
                              : (formData.commercesProches || []).filter(
                                  (c) => c !== "BANQUE"
                                );
                            onFormDataChange({ commercesProches: commerces });
                          }}
                          className="rounded bg-[#252B43] border-gray-700/50"
                        />
                        <Label
                          htmlFor="commerce_banque"
                          className="text-gray-300"
                        >
                          Banque
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="commerce_centre_ville"
                          checked={formData.commercesProches?.includes(
                            "CENTRE_VILLE"
                          )}
                          onChange={(e) => {
                            const commerces = e.target.checked
                              ? [
                                  ...(formData.commercesProches || []),
                                  "CENTRE_VILLE",
                                ]
                              : (formData.commercesProches || []).filter(
                                  (c) => c !== "CENTRE_VILLE"
                                );
                            onFormDataChange({ commercesProches: commerces });
                          }}
                          className="rounded bg-[#252B43] border-gray-700/50"
                        />
                        <Label
                          htmlFor="commerce_centre_ville"
                          className="text-gray-300"
                        >
                          Centre-ville
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="commerce_station"
                          checked={formData.commercesProches?.includes(
                            "STATION_SERVICE"
                          )}
                          onChange={(e) => {
                            const commerces = e.target.checked
                              ? [
                                  ...(formData.commercesProches || []),
                                  "STATION_SERVICE",
                                ]
                              : (formData.commercesProches || []).filter(
                                  (c) => c !== "STATION_SERVICE"
                                );
                            onFormDataChange({ commercesProches: commerces });
                          }}
                          className="rounded bg-[#252B43] border-gray-700/50"
                        />
                        <Label
                          htmlFor="commerce_station"
                          className="text-gray-300"
                        >
                          Station-service
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="commerce_laverie"
                          checked={formData.commercesProches?.includes(
                            "LAVERIE"
                          )}
                          onChange={(e) => {
                            const commerces = e.target.checked
                              ? [
                                  ...(formData.commercesProches || []),
                                  "LAVERIE",
                                ]
                              : (formData.commercesProches || []).filter(
                                  (c) => c !== "LAVERIE"
                                );
                            onFormDataChange({ commercesProches: commerces });
                          }}
                          className="rounded bg-[#252B43] border-gray-700/50"
                        />
                        <Label
                          htmlFor="commerce_laverie"
                          className="text-gray-300"
                        >
                          Laverie
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="commerce_garage"
                          checked={formData.commercesProches?.includes(
                            "GARAGE"
                          )}
                          onChange={(e) => {
                            const commerces = e.target.checked
                              ? [...(formData.commercesProches || []), "GARAGE"]
                              : (formData.commercesProches || []).filter(
                                  (c) => c !== "GARAGE"
                                );
                            onFormDataChange({ commercesProches: commerces });
                          }}
                          className="rounded bg-[#252B43] border-gray-700/50"
                        />
                        <Label
                          htmlFor="commerce_garage"
                          className="text-gray-300"
                        >
                          Garage
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded bg-[#252B43] border-gray-700/50"
                        checked={formData.handicapAccess}
                        onChange={(e) =>
                          onFormDataChange({ handicapAccess: e.target.checked })
                        }
                      />
                      <span className="text-gray-300">Accès handicapé</span>
                    </label>
                  </div>
                  <div>
                    <Label className="text-gray-300">Point de recharge</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded bg-[#252B43] border-gray-700/50"
                        checked={formData.hasChargingPoint}
                        onChange={(e) =>
                          onFormDataChange({
                            hasChargingPoint: e.target.checked,
                          })
                        }
                      />
                      <span className="text-gray-300">
                        Recharge batterie disponible
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Section d'upload d'images */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-white">
              Photos
            </h3>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-700/50 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500/50 transition-colors"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Déposez les images ici...</p>
              ) : (
                <p>
                  Glissez-déposez des images ici, ou cliquez pour sélectionner
                </p>
              )}
              <p className="text-sm text-gray-400 mt-2">
                Maximum 3 images, 5Mo par image
              </p>
            </div>

            {/* Aperçu des images */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative aspect-video">
                    <Image
                      src={image}
                      alt={`Image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-6">
            <Button
              type="submit"
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600"
              disabled={isUploading}
            >
              {isUploading ? "Envoi en cours..." : "Ajouter"}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600"
            >
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}