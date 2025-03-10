// Script pour définir l'email administrateur dans la base de données
// Exécuter avec: node --experimental-specifier-resolution=node scripts/set-admin-email.js

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    // Récupérer l'email administrateur depuis les variables d'environnement
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
    
    if (!adminEmail) {
      console.error('❌ Erreur: Variable d\'environnement NEXT_PUBLIC_ADMIN_EMAIL ou ADMIN_EMAIL non définie');
      process.exit(1);
    }
    
    console.log(`🔍 Recherche de l'utilisateur avec l'email: ${adminEmail}`);
    
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email: adminEmail },
      select: { id: true, email: true, role: true },
    });
    
    if (!user) {
      console.error(`❌ Erreur: Utilisateur avec l'email ${adminEmail} non trouvé dans la base de données`);
      process.exit(1);
    }
    
    console.log(`✅ Utilisateur trouvé: ${JSON.stringify(user)}`);
    
    // Mettre à jour le rôle si nécessaire
    if (user.role !== 'ADMIN') {
      console.log(`🔄 Mise à jour du rôle de l'utilisateur ${user.email} de ${user.role} à ADMIN`);
      
      const updatedUser = await prisma.user.update({
        where: { email: adminEmail },
        data: { role: 'ADMIN' },
        select: { id: true, email: true, role: true },
      });
      
      console.log(`✅ Rôle mis à jour avec succès: ${JSON.stringify(updatedUser)}`);
      
      // Supprimer les sessions existantes pour forcer une nouvelle connexion
      const deletedSessions = await prisma.session.deleteMany({
        where: { userId: user.id },
      });
      
      console.log(`🗑️ Sessions supprimées: ${deletedSessions.count}`);
    } else {
      console.log(`✅ L'utilisateur a déjà le rôle ADMIN`);
    }
    
    // Vérifier tous les utilisateurs avec le rôle ADMIN
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true, email: true, role: true },
    });
    
    console.log(`📊 Utilisateurs avec le rôle ADMIN (${adminUsers.length}):`);
    adminUsers.forEach(admin => {
      console.log(`   - ${admin.email}`);
    });
    
    console.log('✅ Opération terminée avec succès');
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 