import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceIcon = './public/images/logo.png';
const outputDir = './public/icons';

async function generateIcons() {
  try {
    // Créer le dossier icons s'il n'existe pas
    await fs.mkdir(outputDir, { recursive: true });

    // Générer les icônes pour chaque taille
    for (const size of sizes) {
      await sharp(sourceIcon)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
      
      console.log(`✓ Icône ${size}x${size} générée`);
    }

    console.log('Toutes les icônes ont été générées avec succès !');
  } catch (error) {
    console.error('Erreur lors de la génération des icônes:', error);
  }
}

generateIcons(); 