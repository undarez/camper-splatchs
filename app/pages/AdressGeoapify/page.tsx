"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { LatLngTuple } from "leaflet";
import {
  GeoapifyGeocoderAutocomplete,
  GeoapifyContext,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/app/components/ui/form";
import { GeoapifyResult } from "@/app/types/typesGeoapify";
import { CamperWashStation, StationStatus } from "@/app/types";
import { Input } from "@/app/components/ui/input";
import { StationType } from "@prisma/client";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";

// Dynamic loading of the map
const Map = dynamic(
  () => import("@/app/components/Map").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full rounded-lg overflow-hidden border border-input flex items-center justify-center bg-muted">
        <span className="text-muted-foreground">Chargement de la carte...</span>
      </div>
    ),
  }
);

// Validation schemas
const addressFormSchema = z.object({
  address: z.string().min(1, "L'adresse est requise"),
  lat: z.number(),
  lng: z.number(),
});

const stationFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  highPressure: z.enum(["NONE", "PASSERELLE", "ECHAFAUDAGE", "PORTIQUE"]),
  tirePressure: z.boolean(),
  vacuum: z.boolean(),
  wasteWater: z.boolean(),
});

const parkingFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  isPayant: z.boolean(),
  electricity: z.enum(["NONE", "AMP_8", "AMP_15"]),
  commercesProches: z.array(z.string()),
});

interface MapLocation {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: StationType;
  status: string;
}

// Fonction de transformation
const transformToMapLocation = (station: CamperWashStation): MapLocation => ({
  id: station.id,
  name: station.name,
  address: station.address,
  latitude: station.lat,
  longitude: station.lng,
  type: StationType.STATION_LAVAGE,
  status: station.status,
});

