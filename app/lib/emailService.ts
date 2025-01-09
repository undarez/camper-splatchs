"use client";

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

interface StationData {
  address: string;
  latitude: number;
  longitude: number;
  createdBy?: string;
}

interface ContactData {
  name: string;
  email: string;
  message: string;
}

export async function sendVerificationEmail(
  email: string,
  verificationToken: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;

  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1E2337; color: white;">
      <div style="text-align: center; padding: 40px 20px; background: linear-gradient(to right, #2ABED9, #1B4B82);">
        <h1 style="margin: 0; font-size: 28px; color: white;">Vérification de votre compte CamperWash</h1>
      </div>
      
      <div style="padding: 40px 20px;">
        <div style="background-color: #252B43; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
          <h2 style="color: #2ABED9; margin-top: 0; font-size: 20px;">Bienvenue sur CamperWash !</h2>
          <p style="color: #E5E7EB; margin-bottom: 20px;">
            Merci de vous être inscrit. Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :
          </p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(to right, #2ABED9, #1B4B82);
                      color: white;
                      padding: 12px 24px;
                      text-decoration: none;
                      border-radius: 5px;
                      display: inline-block;
                      font-weight: bold;">
              Vérifier mon compte
            </a>
          </div>
          <p style="color: #9CA3AF; margin-top: 20px; font-size: 14px;">
            Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :
            <br>
            <span style="color: #2ABED9;">${verificationUrl}</span>
          </p>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; border-top: 1px solid #374151;">
        <p style="color: #9CA3AF; margin: 0; font-size: 14px;">
          © ${new Date().getFullYear()} CamperWash. Tous droits réservés.
        </p>
      </div>
    </div>
  `;

  try {
    const mailOptions = {
      from: `"CamperWash" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Vérifiez votre adresse email - CamperWash",
      html: emailTemplate,
    };

    await transporter.sendMail(mailOptions);
    return { success: true as const };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de vérification:", error);
    return { success: false as const, error };
  }
}

export async function sendStationCreationEmail(stationData: StationData) {
  try {
    const mailOptions = {
      from: `"CamperWash" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "Nouvelle Station Créée",
      html: `
        <div style="background-color: #1E2337; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #252B43; padding: 20px; border-radius: 10px;">
            <h1 style="color: #2ABED9;">Nouvelle Station de Lavage</h1>
            <p style="color: #E5E7EB;">Une nouvelle station a été créée avec les détails suivants :</p>
            <ul style="color: #E5E7EB;">
              <li>Adresse : ${stationData.address}</li>
              <li>Latitude : ${stationData.latitude}</li>
              <li>Longitude : ${stationData.longitude}</li>
              <li>Créée par : ${
                stationData.createdBy || "Utilisateur anonyme"
              }</li>
            </ul>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true as const };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return { success: false as const, error };
  }
}

export async function sendContactEmail(contactData: ContactData) {
  try {
    const mailOptions = {
      from: `"CamperWash Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "Nouveau Message de Contact",
      html: `
        <div style="background-color: #1E2337; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #252B43; padding: 20px; border-radius: 10px;">
            <h1 style="color: #2ABED9;">Nouveau Message de Contact</h1>
            <p style="color: #E5E7EB;"><strong>De :</strong> ${contactData.name}</p>
            <p style="color: #E5E7EB;"><strong>Email :</strong> ${contactData.email}</p>
            <p style="color: #E5E7EB;"><strong>Message :</strong></p>
            <p style="color: #E5E7EB;">${contactData.message}</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true as const };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return { success: false as const, error };
  }
}

export async function sendStationCreationConfirmationEmail(
  userEmail: string,
  stationName: string,
  stationType: string
) {
  try {
    const mailOptions = {
      from: `"CamperWash" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: "Confirmation de création de station",
      html: `
        <div style="background-color: #1E2337; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #252B43; padding: 20px; border-radius: 10px;">
            <h1 style="color: #2ABED9;">Confirmation de Création</h1>
            <p style="color: #E5E7EB;">Votre ${
              stationType === "STATION_LAVAGE"
                ? "station de lavage"
                : "place de parking"
            } "${stationName}" a été créée avec succès.</p>
            <p style="color: #E5E7EB;">Elle est actuellement en attente de validation par nos équipes. Vous recevrez un email dès qu'elle sera validée.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true as const };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de confirmation:", error);
    return { success: false as const, error };
  }
}

export async function sendStationValidationEmail(
  userEmail: string,
  stationName: string,
  stationType: string
) {
  try {
    const mailOptions = {
      from: `"CamperWash" <${process.env.GMAIL_USER}>`,
      to: userEmail,
      subject: "Validation de votre station",
      html: `
        <div style="background-color: #1E2337; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #252B43; padding: 20px; border-radius: 10px;">
            <h1 style="color: #2ABED9;">Station Validée</h1>
            <p style="color: #E5E7EB;">Bonne nouvelle ! Votre ${
              stationType === "STATION_LAVAGE"
                ? "station de lavage"
                : "place de parking"
            } "${stationName}" a été validée par notre équipe.</p>
            <p style="color: #E5E7EB;">Elle est maintenant visible par tous les utilisateurs de CamperWash.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true as const };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de validation:", error);
    return { success: false as const, error };
  }
}
