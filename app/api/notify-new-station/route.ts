import { NextResponse } from "next/server";
import { z } from "zod";
import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Schéma simplifié
const notificationSchema = z.object({
  name: z.string(),
  address: z.string(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
  type: z.enum(["STATION_LAVAGE", "PARKING"]),
  services: z
    .object({
      highPressure: z.enum(["NONE", "PASSERELLE", "ECHAFAUDAGE", "PORTIQUE"]),
      tirePressure: z.boolean(),
      vacuum: z.boolean(),
      handicapAccess: z.boolean(),
      wasteWater: z.boolean(),
      waterPoint: z.boolean(),
      wasteWaterDisposal: z.boolean(),
      blackWaterDisposal: z.boolean(),
      electricity: z.enum(["NONE", "AMP_8", "AMP_15"]),
      maxVehicleLength: z.number().nullable(),
      paymentMethods: z.array(z.string()),
    })
    .optional()
    .nullable(),
  parkingDetails: z
    .object({
      isPayant: z.boolean(),
      tarif: z.number().nullable(),
      hasElectricity: z.enum(["NONE", "AMP_8", "AMP_15"]),
      commercesProches: z.array(z.string()),
      handicapAccess: z.boolean(),
    })
    .optional()
    .nullable(),
  author: z.object({
    name: z.string().nullable(),
    email: z.string().optional(),
  }),
});

interface EmailError {
  code?: string;
  response?: unknown;
  message?: string;
}

export async function POST(request: Request) {
  try {
    console.log("Route notify-new-station appelée");
    const body = await request.json();
    console.log("Données reçues:", body);

    console.log("Validation des données...");
    const validatedData = notificationSchema.parse(body);
    console.log("Données validées:", validatedData);

    console.log("Vérification des variables d'environnement...");
    console.log(
      "GMAIL_USER:",
      process.env.GMAIL_USER ? "Défini" : "Non défini"
    );
    console.log(
      "GMAIL_APP_PASSWORD:",
      process.env.GMAIL_APP_PASSWORD ? "Défini" : "Non défini"
    );
    console.log(
      "ADMIN_EMAIL:",
      process.env.ADMIN_EMAIL ? "Défini" : "Non défini"
    );

    // Formater les services pour l'email
    const formatServices = () => {
      if (validatedData.type === "STATION_LAVAGE" && validatedData.services) {
        const services = [];
        const s = validatedData.services;

        if (s.highPressure !== "NONE")
          services.push(`
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="color: #10B981; margin-right: 8px;">✓</span>
              <span style="color: #E5E7EB;">Haute pression: ${formatHighPressure(
                s.highPressure
              )}</span>
            </li>
          `);
        if (s.tirePressure)
          services.push(`
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="color: #10B981; margin-right: 8px;">✓</span>
              <span style="color: #E5E7EB;">Gonflage pneus</span>
            </li>
          `);
        if (s.vacuum)
          services.push(`
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="color: #10B981; margin-right: 8px;">✓</span>
              <span style="color: #E5E7EB;">Aspirateur</span>
            </li>
          `);
        if (s.handicapAccess)
          services.push(`
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="color: #10B981; margin-right: 8px;">✓</span>
              <span style="color: #E5E7EB;">Accès handicapé</span>
            </li>
          `);
        if (s.wasteWater)
          services.push(`
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="color: #10B981; margin-right: 8px;">✓</span>
              <span style="color: #E5E7EB;">Vidange eaux usées</span>
            </li>
          `);
        if (s.waterPoint)
          services.push(`
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="color: #10B981; margin-right: 8px;">✓</span>
              <span style="color: #E5E7EB;">Point d'eau</span>
            </li>
          `);
        if (s.wasteWaterDisposal)
          services.push(`
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="color: #10B981; margin-right: 8px;">✓</span>
              <span style="color: #E5E7EB;">Évacuation eaux usées</span>
            </li>
          `);
        if (s.blackWaterDisposal)
          services.push(`
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="color: #10B981; margin-right: 8px;">✓</span>
              <span style="color: #E5E7EB;">Évacuation eaux noires</span>
            </li>
          `);
        if (s.electricity !== "NONE")
          services.push(`
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="color: #10B981; margin-right: 8px;">✓</span>
              <span style="color: #E5E7EB;">Électricité: ${formatElectricity(
                s.electricity
              )}</span>
            </li>
          `);
        if (s.maxVehicleLength)
          services.push(`
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="color: #10B981; margin-right: 8px;">✓</span>
              <span style="color: #E5E7EB;">Longueur max: ${s.maxVehicleLength}m</span>
            </li>
          `);

        return services.join("");
      }

      if (validatedData.type === "PARKING" && validatedData.parkingDetails) {
        const services = [];
        const p = validatedData.parkingDetails;

        if (p.isPayant)
          services.push(`
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="color: #10B981; margin-right: 8px;">✓</span>
              <span style="color: #E5E7EB;">Parking payant${
                p.tarif ? ` (${p.tarif}€/jour)` : ""
              }</span>
            </li>
          `);
        if (p.hasElectricity !== "NONE")
          services.push(`
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="color: #10B981; margin-right: 8px;">✓</span>
              <span style="color: #E5E7EB;">Électricité: ${formatElectricity(
                p.hasElectricity
              )}</span>
            </li>
          `);
        if (p.handicapAccess)
          services.push(`
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="color: #10B981; margin-right: 8px;">✓</span>
              <span style="color: #E5E7EB;">Accès handicapé</span>
            </li>
          `);
        if (p.commercesProches && p.commercesProches.length > 0)
          services.push(`
            <li style="margin-bottom: 10px; display: flex; align-items: center;">
              <span style="color: #10B981; margin-right: 8px;">✓</span>
              <span style="color: #E5E7EB;">Commerces à proximité: ${formatCommerces(
                p.commercesProches
              )}</span>
            </li>
          `);

        return services.join("");
      }

      return "<li style='color: #E5E7EB;'>Aucun service spécifié</li>";
    };

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1E2337; color: white;">
        <div style="text-align: center; padding: 40px 20px; background: linear-gradient(to right, #2ABED9, #1B4B82);">
          <img src="/images/logo.png" alt="CamperWash Logo" style="max-width: 200px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 28px; color: white;">Nouvelle ${
            validatedData.type === "STATION_LAVAGE"
              ? "Station de Lavage"
              : "Place de Parking"
          }</h1>
        </div>
        
        <div style="padding: 40px 20px;">
          <div style="background-color: #252B43; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #2ABED9; margin-top: 0; font-size: 20px;">Informations Générales</h2>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 10px;">
                <strong style="color: #2ABED9;">Nom:</strong> 
                <span style="color: #E5E7EB;">${validatedData.name}</span>
              </li>
              <li style="margin-bottom: 10px;">
                <strong style="color: #2ABED9;">Adresse:</strong> 
                <span style="color: #E5E7EB;">${validatedData.address}</span>
              </li>
              <li style="margin-bottom: 10px;">
                <strong style="color: #2ABED9;">Ville:</strong> 
                <span style="color: #E5E7EB;">${
                  validatedData.city || "Non spécifié"
                }</span>
              </li>
              <li style="margin-bottom: 10px;">
                <strong style="color: #2ABED9;">Code Postal:</strong> 
                <span style="color: #E5E7EB;">${
                  validatedData.postalCode || "Non spécifié"
                }</span>
              </li>
              <li style="margin-bottom: 10px;">
                <strong style="color: #2ABED9;">Coordonnées:</strong> 
                <span style="color: #E5E7EB;">${validatedData.latitude}, ${
      validatedData.longitude
    }</span>
              </li>
            </ul>
          </div>

          <div style="background-color: #252B43; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #2ABED9; margin-top: 0; font-size: 20px;">Services Disponibles</h2>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${formatServices()}
            </ul>
          </div>

          <div style="background-color: #252B43; padding: 30px; border-radius: 10px;">
            <h2 style="color: #2ABED9; margin-top: 0; font-size: 20px;">Informations Complémentaires</h2>
            <p style="color: #E5E7EB; margin-bottom: 20px;">
              Cette ${
                validatedData.type === "STATION_LAVAGE"
                  ? "station"
                  : "place de parking"
              } a été ajoutée par:
              <strong>${
                validatedData.author.name ||
                validatedData.author.email ||
                "Utilisateur anonyme"
              }</strong>
            </p>
            <p style="color: #E5E7EB; margin-bottom: 20px;">
              Statut actuel: <span style="color: #FCD34D;">En attente de validation</span>
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/stations" 
                 style="background: linear-gradient(to right, #2ABED9, #1B4B82);
                        color: white;
                        padding: 12px 24px;
                        text-decoration: none;
                        border-radius: 5px;
                        display: inline-block;
                        font-weight: bold;">
                Valider la Station
              </a>
            </div>
          </div>
        </div>

        <div style="text-align: center; padding: 20px; border-top: 1px solid #374151;">
          <p style="color: #9CA3AF; margin: 0; font-size: 14px;">
            © ${new Date().getFullYear()} CamperWash. Tous droits réservés.
          </p>
        </div>
      </div>
    `;

    if (
      process.env.GMAIL_USER &&
      process.env.GMAIL_APP_PASSWORD &&
      process.env.ADMIN_EMAIL
    ) {
      console.log("Configuration du transporteur nodemailer...");
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: "Nouvelle station CamperWash à valider",
        html: emailTemplate,
      };
      console.log("Options d'email configurées:", {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
      });

      console.log("Tentative d'envoi de l'email...");
      await transporter.sendMail(mailOptions);
      console.log("Email envoyé avec succès");

      return NextResponse.json({
        success: true,
        message: "Notification envoyée avec succès",
      });
    } else {
      console.error(
        "Variables d'environnement manquantes pour l'envoi d'email"
      );
      return NextResponse.json(
        {
          success: false,
          error: "Configuration email manquante",
          missingVars: {
            GMAIL_USER: !process.env.GMAIL_USER,
            GMAIL_APP_PASSWORD: !process.env.GMAIL_APP_PASSWORD,
            ADMIN_EMAIL: !process.env.ADMIN_EMAIL,
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erreur détaillée:", error);

    const emailError = error as EmailError;

    if (emailError.code === "EAUTH") {
      console.error("Erreur d'authentification Gmail");
    }
    if (emailError.response) {
      console.error("Réponse d'erreur:", emailError.response);
    }
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de l'envoi de la notification",
        details: emailError.message,
      },
      { status: 500 }
    );
  }
}

// Fonctions utilitaires pour le formatage
type HighPressureType = "PASSERELLE" | "ECHAFAUDAGE" | "PORTIQUE";
type ElectricityType = "AMP_8" | "AMP_15";
type CommerceType =
  | "CENTRE_VILLE"
  | "SUPERMARCHE"
  | "RESTAURANT"
  | "STATION_SERVICE"
  | "BOULANGERIE"
  | "PHARMACIE";

function formatHighPressure(type: HighPressureType): string {
  const types: Record<HighPressureType, string> = {
    PASSERELLE: "Passerelle",
    ECHAFAUDAGE: "Échafaudage",
    PORTIQUE: "Portique",
  };
  return types[type] || type;
}

function formatElectricity(type: ElectricityType): string {
  const types: Record<ElectricityType, string> = {
    AMP_8: "8 ampères",
    AMP_15: "15 ampères",
  };
  return types[type] || type;
}

function formatCommerces(commerces: (CommerceType | string)[]): string {
  const types: Record<CommerceType, string> = {
    CENTRE_VILLE: "Centre-ville",
    SUPERMARCHE: "Supermarché",
    RESTAURANT: "Restaurant",
    STATION_SERVICE: "Station-service",
    BOULANGERIE: "Boulangerie",
    PHARMACIE: "Pharmacie",
  };
  return commerces.map((c) => types[c as CommerceType] || c).join(", ");
}
