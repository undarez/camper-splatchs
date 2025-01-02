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
  @media (max-width: 640px) {
    .dialog-content {
      padding: 1rem !important;
      margin: 0 !important;
      width: 100% !important;
      height: 100vh !important;
      max-height: none !important;
      border-radius: 0 !important;
    }

    .dialog-content form {
      height: calc(100vh - 4rem);
      display: flex;
      flex-direction: column;
    }

    .services-container {
      flex: 1;
      overflow-y: auto;
      padding-bottom: 5rem;
    }

    .action-buttons {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem;
      background: #1E2337;
      border-top: 1px solid rgba(75, 85, 99, 0.5);
    }
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
              {/* ... rest of the services content ... */}
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
                      alt={`${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      aria-label="Supprimer l'image"
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
