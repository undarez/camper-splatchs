import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import stationsData from "../data/stations.json";

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

  for (const station of stationsData.stations) {
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
            averageRating: station.averageRating,
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
            averageRating: station.averageRating,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Ajouter les équipements
        if (station.equipments.length > 0) {
          const { error: equipmentError } = await supabase
            .from("station_equipments")
            .insert(
              station.equipments.map((equipment) => ({
                station_id: newStation.id,
                name: equipment,
              }))
            );

          if (equipmentError) throw equipmentError;
        }

        // Ajouter les horaires d'ouverture
        const openingHours = Object.entries(station.openingHours).map(
          ([day, hours]) => ({
            station_id: newStation.id,
            day: day.toLowerCase(),
            open_time: hours.open,
            close_time: hours.close,
          })
        );

        const { error: hoursError } = await supabase
          .from("opening_hours")
          .insert(openingHours);

        if (hoursError) throw hoursError;

        // Ajouter les tarifs
        const pricing = Object.entries(station.pricing).map(
          ([service, price]) => ({
            station_id: newStation.id,
            service_type: service,
            price: price,
          })
        );

        const { error: pricingError } = await supabase
          .from("pricing")
          .insert(pricing);

        if (pricingError) throw pricingError;
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
