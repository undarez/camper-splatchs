import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du répertoire courant (équivalent à __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Email administrateur à définir
const adminEmail = 'fortuna77320@gmail.com';

// Chemin vers le fichier .env.local
const envFilePath = path.join(path.dirname(__dirname), '.env.local');

try {
  console.log('Vérification du fichier .env.local...');
  
  // Vérifier si le fichier existe
  if (!fs.existsSync(envFilePath)) {
    console.log('Le fichier .env.local n\'existe pas, création du fichier...');
    fs.writeFileSync(envFilePath, `NEXT_PUBLIC_ADMIN_EMAIL=${adminEmail}\n`);
    console.log('Fichier .env.local créé avec succès.');
    process.exit(0);
  }
  
  // Lire le contenu du fichier
  const envContent = fs.readFileSync(envFilePath, 'utf8');
  
  // Vérifier si la variable existe déjà
  if (envContent.includes('NEXT_PUBLIC_ADMIN_EMAIL=')) {
    // Remplacer la valeur existante
    const updatedContent = envContent.replace(
      /NEXT_PUBLIC_ADMIN_EMAIL=.*/,
      `NEXT_PUBLIC_ADMIN_EMAIL=${adminEmail}`
    );
    
    fs.writeFileSync(envFilePath, updatedContent);
    console.log('Variable NEXT_PUBLIC_ADMIN_EMAIL mise à jour avec succès.');
  } else {
    // Ajouter la variable à la fin du fichier
    fs.appendFileSync(envFilePath, `\nNEXT_PUBLIC_ADMIN_EMAIL=${adminEmail}\n`);
    console.log('Variable NEXT_PUBLIC_ADMIN_EMAIL ajoutée avec succès.');
  }
  
  console.log(`Email administrateur défini: ${adminEmail}`);
} catch (error) {
  console.error('Erreur lors de la mise à jour du fichier .env.local:', error);
  process.exit(1);
} 