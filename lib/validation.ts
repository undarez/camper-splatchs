// lib/validation.ts
import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(2, {
    message: "Votre nom doit avoir au moins deux caractères, merci.",
  }),
  lat: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(-90).max(90, "Latitude invalide")
  ),
  lng: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().min(-180).max(180, "Longitude invalide")
  ),
  address: z.string().min(5, {
    message: "L'adresse doit avoir au moins cinq caractères, merci.",
  }),
});
