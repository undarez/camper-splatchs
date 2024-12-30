import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    // Créer le bucket s'il n'existe pas
    const { error: bucketError } = await supabase.storage.createBucket(
      "station-images",
      {
        public: true,
        allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
        fileSizeLimit: 5242880, // 5MB
      }
    );

    if (bucketError) {
      if (bucketError.message.includes("already exists")) {
        console.log("Le bucket existe déjà");
      } else {
        throw bucketError;
      }
    } else {
      console.log("Bucket créé avec succès");
    }

    // Configurer les politiques de sécurité
    const { error: policyError } = await supabase.rpc("create_storage_policy", {
      bucket_name: "station-images",
      policy_name: "allow_public_uploads",
      definition: `(bucket_id = 'station-images'::text)`,
      policy_type: "INSERT",
    });

    if (policyError) {
      throw policyError;
    }

    // Politique pour la lecture publique
    const { error: readPolicyError } = await supabase.rpc(
      "create_storage_policy",
      {
        bucket_name: "station-images",
        policy_name: "allow_public_read",
        definition: `(bucket_id = 'station-images'::text)`,
        policy_type: "SELECT",
      }
    );

    if (readPolicyError) {
      throw readPolicyError;
    }

    console.log("Politiques de sécurité configurées avec succès");
  } catch (error) {
    console.error("Erreur:", error);
    process.exit(1);
  }
}

main();
