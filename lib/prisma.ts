import { PrismaClient } from "@prisma/client";

// Déclaration pour le type global
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Création d'une instance PrismaClient avec gestion des logs
const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

// Utilisation d'une instance globale en développement pour éviter les connexions multiples
// lors du rechargement à chaud (hot reload)
const prisma = global.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
