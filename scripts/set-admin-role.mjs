import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

// Email de l'administrateur (utiliser la variable d'environnement ou une valeur par défaut)
const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'fortuna77320@gmail.com';

console.log(`Email administrateur configuré: ${adminEmail}`);
console.log(`NEXT_PUBLIC_ADMIN_EMAIL: ${process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'Non défini'}`);
console.log(`ADMIN_EMAIL: ${process.env.ADMIN_EMAIL || 'Non défini'}`);

async function main() {
  try {
    console.log(`Recherche de l'utilisateur avec l'email: ${adminEmail}`);
    
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email: adminEmail },
      select: { id: true, email: true, role: true, name: true }
    });
    
    if (!user) {
      console.error(`Aucun utilisateur trouvé avec l'email: ${adminEmail}`);
      return;
    }
    
    console.log('Utilisateur trouvé:', user);
    
    // Mettre à jour le rôle de l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { email: adminEmail },
      data: { role: 'ADMIN' },
      select: { id: true, email: true, role: true, name: true }
    });
    
    console.log('Rôle mis à jour avec succès:', updatedUser);
    
    // Vérifier les sessions de l'utilisateur
    const sessions = await prisma.session.findMany({
      where: { userId: user.id },
      select: { id: true, expires: true }
    });
    
    console.log(`Sessions trouvées: ${sessions.length}`);
    
    // Supprimer les sessions existantes pour forcer une nouvelle connexion
    if (sessions.length > 0) {
      await prisma.session.deleteMany({
        where: { userId: user.id }
      });
      console.log('Sessions supprimées avec succès');
    }
    
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 