import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const androidIconSizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192
};

const inputFile = path.join(__dirname, '../public/images/logo.png');
const outputDir = path.join(__dirname, '../android/app/src/main/res');

async function generateAndroidIcons() {
  try {
    // Créer le dossier de sortie s'il n'existe pas
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const [folder, size] of Object.entries(androidIconSizes)) {
      const folderPath = path.join(outputDir, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      await sharp(inputFile)
        .resize(size, size)
        .toFile(path.join(folderPath, 'ic_launcher.png'));

      await sharp(inputFile)
        .resize(size, size)
        .toFile(path.join(folderPath, 'ic_launcher_round.png'));

      console.log(`✓ Généré: ${folder}/ic_launcher.png`);
    }
    console.log('Génération des icônes Android terminée !');
  } catch (error) {
    console.error('Erreur lors de la génération des icônes:', error);
  }
}

generateAndroidIcons();
