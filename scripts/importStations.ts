import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import stationsData from "../data/stations.json";

// Fonction pour nettoyer les noms de fichiers
function cleanImagePath(imageName: string): string {
  return `/images/stations-lavatrans/${imageName}`
    .replace(/[^a-zA-Z0-9-./]/g, "")
    .toLowerCase();
}

// Définition des types
// interface OpeningHours {
//   open: string;
//   close: string;
// }

interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  images: string[];
  status: string;
  type: string;
  phoneNumber: string;
  description: string;
  isLavaTrans: boolean;
  services: {
    highPressure: string;
    tirePressure: boolean;
    vacuum: boolean;
    handicapAccess: boolean;
    wasteWater: boolean;
    waterPoint: boolean;
    wasteWaterDisposal: boolean;
    blackWaterDisposal: boolean;
    electricity: string;
    paymentMethods: string[];
  };
}

interface Parking {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  images: string[];
  status: string;
  type: string;
  phoneNumber: string | null;
  description: string;
  isLavaTrans: boolean;
  parkingDetails: {
    isPayant: boolean;
    tarif: string | null;
    taxeSejour: string | null;
    hasElectricity: string;
    commercesProches: string[];
    handicapAccess: boolean;
    totalPlaces: number;
    hasWifi: boolean;
    hasChargingPoint: boolean;
    hasBarrier: boolean;
  };
}

interface StationsData {
  stations: Station[];
  parkings: Parking[];
}

// Charger les variables d'environnement
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Les variables d'environnement Supabase ne sont pas définies");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function importStations() {
  console.log("Début de l'importation des stations...");

  const typedStationsData = stationsData as StationsData;

  for (const station of typedStationsData.stations) {
    try {
      // Vérifier si la station existe déjà
      const { data: existingStation } = await supabase
        .from("stations")
        .select("id")
        .eq("name", station.name)
        .single();

      if (existingStation) {
        console.log(`La station "${station.name}" existe déjà, mise à jour...`);

        // Mise à jour de la station existante
        const { error: updateError } = await supabase
          .from("stations")
          .update({
            address: station.address,
            latitude: station.latitude,
            longitude: station.longitude,
            type: station.type,
            status: station.status,
            description: station.description,
            images: station.images.map(cleanImagePath),
          })
          .eq("id", existingStation.id);

        if (updateError) throw updateError;
      } else {
        console.log(`Création de la nouvelle station "${station.name}"...`);

        // Création d'une nouvelle station
        const { data: newStation, error: insertError } = await supabase
          .from("stations")
          .insert({
            name: station.name,
            address: station.address,
            latitude: station.latitude,
            longitude: station.longitude,
            type: station.type,
            status: station.status,
            description: station.description,
            images: station.images.map(cleanImagePath),
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Ajouter les services comme équipements
        const services = Object.entries(station.services)
          .filter(
            ([key, value]) =>
              (typeof value === "boolean" && value === true) ||
              ((key === "highPressure" || key === "electricity") &&
                value !== "")
          )
          .map(([key]) => ({
            station_id: newStation.id,
            name: key,
          }));

        if (services.length > 0) {
          const { error: equipmentError } = await supabase
            .from("station_equipments")
            .insert(services);

          if (equipmentError) throw equipmentError;
        }

        // Ajouter les tarifs pour l'électricité et la haute pression si disponibles
        const pricing = [];
        if (
          station.services.electricity &&
          station.services.electricity !== ""
        ) {
          pricing.push({
            station_id: newStation.id,
            service_type: "electricity",
            price: parseFloat(station.services.electricity),
          });
        }
        if (
          station.services.highPressure &&
          station.services.highPressure !== ""
        ) {
          pricing.push({
            station_id: newStation.id,
            service_type: "highPressure",
            price: parseFloat(station.services.highPressure),
          });
        }

        if (pricing.length > 0) {
          const { error: pricingError } = await supabase
            .from("pricing")
            .insert(pricing);

          if (pricingError) throw pricingError;
        }
      }

      console.log(`Station "${station.name}" traitée avec succès`);
    } catch (error) {
      console.error(
        `Erreur lors du traitement de la station "${station.name}":`,
        error
      );
    }
  }

  console.log("Importation terminée");
}

// Exécuter l'importation
importStations().catch(console.error);
