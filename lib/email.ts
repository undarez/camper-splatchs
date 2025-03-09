import { google } from "googleapis";
import * as nodemailer from "nodemailer";

const requiredEnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GMAIL_REFRESH_TOKEN",
  "EMAIL_USER",
  "NEXT_PUBLIC_APP_URL",
] as const;

// Vérification des variables d'environnement requises
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`La variable d'environnement ${envVar} est manquante`);
  }
}

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

const createTransporter = async () => {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken?.token || undefined,
      },
      tls: {
        rejectUnauthorized: false,
      },
    } as nodemailer.TransportOptions);

    await transporter.verify();
    console.log("Connexion SMTP établie avec succès");

    return transporter;
  } catch (error) {
    console.error("Erreur création transporteur:", error);
    throw error;
  }
};

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
        <p>Pour avoir accès à toutes les fonctionnalités, n'oubliez pas de vous connecter à votre compte.</p>
        <p>Pour toute demande, nous restons à votre disposition sur notre <a href="https://www.splashcamper.fr/pages/Contact" style="color: #2ABED9; text-decoration: none;">formulaire de contact</a>.</p>
        <p>© ${new Date().getFullYear()} SplashCamper. Tous droits réservés.</p>
      </div>
    </div>
  </div>
`;

export const sendNewStationNotification = async (
  stationName: string,
  address: string,
  adminEmail: string
) => {
  try {
    const transporter = await createTransporter();

    await transporter.sendMail({
      from: `"SplashCamper" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: "Nouvelle station ajoutée",
      html: emailTemplate(`
        <h1 style="color: #1f2937; margin-bottom: 20px; font-size: 24px;">Nouvelle station ajoutée</h1>
        <p style="color: #4b5563; margin-bottom: 20px; font-size: 16px;">Une nouvelle station a été ajoutée et nécessite votre validation :</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <p style="margin: 0 0 10px 0;"><strong>Nom:</strong> ${stationName}</p>
          <p style="margin: 0;"><strong>Adresse:</strong> ${address}</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/stations" 
           style="background: linear-gradient(to right, #2ABED9, #1B4B82);
                  color: white;
                  padding: 12px 24px;
                  text-decoration: none;
                  border-radius: 5px;
                  display: inline-block;
                  margin-top: 20px;
                  font-weight: bold;">
          Voir la station
        </a>
      `),
    });
    console.log("Email de notification envoyé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
};

export const sendContactEmail = async (
  email: string,
  name: string,
  subject: string,
  message: string
) => {
  try {
    const transporter = await createTransporter();

    // Email à l'administrateur
    await transporter.sendMail({
      from: `"SplashCamper Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
      subject: `Nouveau message: ${subject}`,
      html: emailTemplate(`
        <h1 style="color: #1f2937; margin-bottom: 20px; font-size: 24px;">Nouveau message de contact</h1>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <p style="margin: 0 0 10px 0;"><strong>De:</strong> ${name} (${email})</p>
          <p style="margin: 0 0 10px 0;"><strong>Sujet:</strong> ${subject}</p>
          <p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; color: #4b5563; margin: 0;">${message}</p>
        </div>
      `),
    });
    console.log("Email admin envoyé avec succès");

    // Email de confirmation à l'utilisateur
    await transporter.sendMail({
      from: `"SplashCamper" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Nous avons bien reçu votre message",
      html: emailTemplate(`
        <h1 style="color: #1f2937; margin-bottom: 20px; font-size: 24px;">Merci de nous avoir contacté</h1>
        <p style="color: #4b5563; margin-bottom: 10px; font-size: 16px;">Bonjour ${name},</p>
        <p style="color: #4b5563; margin-bottom: 10px; font-size: 16px;">Nous avons bien reçu votre message concernant "${subject}".</p>
        <p style="color: #4b5563; margin-bottom: 20px; font-size: 16px;">Notre équipe vous répondra dans les plus brefs délais.</p>
        <div style="margin-top: 20px; color: #64748b;">
          <p style="margin: 0 0 5px 0;">Cordialement,</p>
          <p style="margin: 0; font-weight: bold;">L'équipe SplashCamper</p>
        </div>
      `),
    });
    console.log("Email de confirmation envoyé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
};

export async function sendVerificationEmail(email: string, token: string) {
  try {
    const transporter = await createTransporter();
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

    await transporter.sendMail({
      from: `"SplashCamper" <${process.env.EMAIL_USER}>`,
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
            Vérifier mon email
          </a>
        </div>
        <p style="color: #64748b; margin-top: 20px; font-size: 14px;">
          Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :
          <br>
          <a href="${verificationUrl}" style="color: #2ABED9; word-break: break-all;">${verificationUrl}</a>
        </p>
        <p style="color: #64748b; margin-top: 20px; font-size: 14px;">Ce lien expirera dans 24 heures.</p>
      `),
    });
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return false;
  }
}

// Nouvelle fonction pour envoyer un email de confirmation d'inscription
export async function sendSignupConfirmationEmail(email: string, name: string) {
  try {
    const transporter = await createTransporter();
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/signin`;

    await transporter.sendMail({
      from: `"SplashCamper" <${process.env.EMAIL_USER}>`,
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
    return true;
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email de confirmation d'inscription:",
      error
    );
    return false;
  }
}
