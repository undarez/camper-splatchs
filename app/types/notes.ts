export interface Note {
  /** Identifiant unique de la note */
  id: string;
  /** Email de l'utilisateur (utilisé comme identifiant) */
  user_id: string;
  /** Date au format YYYY-MM-DD */
  date: string;
  /** Contenu de la note */
  content: string;
  /** Date de création */
  created_at: string;
  /** Date de dernière modification */
  updated_at: string;
}
