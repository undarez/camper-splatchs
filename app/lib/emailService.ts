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

// Template d'email commun
const emailTemplate = (content: string) => `
  <div style="background-color: #f8fafc; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
      <div style="background: linear-gradient(to right, #2ABED9, #1B4B82); padding: 30px; text-align: center;">
        <img src="${
          process.env.NEXT_PUBLIC_APP_URL
        }/images/logo.png" alt="SplashCamper Logo" style="height: 80px; margin: 0 auto;" />
      </div>
      <div style="padding: 30px;">
        ${content}
      </div>
      <div style="background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px;">
        <p>Pour toute demande, nous restons à votre disposition sur notre <a href="https://www.splashcamper.fr/pages/Contact" style="color: #2ABED9; text-decoration: none;">formulaire de contact</a>.</p>
        <p>© ${new Date().getFullYear()} SplashCamper. Tous droits réservés.</p>
      </div>
    </div>
  </div>
`;

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?token=${token}`;

  try {
    const mailOptions = {
      from: `"SplashCamper" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Vérifiez votre adresse email - SplashCamper",
      html: emailTemplate(`
        <h1 style="color: #1f2937; margin-bottom: 20px; font-size: 24px;">Bienvenue sur SplashCamper!</h1>
        <p style="color: #4b5563; margin-bottom: 20px; font-size: 16px;">Merci de vous être inscrit. Pour activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>
        <div style="text-align: center; margin: 30px 0;">
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
        <p style="color: #64748b; margin-top: 20px; font-size: 14px;">
          Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :
          <br>
          <a href="${verificationUrl}" style="color: #2ABED9; word-break: break-all;">${verificationUrl}</a>
        </p>
        <p style="color: #64748b; margin-top: 20px; font-size: 14px;">Ce lien expirera dans 24 heures.</p>
      `),
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de vérification:", error);
    return false;
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
    // Email à l'administrateur
    await transporter.sendMail({
      from: `"SplashCamper Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `Nouveau message de contact de ${contactData.name}`,
      html: emailTemplate(`
        <h1 style="color: #1f2937; margin-bottom: 20px; font-size: 24px;">Nouveau message de contact</h1>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <p style="margin: 0 0 10px 0;"><strong>De:</strong> ${contactData.name} (${contactData.email})</p>
          <p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; color: #4b5563; margin: 0;">${contactData.message}</p>
        </div>
      `),
    });

    // Email de confirmation à l'utilisateur
    await transporter.sendMail({
      from: `"SplashCamper" <${process.env.GMAIL_USER}>`,
      to: contactData.email,
      subject: "Nous avons bien reçu votre message",
      html: emailTemplate(`
        <h1 style="color: #1f2937; margin-bottom: 20px; font-size: 24px;">Merci de nous avoir contacté</h1>
        <p style="color: #4b5563; margin-bottom: 10px; font-size: 16px;">Bonjour ${contactData.name},</p>
        <p style="color: #4b5563; margin-bottom: 10px; font-size: 16px;">Nous avons bien reçu votre message.</p>
        <p style="color: #4b5563; margin-bottom: 20px; font-size: 16px;">Notre équipe vous répondra dans les plus brefs délais.</p>
        <div style="margin-top: 20px; color: #64748b;">
          <p style="margin: 0 0 5px 0;">Cordialement,</p>
          <p style="margin: 0; font-weight: bold;">L'équipe SplashCamper</p>
        </div>
      `),
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de contact:", error);
    return { success: false, error };
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

// Nouvelle fonction pour envoyer un email de confirmation d'inscription
export async function sendSignupConfirmationEmail(email: string, name: string) {
  try {
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/signin`;

    await transporter.sendMail({
      from: `"SplashCamper" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Bienvenue sur SplashCamper!",
      html: emailTemplate(`
        <h1 style="color: #1f2937; margin-bottom: 20px; font-size: 24px;">Bienvenue sur SplashCamper, ${name}!</h1>
        <p style="color: #4b5563; margin-bottom: 15px; font-size: 16px;">Votre compte a été créé avec succès. Nous sommes ravis de vous compter parmi notre communauté de camping-caristes!</p>
        <p style="color: #4b5563; margin-bottom: 20px; font-size: 16px;">Avec SplashCamper, vous pouvez facilement trouver des stations de lavage pour votre camping-car partout en France.</p>
        <div style="background-color: #f0f9ff; border-left: 4px solid #2ABED9; padding: 15px; margin-bottom: 20px;">
          <p style="color: #0369a1; margin: 0; font-size: 16px;">Pour profiter pleinement de toutes nos fonctionnalités, n'oubliez pas de vous connecter à votre compte.</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" 
             style="background: linear-gradient(to right, #2ABED9, #1B4B82);
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 5px;
                    display: inline-block;
                    font-weight: bold;">
            Se connecter
          </a>
        </div>
      `),
    });
    return { success: true };
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email de confirmation d'inscription:",
      error
    );
    return { success: false, error };
  }
}