// Component definition
const AdressGeoapify = ({
  onAddressSelect,
  errors = {},
  existingLocations = [] as CamperWashStation[],
  defaultValue,
}: {
  onAddressSelect?: (formatted: string, lat: number, lon: number) => void;
  errors?: Record<string, { message?: string }>;
  existingLocations?: CamperWashStation[];
  defaultValue?: {
    formatted?: string;
    lat?: number;
    lon?: number;
  };
}) => {
  const [position, setPosition] = useState<LatLngTuple>(
    defaultValue
      ? [defaultValue.lat || 0, defaultValue.lon || 0]
      : [46.227638, 2.213749]
  );
  const [selectedLocation, setSelectedLocation] =
    useState<CamperWashStation | null>(null);
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [isParkingModalOpen, setIsParkingModalOpen] = useState(false);

  const addressMethods = useForm({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      address: defaultValue?.formatted || "",
      lat: defaultValue?.lat || 46.227638,
      lng: defaultValue?.lon || 2.213749,
    },
  });

  const stationMethods = useForm({
    resolver: zodResolver(stationFormSchema),
    defaultValues: {
      name: "",
      highPressure: "NONE",
      tirePressure: false,
      vacuum: false,
      wasteWater: false,
    },
  });

  const parkingMethods = useForm({
    resolver: zodResolver(parkingFormSchema),
    defaultValues: {
      name: "",
      isPayant: false,
      electricity: "NONE",
      commercesProches: [],
    },
  });

  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

  const handlePlaceSelect = (value: GeoapifyResult | null) => {
    if (!value) return;
    const { lat, lon, formatted } = value.properties;
    const newPosition: LatLngTuple = [lat, lon];
    setPosition(newPosition);
    setSelectedLocation({
      id: "temp-id",
      name: "Nouvel emplacement",
      address: formatted,
      lat,
      lng: lon,
      images: [],
      services: {
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
        maxVehicleLength: 0,
      },
      status: "en_attente",
      author: {
        name: null,
        email: "",
      },
      createdAt: new Date().toISOString(),
    });
    onAddressSelect?.(formatted, lat, lon);
  };

  useEffect(() => {
    if (defaultValue) {
      setPosition([defaultValue.lat || 0, defaultValue.lon || 0]);
      addressMethods.setValue("address", defaultValue.formatted || "");
      addressMethods.setValue("lat", defaultValue.lat || 0);
      addressMethods.setValue("lng", defaultValue.lon || 0);
      onAddressSelect?.(
        defaultValue.formatted || "",
        defaultValue.lat || 0,
        defaultValue.lon || 0
      );
    }
  }, [defaultValue, onAddressSelect, addressMethods]);

  // Convertir position en tuple de deux nombres
  const mapCenter: [number, number] = [
    typeof position[0] === "number" ? position[0] : 46.603354,
    typeof position[1] === "number" ? position[1] : 1.888334,
  ];

  if (!apiKey) {
    console.error("La clé API Geoapify n'est pas définie");
    return null;
  }

  type StationFormValues = {
    name: string;
    highPressure: "NONE" | "PASSERELLE" | "ECHAFAUDAGE" | "PORTIQUE";
    tirePressure: boolean;
    vacuum: boolean;
    wasteWater: boolean;
  };

  type ParkingFormValues = {
    name: string;
    isPayant: boolean;
    electricity: "NONE" | "AMP_8" | "AMP_15";
    commercesProches: string[];
  };

  const handleStationSubmit: SubmitHandler<StationFormValues> = async (
    data
  ) => {
    console.log("Station data:", data);
    setIsStationModalOpen(false);
  };

  const handleParkingSubmit: SubmitHandler<ParkingFormValues> = async (
    data
  ) => {
    console.log("Parking data:", data);
    setIsParkingModalOpen(false);
  };

  return (
    <FormProvider {...addressMethods}>
      <form className="space-y-6">
        <FormField
          control={addressMethods.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rechercher une adresse</FormLabel>
              <FormControl>
                <div className="relative w-full rounded-md border border-input bg-background">
                  <GeoapifyContext apiKey={apiKey}>
                    <GeoapifyGeocoderAutocomplete
                      placeholder="Entrez l'adresse de la station"
                      lang="fr"
                      countryCodes={["fr"]}
                      limit={5}
                      value={field.value}
                      placeSelect={handlePlaceSelect}
                    />
                  </GeoapifyContext>
                </div>
              </FormControl>
              <FormMessage>{errors?.address?.message}</FormMessage>
            </FormItem>
          )}
        />
        {selectedLocation && (
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-bold text-lg mb-2">{selectedLocation.name}</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Adresse:</span>{" "}
                {selectedLocation.address}
              </p>
              <p>
                <span className="font-medium">Services:</span>
                <ul className="ml-4">
                  {Object.entries(selectedLocation.services).map(
                    ([key, value]) =>
                      key !== "id" && (
                        <li key={key} className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              value ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          {key}: {value ? "Oui" : "Non"}
                        </li>
                      )
                  )}
                </ul>
              </p>
            </div>
          </div>
        )}
        <div className="h-[400px] w-full">
          <Map
            center={mapCenter}
            zoom={12}
            existingLocations={existingLocations.map(transformToMapLocation)}
            onLocationSelect={(location) => {
              if (selectedLocation) {
                setSelectedLocation({
                  ...selectedLocation,
                  lat: location.lat,
                  lng: location.lng,
                });
              } else {
                // Créer une nouvelle station avec les valeurs par défaut
                setSelectedLocation({
                  id: "",
                  name: "",
                  address: "",
                  lat: location.lat,
                  lng: location.lng,
                  status: "en_attente" as StationStatus,
                  services: {
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
                  },
                  createdAt: new Date().toISOString(),
                });
              }
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={addressMethods.control}
            name="lat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input {...field} value={position[0]} readOnly />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={addressMethods.control}
            name="lng"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input {...field} value={position[1]} readOnly />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        {selectedLocation && (
          <div className="flex gap-4 justify-center">
            <Button
              type="button"
              onClick={() => setIsStationModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Créer une Station de Lavage
            </Button>
            <Button
              type="button"
              onClick={() => setIsParkingModalOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              Créer une Place de Parking
            </Button>
          </div>
        )}

        {/* Modal Station de Lavage */}
        <Dialog open={isStationModalOpen} onOpenChange={setIsStationModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une Station de Lavage</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={stationMethods.handleSubmit(handleStationSubmit)}
              className="space-y-4"
            >
              <FormField
                control={stationMethods.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la station</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nom de la station" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={stationMethods.control}
                name="highPressure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de haute pression</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NONE">Aucun</SelectItem>
                        <SelectItem value="PASSERELLE">Passerelle</SelectItem>
                        <SelectItem value="ECHAFAUDAGE">Échafaudage</SelectItem>
                        <SelectItem value="PORTIQUE">Portique</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={stationMethods.control}
                name="tirePressure"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Gonflage des pneus</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={stationMethods.control}
                name="vacuum"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Aspirateur</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={stationMethods.control}
                name="wasteWater"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Vidange eaux usées</FormLabel>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Créer la Station
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Modal Place de Parking */}
        <Dialog open={isParkingModalOpen} onOpenChange={setIsParkingModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une Place de Parking</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={parkingMethods.handleSubmit(handleParkingSubmit)}
              className="space-y-4"
            >
              <FormField
                control={parkingMethods.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du parking</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nom du parking" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={parkingMethods.control}
                name="isPayant"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Parking payant</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={parkingMethods.control}
                name="electricity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Électricité</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type d'électricité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NONE">Non disponible</SelectItem>
                        <SelectItem value="AMP_8">8 ampères</SelectItem>
                        <SelectItem value="AMP_15">15 ampères</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={parkingMethods.control}
                name="commercesProches"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commerces à proximité</FormLabel>
                    <div className="space-y-2">
                      {[
                        { value: "NOURRITURE", label: "Nourriture" },
                        { value: "BANQUE", label: "Banque" },
                        { value: "CENTRE_VILLE", label: "Centre-ville" },
                        { value: "STATION_SERVICE", label: "Station-service" },
                        { value: "LAVERIE", label: "Laverie" },
                        { value: "GARAGE", label: "Garage" },
                      ].map((commerce) => (
                        <div
                          key={commerce.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            checked={field.value.includes(commerce.value)}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...field.value, commerce.value]
                                : field.value.filter(
                                    (v) => v !== commerce.value
                                  );
                              field.onChange(newValue);
                            }}
                          />
                          <Label>{commerce.label}</Label>
                        </div>
                      ))}
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Créer le Parking
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </form>
    </FormProvider>
  );
};

export default AdressGeoapify;
