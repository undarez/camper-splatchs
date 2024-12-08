import { google } from "googleapis";
import * as nodemailer from "nodemailer";

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

export const sendNewStationNotification = async (
  stationName: string,
  address: string
) => {
  try {
    const transporter = await createTransporter();

    await transporter.sendMail({
      from: `"CamperWash" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "Nouvelle station ajoutée",
      html: `
        <div style="background-color: #f9fafb; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="CamperWash Logo" style="width: 200px; margin-bottom: 20px;" />
            <h1 style="color: #1f2937;">Nouvelle station ajoutée</h1>
            <p>Une nouvelle station a été ajoutée et nécessite votre validation :</p>
            <ul>
              <li>Nom: ${stationName}</li>
              <li>Adresse: ${address}</li>
            </ul>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/stations" 
               style="background: linear-gradient(to right, #2ABED9, #1B4B82);
                      color: white;
                      padding: 10px 20px;
                      text-decoration: none;
                      border-radius: 5px;
                      display: inline-block;
                      margin-top: 20px;">
              Voir la station
            </a>
          </div>
        </div>
      `,
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

    // Template commun pour l'en-tête et le pied de page
    const emailTemplate = (content: string) => `
      <div style="background-color: #f8fafc; padding: 20px; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
          <!-- En-tête avec logo -->
          <div style="background: linear-gradient(to right, #2ABED9, #1B4B82); padding: 20px; text-align: center;">
            <img src="${
              process.env.NEXT_PUBLIC_APP_URL
            }/images/logo.png" alt="CamperWash Logo" style="height: 60px; margin: 0 auto;" />
          </div>
          
          <!-- Contenu -->
          <div style="padding: 30px;">
            ${content}
          </div>
          
          <!-- Pied de page -->
          <div style="background-color: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px;">
            <p>© ${new Date().getFullYear()} CamperWash. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    `;

    // Email à l'administrateur
    await transporter.sendMail({
      from: `"CamperWash Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `Nouveau message: ${subject}`,
      html: emailTemplate(`
        <h1 style="color: #1e293b; margin-bottom: 20px;">Nouveau message de contact</h1>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <p><strong>De:</strong> ${name} (${email})</p>
          <p><strong>Sujet:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; color: #334155;">${message}</p>
        </div>
      `),
    });
    console.log("Email admin envoyé avec succès");

    console.log("Envoi de la confirmation à l'utilisateur...");
    await transporter.sendMail({
      from: `"CamperWash" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Nous avons bien reçu votre message",
      html: emailTemplate(`
        <h1 style="color: #1e293b; margin-bottom: 20px;">Merci de nous avoir contacté</h1>
        <p>Bonjour ${name},</p>
        <p>Nous avons bien reçu votre message concernant "${subject}".</p>
        <p>Notre équipe vous répondra dans les plus brefs délais.</p>
        <div style="margin-top: 20px; color: #64748b;">
          <p>Cordialement,</p>
          <p>L'équipe CamperWash</p>
        </div>
      `),
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
};
