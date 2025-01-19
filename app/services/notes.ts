import { createClient } from "@supabase/supabase-js";
import { Note } from "../types/notes";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Les variables d'environnement Supabase ne sont pas définies"
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

export const notesService = {
  async getNotesByDate(userId: string, date: string): Promise<Note[]> {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .eq("date", date)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des notes:", error);
      throw error;
    }
    return data || [];
  },

  async createNote(
    userId: string,
    date: string,
    content: string
  ): Promise<Note> {
    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          user_id: userId,
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
  },

  async updateNote(noteId: string, content: string): Promise<Note> {
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
  },

  async deleteNote(noteId: string): Promise<void> {
    const { error } = await supabase.from("notes").delete().eq("id", noteId);

    if (error) {
      console.error("Erreur lors de la suppression de la note:", error);
      throw error;
    }
  },
};
