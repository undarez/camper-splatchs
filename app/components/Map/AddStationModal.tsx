"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { StationType, HighPressureType, ElectricityType } from "@prisma/client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

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
  taxeSejour?: string;
  hasElectricity?: ElectricityType;
  commercesProches?: string[];
  hasChargingPoint?: boolean;
  totalPlaces?: number;
  hasWifi?: boolean;
  author?: {
    name: string;
    email: string;
  };
  images?: string[];
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
    taxeSejour: number;
    hasElectricity: ElectricityType;
    commercesProches: string[];
    handicapAccess: boolean;
    totalPlaces: number;
    hasWifi: boolean;
    hasChargingPoint: boolean;
  };
}

const modalStyles = `
  .dialog-overlay {
    position: fixed !important;
    inset: 0 !important;
    background-color: rgba(0, 0, 0, 0.5) !important;
    z-index: 99998 !important;
    display: none !important;
  }

  .dialog-overlay[data-state="open"] {
    display: block !important;
  }

  .dialog-content {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: 95vw !important;
    max-width: 42rem !important;
    height: 90vh !important;
    background: #1E2337 !important;
    z-index: 99999 !important;
    border-radius: 8px !important;
    overflow: hidden !important;
    display: none !important;
    flex-direction: column !important;
  }

  .dialog-content[data-state="open"] {
    display: flex !important;
  }

  .dialog-header {
    padding: 1rem !important;
    border-bottom: 1px solid rgba(75, 85, 99, 0.5) !important;
    background: #1E2337 !important;
  }

  .dialog-body {
    flex: 1 !important;
    overflow-y: auto !important;
    padding: 1rem !important;
    padding-bottom: 80px !important;
  }

  .action-buttons {
    position: absolute !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    padding: 1rem !important;
    background: #1E2337 !important;
    border-top: 1px solid rgba(75, 85, 99, 0.5) !important;
  }
`;

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
      // Vérifier et formater les données du parking
      const parkingData =
        formData.type === "PARKING"
          ? {
              isPayant: Boolean(formData.isPayant),
              tarif: formData.isPayant ? String(formData.tarif) : "0",
              taxeSejour: formData.taxeSejour ? Number(formData.taxeSejour) : 0,
              hasElectricity: formData.hasElectricity || "NONE",
              commercesProches: Array.isArray(formData.commercesProches)
                ? formData.commercesProches
                : [],
              handicapAccess: Boolean(formData.handicapAccess),
              totalPlaces: Number(formData.totalPlaces) || 0,
              hasWifi: Boolean(formData.hasWifi),
              hasChargingPoint: Boolean(formData.hasChargingPoint),
            }
          : undefined;

      console.log("Données du parking avant envoi:", parkingData);

      const dataToSubmit: FormDataType = {
        name: formData.name || "Sans nom",
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
        parkingDetails: parkingData,
        author: {
          name: sessionData?.user?.name || "",
          email: sessionData?.user?.email || "",
        },
        images: uploadedImages,
      };

      console.log("Données envoyées:", dataToSubmit);
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
        electricity: "NONE",
        hasElectricity: "NONE",
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

  useEffect(() => {
    // Ajouter les styles au head
    const style = document.createElement("style");
    style.textContent = modalStyles;
    document.head.appendChild(style);

    return () => {
      // Nettoyer les styles lors du démontage
      document.head.removeChild(style);
    };
  }, []);

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
      <div className="dialog-overlay" aria-hidden="true" />
      <DialogContent className="dialog-content">
        <DialogHeader className="dialog-header">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
            Ajouter un point d'intérêt
          </DialogTitle>
        </DialogHeader>

        <div className="dialog-body">
          <form id="station-form" onSubmit={handleSubmit} className="space-y-6">
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
                    tarif: "0",
                    taxeSejour: "0",
                    hasElectricity: "NONE",
                    commercesProches: [],
                    handicapAccess: false,
                    totalPlaces: 0,
                    hasWifi: false,
                    hasChargingPoint: false,
                  })
                }
              >
                Parking
              </button>
            </div>

            {/* Nom de la station/parking */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-gray-300">
                Nom{" "}
                {formData.type === StationType.STATION_LAVAGE
                  ? "de la station"
                  : "du parking"}
              </label>
              <input
                type="text"
                id="name"
                className="w-full bg-[#252B43] border border-gray-700/50 text-white rounded-lg p-2"
                value={formData.name}
                onChange={(e) => onFormDataChange({ name: e.target.value })}
                placeholder={`Entrez le nom ${
                  formData.type === StationType.STATION_LAVAGE
                    ? "de la station"
                    : "du parking"
                }`}
                required
              />
            </div>

            {/* Contenu existant ... */}
            {formData.type === StationType.STATION_LAVAGE ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Services de lavage
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="highPressure" className="text-gray-300">
                      Type de haute pression
                    </label>
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
                    <label htmlFor="electricity" className="text-gray-300">
                      Électricité
                    </label>
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
                      <option value={ElectricityType.AMP_8}>8 ampères</option>
                      <option value={ElectricityType.AMP_15}>15 ampères</option>
                    </select>
                  </div>

                  <div className="col-span-2 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="tirePressure"
                        checked={formData.tirePressure}
                        onChange={(e) =>
                          onFormDataChange({ tirePressure: e.target.checked })
                        }
                        className="rounded bg-[#252B43] border-gray-700/50"
                      />
                      <label htmlFor="tirePressure" className="text-gray-300">
                        Gonflage pneus
                      </label>
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
                      <label htmlFor="vacuum" className="text-gray-300">
                        Aspirateur
                      </label>
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
                      <label htmlFor="wasteWater" className="text-gray-300">
                        Vidange eaux usées
                      </label>
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
                      <label htmlFor="waterPoint" className="text-gray-300">
                        Point d'eau
                      </label>
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
                      <label
                        htmlFor="wasteWaterDisposal"
                        className="text-gray-300"
                      >
                        Évacuation eaux usées
                      </label>
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
                      <label
                        htmlFor="blackWaterDisposal"
                        className="text-gray-300"
                      >
                        Évacuation eaux noires
                      </label>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="paymentMethods" className="text-gray-300">
                      Moyens de paiement
                    </label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="payment_jeton"
                          checked={formData.paymentMethods?.includes("JETON")}
                          onChange={(e) => {
                            const methods = e.target.checked
                              ? [...(formData.paymentMethods || []), "JETON"]
                              : (formData.paymentMethods || []).filter(
                                  (m) => m !== "JETON"
                                );
                            onFormDataChange({ paymentMethods: methods });
                          }}
                          className="rounded bg-[#252B43] border-gray-700/50"
                          aria-label="Paiement par jeton"
                        />
                        <label
                          htmlFor="payment_jeton"
                          className="text-gray-300"
                        >
                          Jeton
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="payment_especes"
                          checked={formData.paymentMethods?.includes("ESPECES")}
                          onChange={(e) => {
                            const methods = e.target.checked
                              ? [...(formData.paymentMethods || []), "ESPECES"]
                              : (formData.paymentMethods || []).filter(
                                  (m) => m !== "ESPECES"
                                );
                            onFormDataChange({ paymentMethods: methods });
                          }}
                          className="rounded bg-[#252B43] border-gray-700/50"
                        />
                        <label
                          htmlFor="payment_especes"
                          className="text-gray-300"
                        >
                          Espèces
                        </label>
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
                        <label htmlFor="payment_cb" className="text-gray-300">
                          Carte bancaire
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Détails du parking
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="isPayant" className="text-gray-300">
                      Tarification
                    </label>
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
                      <input
                        type="number"
                        className="w-full bg-[#252B43] border-gray-700/50 text-white mt-1 rounded-lg p-2"
                        value={formData.tarif}
                        onChange={(e) =>
                          onFormDataChange({ tarif: e.target.value })
                        }
                        placeholder="Tarif par jour"
                      />
                    )}
                  </div>

                  <div>
                    <label htmlFor="totalPlaces" className="text-gray-300">
                      Nombre de places
                    </label>
                    <input
                      type="number"
                      className="w-full bg-[#252B43] border-gray-700/50 text-white mt-1 rounded-lg p-2"
                      value={formData.totalPlaces}
                      onChange={(e) =>
                        onFormDataChange({
                          totalPlaces: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="Nombre total de places"
                    />
                  </div>

                  <div>
                    <label htmlFor="taxeSejour" className="text-gray-300">
                      Taxe de séjour (€/jour)
                    </label>
                    <input
                      type="number"
                      id="taxeSejour"
                      className="w-full bg-[#252B43] border-gray-700/50 text-white mt-1 rounded-lg p-2"
                      value={formData.taxeSejour}
                      onChange={(e) =>
                        onFormDataChange({ taxeSejour: e.target.value })
                      }
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div>
                    <label htmlFor="hasElectricity" className="text-gray-300">
                      Électricité disponible
                    </label>
                    <select
                      className="w-full bg-[#252B43] border-gray-700/50 text-white mt-1 rounded-lg p-2"
                      value={formData.hasElectricity || "NONE"}
                      onChange={(e) =>
                        onFormDataChange({
                          hasElectricity: e.target.value as ElectricityType,
                        })
                      }
                    >
                      <option value="NONE">Aucune</option>
                      <option value="AMP_8">8 ampères</option>
                      <option value="AMP_15">15 ampères</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="waterPoint" className="text-gray-300">
                      Eau potable
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="waterPoint"
                        className="rounded bg-[#252B43] border-gray-700/50"
                        checked={formData.waterPoint}
                        onChange={(e) =>
                          onFormDataChange({ waterPoint: e.target.checked })
                        }
                      />
                      <span className="text-gray-300">
                        Point d'eau disponible
                      </span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="hasWifi" className="text-gray-300">
                      WiFi
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="hasWifi"
                        type="checkbox"
                        className="rounded bg-[#252B43] border-gray-700/50"
                        checked={formData.hasWifi}
                        onChange={(e) =>
                          onFormDataChange({ hasWifi: e.target.checked })
                        }
                      />
                      <span className="text-gray-300">WiFi disponible</span>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="commercesProches" className="text-gray-300">
                      Commerces à proximité
                    </label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {[
                        { id: "NOURRITURE", label: "Alimentation" },
                        { id: "BANQUE", label: "Banque" },
                        { id: "CENTRE_VILLE", label: "Centre-ville" },
                        { id: "STATION_SERVICE", label: "Station-service" },
                        { id: "LAVERIE", label: "Laverie" },
                        { id: "GARAGE", label: "Garage" },
                      ].map((commerce) => (
                        <div
                          key={commerce.id}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="checkbox"
                            id={`commerce_${commerce.id.toLowerCase()}`}
                            checked={formData.commercesProches?.includes(
                              commerce.id
                            )}
                            onChange={(e) => {
                              const commerces = e.target.checked
                                ? [
                                    ...(formData.commercesProches || []),
                                    commerce.id,
                                  ]
                                : (formData.commercesProches || []).filter(
                                    (c) => c !== commerce.id
                                  );
                              onFormDataChange({ commercesProches: commerces });
                            }}
                            className="rounded bg-[#252B43] border-gray-700/50"
                          />
                          <label
                            htmlFor={`commerce_${commerce.id.toLowerCase()}`}
                            className="text-gray-300"
                          >
                            {commerce.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="handicapAccess"
                        checked={formData.handicapAccess}
                        onChange={(e) =>
                          onFormDataChange({ handicapAccess: e.target.checked })
                        }
                        className="rounded bg-[#252B43] border-gray-700/50"
                      />
                      <label htmlFor="handicapAccess" className="text-gray-300">
                        Accès handicapé
                      </label>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="hasChargingPoint"
                        checked={formData.hasChargingPoint}
                        onChange={(e) =>
                          onFormDataChange({
                            hasChargingPoint: e.target.checked,
                          })
                        }
                        className="rounded bg-[#252B43] border-gray-700/50"
                      />
                      <label
                        htmlFor="hasChargingPoint"
                        className="text-gray-300"
                      >
                        Point de recharge disponible
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section d'upload d'images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Photos</h3>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-700/50 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500/50 transition-colors"
                role="button"
                aria-label="Zone de dépôt d'images"
              >
                <input
                  {...getInputProps()}
                  aria-label="Sélectionner des images"
                />
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
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative aspect-video">
                      <Image
                        src={image}
                        alt={`Image ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 33vw, 25vw"
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        aria-label={`Supprimer l'image ${index + 1}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="action-buttons">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Button
              type="submit"
              form="station-form"
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isUploading}
              aria-label="Ajouter la station"
            >
              {isUploading ? "Envoi en cours..." : "Ajouter"}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white"
              aria-label="Annuler"
            >
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
