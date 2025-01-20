"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Calendar } from "@/app/components/ui/calendar";
import { Card } from "@/app/components/ui/card";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import { notesService } from "@/app/services/notes";
import { Note } from "@/app/types/notes";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Déterminer l'URL de redirection en fonction de l'environnement
const redirectUrl =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.host}`
    : process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000";

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Synchroniser l'authentification avec Supabase
  useEffect(() => {
    const syncSupabaseAuth = async () => {
      if (!session?.user?.email) return;

      try {
        const {
          data: { session: supaSession },
        } = await supabase.auth.getSession();

        if (supaSession?.user) {
          await notesService.getNotesByDate(
            session.user.email,
            format(new Date(), "yyyy-MM-dd")
          );
          return;
        }

        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
            redirectTo: `${redirectUrl}/auth/callback`,
          },
        });

        if (error) {
          console.error("Erreur d'authentification:", error);
          toast.error("Erreur de synchronisation avec la base de données");
          return;
        }

        // Rediriger vers l'URL de Google si disponible
        if (data?.url) {
          window.location.href = data.url;
          return;
        }

        // Si pas de redirection, attendre la session
        const {
          data: { session: newSession },
        } = await supabase.auth.getSession();

        if (newSession?.user) {
          await notesService.getNotesByDate(
            session.user.email,
            format(new Date(), "yyyy-MM-dd")
          );
        }
      } catch (error) {
        console.error("Erreur de synchronisation:", error);
        toast.error("Erreur de synchronisation avec la base de données");
      }
    };

    if (status === "authenticated") {
      syncSupabaseAuth();
    }
  }, [session, status]);

  const fetchNotes = useCallback(async () => {
    if (!session?.user?.email) return;
    try {
      const fetchedNotes = await notesService.getNotesByDate(
        session.user.email,
        format(date, "yyyy-MM-dd")
      );
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Erreur lors de la récupération des notes:", error);
      toast.error("Impossible de charger les notes");
    }
  }, [session?.user?.email, date]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchNotes();
    }
  }, [fetchNotes, status]);

  const handleSaveNote = async () => {
    if (!currentNote.trim() || !session?.user?.email) {
      toast.error("Veuillez d'abord écrire une note");
      return;
    }

    setIsLoading(true);
    try {
      await notesService.createNote(
        session.user.email,
        format(date, "yyyy-MM-dd"),
        currentNote.trim()
      );
      setCurrentNote("");
      await fetchNotes();
      toast.success("Note enregistrée avec succès");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la note:", error);
      toast.error("Impossible d'enregistrer la note");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await notesService.deleteNote(noteId);
      await fetchNotes();
      toast.success("Note supprimée avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de la note:", error);
      toast.error("Impossible de supprimer la note");
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#1E2337] py-12 px-4 flex items-center justify-center">
        <Card className="p-6 bg-[#1a1f37] border-gray-700/50">
          <p className="text-white text-center">
            Veuillez vous connecter pour accéder à votre calendrier
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E2337] py-4 sm:py-12 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-8 text-center bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">
          Mon Calendrier d'Entretien
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-8">
          <Card className="p-2 sm:p-6 bg-[#1a1f37] border-gray-700/50">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="text-white mx-auto max-w-full"
              locale={fr}
              classNames={{
                month: "text-center text-sm sm:text-base",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button:
                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                  "text-slate-500 rounded-md w-8 sm:w-9 font-normal text-[0.8rem] sm:text-sm",
                row: "flex w-full mt-2",
                cell: "text-center text-sm sm:text-base p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 h-8 sm:h-9 w-8 sm:w-9",
                day: "h-8 sm:h-9 w-8 sm:w-9 p-0 font-normal aria-selected:opacity-100",
                day_selected:
                  "bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600 focus:text-white",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "opacity-50",
                day_disabled: "opacity-50",
                day_range_middle:
                  "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </Card>

          <Card className="p-3 sm:p-6 bg-[#1a1f37] border-gray-700/50">
            <Tabs defaultValue="notes" className="w-full">
              <TabsList className="flex w-full gap-1 rounded-lg p-1 bg-[#1E2337]/50">
                <TabsTrigger
                  value="notes"
                  className="flex-1 rounded-md px-2 py-1.5 text-xs font-medium text-white hover:bg-blue-600/50 data-[state=active]:bg-blue-600"
                >
                  Notes du Jour
                </TabsTrigger>
                <TabsTrigger
                  value="add"
                  className="flex-1 rounded-md px-2 py-1.5 text-xs font-medium text-white hover:bg-blue-600/50 data-[state=active]:bg-blue-600"
                >
                  Ajouter une Note
                </TabsTrigger>
              </TabsList>

              <TabsContent value="notes" className="mt-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-white">
                    Notes pour le {format(date, "d MMMM yyyy", { locale: fr })}
                  </h3>
                  {notes.length > 0 ? (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {notes.map((note) => (
                        <Card
                          key={note.id}
                          className="p-2 bg-[#1E2337] border-gray-700/50 relative group"
                        >
                          <p className="text-gray-300 pr-6 text-xs">
                            {note.content}
                          </p>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                            title="Supprimer la note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-xs py-2">
                      Aucune note pour cette date
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="add" className="mt-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-white">
                    Ajouter une note pour le{" "}
                    {format(date, "d MMMM yyyy", { locale: fr })}
                  </h3>
                  <Textarea
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    placeholder="Écrivez votre note ici..."
                    className="min-h-[100px] bg-[#1E2337] border-gray-700/50 text-white text-xs p-2"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSaveNote}
                    disabled={isLoading || !currentNote.trim()}
                    className="w-full py-1.5 px-2 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                  >
                    {isLoading ? "Enregistrement..." : "Enregistrer la note"}
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
