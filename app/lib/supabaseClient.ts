import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Créer une instance du client Supabase
export const createSupabaseClient = () => {
  return createClientComponentClient();
};

// Vérifier si une session Supabase existe
export const getSupabaseSession = async () => {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error(
      "Erreur lors de la récupération de la session Supabase:",
      error
    );
    return null;
  }

  return data.session;
};

// Synchroniser la session NextAuth avec Supabase
export const syncSessionWithSupabase = async (
  email: string | null | undefined,
  password?: string
) => {
  if (!email) return null;

  const supabase = createSupabaseClient();

  try {
    // Tenter de se connecter avec l'email
    // Note: Cette méthode nécessite que l'utilisateur ait un compte Supabase avec un mot de passe
    // Si vous utilisez une autre méthode d'authentification, vous devrez l'adapter
    if (password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erreur lors de la connexion à Supabase:", error);
        return null;
      }

      return data.session;
    } else {
      // Si pas de mot de passe, on peut essayer de créer un lien magique
      // ou utiliser une autre méthode d'authentification selon votre configuration
      console.log(
        "Pas de mot de passe fourni pour la synchronisation Supabase"
      );
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la synchronisation avec Supabase:", error);
    return null;
  }
};

// Déconnexion de Supabase
export const signOutFromSupabase = async () => {
  const supabase = createSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Erreur lors de la déconnexion de Supabase:", error);
    return false;
  }

  return true;
};
