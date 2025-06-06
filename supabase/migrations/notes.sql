-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Enable read access for own notes" ON notes;
DROP POLICY IF EXISTS "Enable insert access for own notes" ON notes;
DROP POLICY IF EXISTS "Enable update access for own notes" ON notes;
DROP POLICY IF EXISTS "Enable delete access for own notes" ON notes;

-- Supprimer la table si elle existe
DROP TABLE IF EXISTS notes;

-- Créer la table notes avec email comme user_id
CREATE TABLE notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Changé de UUID à TEXT pour stocker l'email
    date TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Activer RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Créer les index
CREATE INDEX IF NOT EXISTS notes_user_id_idx ON notes(user_id);
CREATE INDEX IF NOT EXISTS notes_date_idx ON notes(date);

-- Accorder les permissions de base
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON notes TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Créer les politiques avec l'email comme identifiant
CREATE POLICY "Enable read access for own notes"
    ON notes FOR SELECT
    USING (auth.jwt()->>'email' = user_id);

CREATE POLICY "Enable insert access for own notes"
    ON notes FOR INSERT
    WITH CHECK (auth.jwt()->>'email' = user_id);

CREATE POLICY "Enable update access for own notes"
    ON notes FOR UPDATE
    USING (auth.jwt()->>'email' = user_id)
    WITH CHECK (auth.jwt()->>'email' = user_id);

CREATE POLICY "Enable delete access for own notes"
    ON notes FOR DELETE
    USING (auth.jwt()->>'email' = user_id);

-- Créer le trigger pour updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_timestamp
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp(); 