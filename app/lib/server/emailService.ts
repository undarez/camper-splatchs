import console from "console";
import { createTransport } from "nodemailer";

// Vérification des variables d'environnement requises
const requiredEnvVars = [
  "GMAIL_USER",
  "GMAIL_APP_PASSWORD",
  "NEXT_PUBLIC_APP_URL",
];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`La variable d'environnement ${envVar} est manquante`);
  }
}

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

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}`;

  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1E2337; color: white;">
      <div style="text-align: center; padding: 40px 20px; background: linear-gradient(to right, #2ABED9, #1B4B82);">
        <h1 style="margin: 0; font-size: 28px; color: white;">Vérification de votre compte CamperSplatchs</h1>
      </div>
      
      <div style="padding: 40px 20px;">
        <div style="background-color: #252B43; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
          <h2 style="color: #2ABED9; margin-top: 0; font-size: 20px;">Bienvenue sur CamperSplatchs !</h2>
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
          <p style="color: #9CA3AF; margin-top: 20px; font-size: 14px;">
            Ce lien expirera dans 24 heures pour des raisons de sécurité.
          </p>
        </div>
      </div>
      
      <div style="text-align: center; padding: 20px; border-top: 1px solid #374151;">
        <p style="color: #9CA3AF; margin: 0; font-size: 14px;">
          © ${new Date().getFullYear()} CamperSplatchs. Tous droits réservés.
          <br>
          <small style="font-size: 12px;">
            Cet email a été envoyé à ${email}
            <br>
            Si vous n'avez pas créé de compte sur CamperSplatchs, vous pouvez ignorer cet email.
          </small>
        </p>
      </div>
    </div>
  `;

  try {
    await transporter.verify();

    const mailOptions = {
      from: {
        name: "CamperSplatchs",
        address: process.env.GMAIL_USER || "",
      },
      to: email,
      subject: "Vérification de votre compte CamperSplatchs",
      html: emailTemplate,
      headers: {
        Precedence: "Bulk",
        "X-Auto-Response-Suppress": "OOF, AutoReply",
        "Auto-Submitted": "auto-generated",
      },
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de vérification:", error);
    return false;
  }
}
