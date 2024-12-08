import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.ENCRYPTION_KEY;

export const encryptForDatabase = <T>(data: T): string => {
  try {
    if (!SECRET_KEY) throw new Error("Clé de chiffrement non définie");
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  } catch (error) {
    console.error("Erreur lors du chiffrement:", error);
    throw new Error("Erreur de chiffrement");
  }
};

export const decryptFromDatabase = <T>(encryptedData: string): T => {
  try {
    if (!SECRET_KEY) throw new Error("Clé de chiffrement non définie");
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) as T;
  } catch (error) {
    console.error("Erreur lors du déchiffrement:", error);
    throw new Error("Erreur de déchiffrement");
  }
};
