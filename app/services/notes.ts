import { createClient } from "@supabase/supabase-js";
import { Note } from "../types/notes";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export const notesService = {
  async getNotesByDate(userId: string, date: string): Promise<Note[]> {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .eq("date", date)
      .order("created_at", { ascending: false });

    if (error) throw error;
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

    if (error) throw error;
    return data;
  },

  async updateNote(noteId: string, content: string): Promise<Note> {
    const { data, error } = await supabase
      .from("notes")
      .update({ content })
      .eq("id", noteId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteNote(noteId: string): Promise<void> {
    const { error } = await supabase.from("notes").delete().eq("id", noteId);

    if (error) throw error;
  },
};
