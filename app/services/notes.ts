import { createClient } from "@supabase/supabase-js";
import { Note } from "../types/notes";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Les variables d'environnement Supabase ne sont pas définies"
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

class NotesService {
  private async getAuthenticatedClient() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      console.error("Erreur lors de la récupération de la session:", error);
      throw error;
    }
    return { supabase, session };
  }

  async getNotesByDate(userEmail: string, date: string): Promise<Note[]> {
    console.log("getNotesByDate - Paramètres:", { userEmail, date });
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userEmail)
        .eq("date", date)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(
          "Erreur Supabase lors de la récupération des notes:",
          error
        );
        throw error;
      }
      console.log("Notes récupérées avec succès:", data);
      return data || [];
    } catch (error) {
      console.error("Exception lors de la récupération des notes:", error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle note pour un utilisateur
   * @param userEmail - L'email de l'utilisateur
   * @param date - La date au format YYYY-MM-DD
   * @param content - Le contenu de la note
   */
  async createNote(
    userEmail: string,
    date: string,
    content: string
  ): Promise<Note> {
    console.log("createNote - Paramètres:", { userEmail, date, content });
    try {
      const newNote = {
        user_id: userEmail,
        date,
        content,
      };
      console.log("Tentative d'insertion de la note:", newNote);

      const { data, error } = await supabase
        .from("notes")
        .insert([newNote])
        .select()
        .single();

      if (error) {
        console.error("Erreur Supabase lors de la création de la note:", error);
        throw error;
      }
      console.log("Note créée avec succès:", data);
      return data;
    } catch (error) {
      console.error("Exception lors de la création de la note:", error);
      throw error;
    }
  }

  /**
   * Met à jour une note existante
   * @param noteId - L'identifiant de la note
   * @param content - Le nouveau contenu de la note
   */
  async updateNote(noteId: string, content: string): Promise<Note> {
    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        console.error(
          "Erreur lors de la récupération de la session:",
          sessionError
        );
        throw sessionError;
      }

      if (!sessionData.session) {
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: window.location.origin,
          },
        });
        throw new Error("Utilisateur non authentifié");
      }

      const { data, error } = await supabase
        .from("notes")
        .update({ content })
        .eq("id", noteId)
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la mise à jour de la note:", error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la note:", error);
      throw error;
    }
  }

  /**
   * Supprime une note
   * @param noteId - L'identifiant de la note
   */
  async deleteNote(noteId: string): Promise<void> {
    console.log("deleteNote - Paramètre noteId:", noteId);
    try {
      const { error } = await supabase.from("notes").delete().eq("id", noteId);

      if (error) {
        console.error(
          "Erreur Supabase lors de la suppression de la note:",
          error
        );
        throw error;
      }
      console.log("Note supprimée avec succès");
    } catch (error) {
      console.error("Exception lors de la suppression de la note:", error);
      throw error;
    }
  }
}

export const notesService = new NotesService();
