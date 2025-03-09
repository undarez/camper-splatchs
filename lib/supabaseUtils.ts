import { supabase, supabaseAdmin } from "./supabase";
import prisma from "./prisma";
import { User } from "@prisma/client";

/**
 * Fonctions utilitaires pour interagir avec Supabase
 */

// Types
type SignUpData = {
  email: string;
  password: string;
  name: string;
};

type SignInData = {
  email: string;
  password: string;
};

// Type d'erreur personnalisé
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Vérifie si un email existe déjà dans Supabase
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    return existingUsers.users.some((user) => user.email === email);
  } catch (error) {
    console.error("Erreur lors de la vérification de l'email:", error);
    throw new AuthError("Erreur lors de la vérification de l'email");
  }
}

/**
 * Crée un nouvel utilisateur dans Supabase et Prisma
 */
export async function createUser(userData: SignUpData): Promise<User> {
  try {
    // 1. Vérifier si l'email existe déjà
    const emailExists = await checkEmailExists(userData.email);
    if (emailExists) {
      throw new AuthError("Cette adresse email est déjà utilisée");
    }

    // 2. Créer l'utilisateur dans Supabase
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        name: userData.name,
        role: "USER",
      },
    });

    if (error || !user) {
      throw new AuthError(
        `Erreur lors de la création du compte: ${
          error?.message || "Utilisateur non créé"
        }`
      );
    }

    // 3. Créer l'utilisateur dans Prisma
    const prismaUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email || userData.email,
        name: userData.name,
        role: "USER",
      },
    });

    return prismaUser;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    console.error("Erreur lors de la création de l'utilisateur:", error);
    throw new AuthError("Erreur lors de la création de l'utilisateur");
  }
}

/**
 * Connecte un utilisateur avec son email et mot de passe
 */
export async function signInUser(credentials: SignInData) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new AuthError(`Erreur de connexion: ${error.message}`);
    }

    return data;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    console.error("Erreur lors de la connexion:", error);
    throw new AuthError("Erreur lors de la connexion");
  }
}

/**
 * Déconnecte l'utilisateur actuel
 */
export async function signOutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new AuthError(`Erreur de déconnexion: ${error.message}`);
    }
    return true;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    console.error("Erreur lors de la déconnexion:", error);
    throw new AuthError("Erreur lors de la déconnexion");
  }
}

/**
 * Récupère les informations de l'utilisateur actuel
 */
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw new AuthError(
        `Erreur lors de la récupération de l'utilisateur: ${error.message}`
      );
    }

    if (!user) {
      return null;
    }

    // Récupérer les données complètes de l'utilisateur depuis Prisma
    const prismaUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    return prismaUser;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    throw new AuthError("Erreur lors de la récupération de l'utilisateur");
  }
}

/**
 * Met à jour les informations d'un utilisateur
 */
export async function updateUser(userId: string, userData: Partial<User>) {
  try {
    // Mettre à jour dans Prisma
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userData,
    });

    // Mettre à jour les métadonnées dans Supabase si nécessaire
    if (userData.name) {
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { name: userData.name },
      });
    }

    return updatedUser;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    throw new AuthError("Erreur lors de la mise à jour de l'utilisateur");
  }
}

/**
 * Supprime un utilisateur
 */
export async function deleteUser(userId: string) {
  try {
    // Supprimer de Prisma d'abord (à cause des contraintes de clé étrangère)
    await prisma.user.delete({
      where: { id: userId },
    });

    // Puis supprimer de Supabase
    await supabaseAdmin.auth.admin.deleteUser(userId);

    return true;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    throw new AuthError("Erreur lors de la suppression de l'utilisateur");
  }
}
