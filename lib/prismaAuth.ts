import prisma from "./prisma";
import { hash, compare } from "bcrypt";
import { User } from "@prisma/client";

// Types
export type SignUpData = {
  email: string;
  password: string;
  name: string;
};

export type SignInData = {
  email: string;
  password: string;
};

// Classe d'erreur personnalisée
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Vérifie si un email existe déjà dans la base de données
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    console.log("Vérification si l'email existe déjà:", email);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    return !!user;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'email:", error);
    // En cas d'erreur, on suppose que l'email n'existe pas pour éviter de bloquer l'inscription
    return false;
  }
}

/**
 * Crée un nouvel utilisateur dans la base de données
 */
export async function createUser(userData: SignUpData): Promise<User> {
  try {
    // 1. Vérifier si l'email existe déjà
    const emailExists = await checkEmailExists(userData.email);
    if (emailExists) {
      throw new AuthError("Cette adresse email est déjà utilisée");
    }

    // 2. Hasher le mot de passe
    const hashedPassword = await hash(userData.password, 10);

    // 3. Créer l'utilisateur dans Prisma
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        hashedPassword,
        role: "USER",
      },
    });

    // 4. Retourner l'utilisateur sans le mot de passe
    const { hashedPassword: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
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
    // 1. Trouver l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    // 2. Vérifier si l'utilisateur existe
    if (!user || !user.hashedPassword) {
      throw new AuthError("Email ou mot de passe incorrect");
    }

    // 3. Vérifier le mot de passe
    const passwordMatch = await compare(
      credentials.password,
      user.hashedPassword
    );
    if (!passwordMatch) {
      throw new AuthError("Email ou mot de passe incorrect");
    }

    // 4. Retourner l'utilisateur sans le mot de passe
    const { hashedPassword: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    console.error("Erreur lors de la connexion:", error);
    throw new AuthError("Erreur lors de la connexion");
  }
}
