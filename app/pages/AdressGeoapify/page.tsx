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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Checkbox } from "@/app/components/ui/checkbox";
import { cn } from "@/lib/utils";
import MobileSidebar from "@/app/pages/mobile-sidebar/page";

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
  address: z.string().min(1, "L'adresse est requise"),
  type: z.enum(["STATION_LAVAGE", "PARKING"]),
  highPressure: z.enum(["NONE", "PASSERELLE", "ECHAFAUDAGE", "PORTIQUE"]),
  tirePressure: z.boolean(),
  vacuum: z.boolean(),
  wasteWater: z.boolean(),
  electricity: z.enum(["NONE", "AMP_8", "AMP_15"]),
});

type StationFormValues = z.infer<typeof stationFormSchema>;

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
  latitude: station.latitude,
  longitude: station.longitude,
  type: StationType.STATION_LAVAGE,
  status: station.status,
});

// Component definition
const AdressGeoapify = ({
  onAddressSelect,
  errors = {},
  existingLocations = [] as CamperWashStation[],
  defaultValue,
  isSidebarOpen = false,
}: {
  onAddressSelect?: (formatted: string, lat: number, lon: number) => void;
  errors?: Record<string, { message?: string }>;
  existingLocations?: CamperWashStation[];
  defaultValue?: {
    formatted?: string;
    lat?: number;
    lon?: number;
  };
  isSidebarOpen?: boolean;
}) => {
  const [position, setPosition] = useState<LatLngTuple>(
    defaultValue
      ? [defaultValue.lat || 0, defaultValue.lon || 0]
      : [46.227638, 2.213749]
  );
  const [selectedLocation, setSelectedLocation] =
    useState<CamperWashStation | null>(null);
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);

  const addressMethods = useForm({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      address: defaultValue?.formatted || "",
      lat: defaultValue?.lat || 46.227638,
      lng: defaultValue?.lon || 2.213749,
    },
  });

  const stationMethods = useForm<StationFormValues>({
    resolver: zodResolver(stationFormSchema),
    defaultValues: {
      name: "",
      address: "",
      type: "STATION_LAVAGE",
      highPressure: "NONE",
      tirePressure: false,
      vacuum: false,
      wasteWater: false,
      electricity: "NONE",
    },
  });

  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

  const handlePlaceSelect = (value: GeoapifyResult | null) => {
    if (!value) return;
    const { lat, lon, formatted } = value.properties;
    const newPosition: LatLngTuple = [lat, lon];
    setPosition(newPosition);
    setIsStationModalOpen(true);
    stationMethods.setValue("address", formatted);

    const tempId = `temp-${Date.now()}`;
    const newStation: CamperWashStation = {
      id: tempId,
      name: "Nouvel emplacement",
      address: formatted,
      city: "",
      postalCode: "",
      latitude: lat,
      longitude: lon,
      type: "STATION_LAVAGE",
      status: "en_attente",
      images: [],
      services: {
        id: `service-${tempId}`,
        highPressure: "NONE",
        tirePressure: false,
        vacuum: false,
        handicapAccess: false,
        wasteWater: false,
        waterPoint: false,
        wasteWaterDisposal: false,
        blackWaterDisposal: false,
        electricity: "NONE",
        maxVehicleLength: null,
        paymentMethods: [],
      },
      parkingDetails: null,
      author: {
        name: null,
        email: null,
      },
      createdAt: new Date(),
    };
    setSelectedLocation(newStation);
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

  const handleStationSubmit: SubmitHandler<StationFormValues> = async (
    data
  ) => {
    console.log("Point d'intérêt data:", data);
    setIsStationModalOpen(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <MobileSidebar isSidebarOpen={isSidebarOpen} />
      <div
        className={cn(
          "flex-grow flex flex-col transition-all duration-300",
          isSidebarOpen ? "md:ml-72" : ""
        )}
      >
        {/* Barre de recherche */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm p-4 shadow-lg">
          <FormProvider {...addressMethods}>
            <form className="space-y-4">
              <h1 className="text-2xl font-bold text-center">
                Ajouter un point d'intérêt
              </h1>

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
                            placeholder="Entrez l'adresse du point d'intérêt"
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
            </form>
          </FormProvider>
        </div>

        {/* Conteneur de la carte */}
        <div className="flex-grow relative">
          <Map
            center={mapCenter}
            zoom={12}
            existingLocations={existingLocations.map(transformToMapLocation)}
            onLocationSelect={(location) => {
              if (selectedLocation) {
                setSelectedLocation({
                  ...selectedLocation,
                  latitude: location.lat,
                  longitude: location.lng,
                });
              } else {
                setSelectedLocation({
                  id: "",
                  name: "",
                  address: "",
                  latitude: location.lat,
                  longitude: location.lng,
                  status: "en_attente" as StationStatus,
                  services: {
                    id: "temp-" + Date.now(),
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
                  createdAt: new Date(),
                  city: "",
                  postalCode: "",
                  type: StationType.STATION_LAVAGE,
                  images: [],
                  parkingDetails: null,
                  author: {
                    name: null,
                    email: null,
                  },
                });
              }
            }}
          />
        </div>
      </div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Overlay */}
        <button
          className={cn(
            "fixed inset-0 bg-black/50 transition-opacity",
            isStationModalOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
          onClick={() => setIsStationModalOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsStationModalOpen(false);
            }
          }}
          aria-label="Fermer la fenêtre"
        />

        {/* Modal de création */}
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 transform transition-transform duration-300 ease-in-out pointer-events-auto bg-background rounded-t-xl shadow-lg",
            isStationModalOpen ? "translate-y-0" : "translate-y-full"
          )}
        >
          <div className="bg-background p-6 rounded-t-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Créer un point d'intérêt</h2>
            <form
              onSubmit={stationMethods.handleSubmit(handleStationSubmit)}
              className="space-y-4"
            >
              {/* Type de point d'intérêt */}
              <FormField
                control={stationMethods.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="STATION_LAVAGE">
                            Station de lavage
                          </SelectItem>
                          <SelectItem value="PARKING">
                            Place de parking
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Champs communs */}
              <FormField
                control={stationMethods.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nom du point d'intérêt" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Champs spécifiques selon le type */}
              {stationMethods.watch("type") === "STATION_LAVAGE" && (
                <>
                  <FormField
                    control={stationMethods.control}
                    name="highPressure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de haute pression</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Sélectionner le type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NONE">Aucun</SelectItem>
                              <SelectItem value="PASSERELLE">
                                Passerelle
                              </SelectItem>
                              <SelectItem value="ECHAFAUDAGE">
                                Échafaudage
                              </SelectItem>
                              <SelectItem value="PORTIQUE">Portique</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Champ électricité commun aux deux types */}
              <FormField
                control={stationMethods.control}
                name="electricity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Électricité</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Type d'électricité" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NONE">Non disponible</SelectItem>
                          <SelectItem value="AMP_8">8 ampères</SelectItem>
                          <SelectItem value="AMP_15">15 ampères</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Créer le point d'intérêt
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdressGeoapify;
