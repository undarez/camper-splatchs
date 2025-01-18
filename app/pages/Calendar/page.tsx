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

export default function CalendarPage() {
  const { data: session } = useSession();
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    fetchNotes();
  }, [fetchNotes]);

  const handleSaveNote = async () => {
    if (!currentNote.trim() || !session?.user?.email) return;

    setIsLoading(true);
    try {
      await notesService.createNote(
        session.user.email,
        format(date, "yyyy-MM-dd"),
        currentNote.trim()
      );
      setCurrentNote("");
      fetchNotes();
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
      fetchNotes();
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
    <div className="min-h-screen bg-[#1E2337] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-teal-400 to-cyan-500 text-transparent bg-clip-text">
          Mon Calendrier d'Entretien
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 bg-[#1a1f37] border-gray-700/50">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="text-white"
              locale={fr}
            />
          </Card>

          <Card className="p-6 bg-[#1a1f37] border-gray-700/50">
            <Tabs defaultValue="notes" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="notes">Notes du Jour</TabsTrigger>
                <TabsTrigger value="add">Ajouter une Note</TabsTrigger>
              </TabsList>

              <TabsContent value="notes">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Notes pour le {format(date, "d MMMM yyyy", { locale: fr })}
                  </h3>
                  {notes.length > 0 ? (
                    notes.map((note) => (
                      <Card
                        key={note.id}
                        className="p-4 bg-[#1E2337] border-gray-700/50 relative group"
                      >
                        <p className="text-gray-300 pr-8">{note.content}</p>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Supprimer la note"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </Card>
                    ))
                  ) : (
                    <p className="text-gray-400">Aucune note pour cette date</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="add">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Ajouter une note pour le{" "}
                    {format(date, "d MMMM yyyy", { locale: fr })}
                  </h3>
                  <Textarea
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    placeholder="Écrivez votre note ici..."
                    className="min-h-[200px] bg-[#1E2337] border-gray-700/50 text-white"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSaveNote}
                    disabled={isLoading}
                    className="w-full py-2 px-4 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
