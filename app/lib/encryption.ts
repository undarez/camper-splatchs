import CryptoJS from "crypto-js";

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "clé_de_chiffrement_par_défaut";

export function encryptForDatabase(data: string): string {
  try {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error("Erreur lors du chiffrement:", error);
    throw new Error("Erreur de chiffrement");
  }
}

export function decryptFromDatabase(encryptedData: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Erreur lors du déchiffrement:", error);
    return ""; // Retourne une chaîne vide en cas d'erreur
  }
}
