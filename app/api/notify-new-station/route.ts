import { NextResponse } from "next/server";
import { z } from "zod";
import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const notificationSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  author: z.object({
    name: z.string().nullable(),
    email: z.string().email("Email invalide").optional(),
  }),
  services: z.object({
    highPressure: z.string(),
    tirePressure: z.boolean(),
    vacuum: z.boolean(),
    handicapAccess: z.boolean(),
    wasteWater: z.boolean(),
    electricity: z.string(),
  }),
});

if (!process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
  throw new Error(
    "NEXT_PUBLIC_ADMIN_EMAIL n'est pas défini dans les variables d'environnement"
  );
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { success: false, error: "Content-type doit être application/json" },
        { status: 415 }
      );
    }

    const body = await request.json();
    const validatedData = notificationSchema.parse(body);

    // Formater les services pour l'email
    const servicesList = [];
    if (validatedData.services.highPressure !== "NONE")
      servicesList.push(
        `Haute pression: ${validatedData.services.highPressure}`
      );
    if (validatedData.services.tirePressure)
      servicesList.push("Pression des pneus");
    if (validatedData.services.vacuum) servicesList.push("Aspirateur");
    if (validatedData.services.handicapAccess)
      servicesList.push("Accès handicapé");
    if (validatedData.services.wasteWater) servicesList.push("Eaux usées");
    if (validatedData.services.electricity !== "NONE")
      servicesList.push(`Électricité: ${validatedData.services.electricity}`);

    // Vérifier si les identifiants Gmail sont disponibles
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn(
        "Identifiants Gmail manquants. Les emails ne seront pas envoyés."
      );
      return NextResponse.json({
        success: true,
        message: "Station créée avec succès (notifications email désactivées)",
      });
    }

    // Email à l'administrateur
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
      subject: "Nouvelle station CamperWash créée",
      html: `
        <h2>Nouvelle station créée</h2>
        <p><strong>Nom de la station:</strong> ${validatedData.name}</p>
        <p><strong>Adresse:</strong> ${validatedData.address}</p>
        <p><strong>Créée par:</strong> ${
          validatedData.author.name || validatedData.author.email || "Anonyme"
        }</p>
        <h3>Services proposés:</h3>
        <ul>
          ${servicesList.map((service) => `<li>${service}</li>`).join("")}
        </ul>
        <p>Connectez-vous au tableau de bord administrateur pour valider cette station.</p>
      `,
    });

    // Email à l'utilisateur si un email est fourni
    if (validatedData.author.email) {
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: validatedData.author.email,
        subject: "Votre station CamperWash a été soumise",
        html: `
          <h2>Merci d'avoir soumis une nouvelle station !</h2>
          <p>Votre station "${
            validatedData.name
          }" a été soumise avec succès.</p>
          <p>Détails de la station :</p>
          <ul>
            <li>Adresse : ${validatedData.address}</li>
            <li>Services proposés :
              <ul>
                ${servicesList.map((service) => `<li>${service}</li>`).join("")}
              </ul>
            </li>
          </ul>
          <p>Notre équipe va examiner votre soumission dans les plus brefs délais.</p>
          <p>Nous vous notifierons dès que votre station sera validée.</p>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Station créée et notifications envoyées avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la création de la station:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors de la création de la station" },
      { status: 500 }
    );
  }
}
