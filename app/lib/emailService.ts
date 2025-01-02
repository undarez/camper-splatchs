import { createTransport } from "nodemailer";

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

const createTransporter = () => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transporter;
};

export async function sendStationCreationEmail(stationData: StationData) {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: `"CamperWash" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "Nouvelle Station Créée",
      html: `
        <div style="background-color: #f9fafb; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #1f2937;">Nouvelle Station de Lavage</h1>
            <p>Une nouvelle station a été créée avec les détails suivants :</p>
            <ul>
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
    const transporter = createTransporter();
    const mailOptions = {
      from: `"CamperWash Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "Nouveau Message de Contact",
      html: `
        <div style="background-color: #f9fafb; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #1f2937;">Nouveau Message de Contact</h1>
            <p><strong>De :</strong> ${contactData.name}</p>
            <p><strong>Email :</strong> ${contactData.email}</p>
            <p><strong>Message :</strong></p>
            <p>${contactData.message}</p>
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
    const transporter = createTransporter();
    const mailOptions = {
      from: `"CamperWash" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Confirmation de création de station",
      html: `
        <div style="background-color: #f9fafb; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #1f2937;">Confirmation de Création</h1>
            <p>Votre ${
              stationType === "STATION_LAVAGE"
                ? "station de lavage"
                : "place de parking"
            } "${stationName}" a été créée avec succès.</p>
            <p>Elle est actuellement en attente de validation par nos équipes. Vous recevrez un email dès qu'elle sera validée.</p>
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
    const transporter = createTransporter();
    const mailOptions = {
      from: `"CamperWash" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Validation de votre station",
      html: `
        <div style="background-color: #f9fafb; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #1f2937;">Station Validée</h1>
            <p>Bonne nouvelle ! Votre ${
              stationType === "STATION_LAVAGE"
                ? "station de lavage"
                : "place de parking"
            } "${stationName}" a été validée par notre équipe.</p>
            <p>Elle est maintenant visible par tous les utilisateurs de CamperWash.</p>
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
