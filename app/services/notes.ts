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
  /**
   * Récupère les notes pour un utilisateur et une date donnée
   * @param userEmail - L'email de l'utilisateur (utilisé comme identifiant)
   * @param date - La date au format YYYY-MM-DD
   */
  async getNotesByDate(userEmail: string, date: string): Promise<Note[]> {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userEmail)
        .eq("date", date)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur lors de la récupération des notes:", error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des notes:", error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle note pour un utilisateur
   * @param userEmail - L'email de l'utilisateur (utilisé comme identifiant)
   * @param date - La date au format YYYY-MM-DD
   * @param content - Le contenu de la note
   */
  async createNote(
    userEmail: string,
    date: string,
    content: string
  ): Promise<Note> {
    try {
      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            user_id: userEmail,
            date,
            content,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Erreur lors de la création de la note:", error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Erreur lors de la création de la note:", error);
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
    try {
      const { error } = await supabase.from("notes").delete().eq("id", noteId);

      if (error) {
        console.error("Erreur lors de la suppression de la note:", error);
        throw error;
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la note:", error);
      throw error;
    }
  }
}

export const notesService = new NotesService();
