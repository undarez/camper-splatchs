-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table pour l'historique des lavages
CREATE TABLE IF NOT EXISTS public.wash_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    station_id UUID REFERENCES public.stations(id) ON DELETE SET NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    wash_type TEXT NOT NULL,
    vehicle_size TEXT NOT NULL,
    duration INTEGER NOT NULL,
    water_used INTEGER NOT NULL,
    water_saved INTEGER NOT NULL,
    eco_points INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les badges des utilisateurs
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id TEXT NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

-- Ajouter la colonne total_eco_points à la table auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS total_eco_points INTEGER DEFAULT 0;

-- Activer RLS
ALTER TABLE public.wash_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité pour wash_history
CREATE POLICY "Users can view their own wash history"
    ON public.wash_history
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wash history"
    ON public.wash_history
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Politiques de sécurité pour user_badges
CREATE POLICY "Users can view their own badges"
    ON public.user_badges
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own badges"
    ON public.user_badges
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS wash_history_user_id_idx ON public.wash_history(user_id);
CREATE INDEX IF NOT EXISTS wash_history_station_id_idx ON public.wash_history(station_id);
CREATE INDEX IF NOT EXISTS wash_history_date_idx ON public.wash_history(date);
CREATE INDEX IF NOT EXISTS user_badges_user_id_idx ON public.user_badges(user_id);

-- Fonction pour mettre à jour le timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour wash_history
CREATE TRIGGER update_wash_history_updated_at
    BEFORE UPDATE ON public.wash_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 