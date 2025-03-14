-- Script de configuration pour les tables d'éco-lavage dans Supabase

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Tout le monde peut voir les stations" ON public.eco_stations;
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leur propre historique" ON public.eco_wash_history;
DROP POLICY IF EXISTS "Les utilisateurs peuvent ajouter à leur propre historique" ON public.eco_wash_history;

-- Supprimer les tables si elles existent déjà
DROP TABLE IF EXISTS public.eco_wash_history;
DROP TABLE IF EXISTS public.eco_stations;

-- Créer une nouvelle table pour les stations d'éco-lavage
CREATE TABLE public.eco_stations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT,
    status TEXT DEFAULT 'active',
    type TEXT DEFAULT 'STATION_LAVAGE',
    phone_number TEXT,
    description TEXT,
    latitude FLOAT,
    longitude FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer une nouvelle table pour l'historique des lavages éco
CREATE TABLE public.eco_wash_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    station_id TEXT NOT NULL REFERENCES public.eco_stations(id) ON DELETE CASCADE,
    wash_type TEXT NOT NULL,
    vehicle_size TEXT NOT NULL,
    duration INTEGER NOT NULL,
    water_used INTEGER NOT NULL,
    water_saved INTEGER NOT NULL,
    eco_points INTEGER NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS sur les nouvelles tables
ALTER TABLE public.eco_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco_wash_history ENABLE ROW LEVEL SECURITY;

-- Créer des politiques RLS pour les stations
CREATE POLICY "Tout le monde peut voir les stations"
ON public.eco_stations
FOR SELECT
USING (true);

-- Créer des politiques RLS pour l'historique des lavages
CREATE POLICY "Les utilisateurs peuvent voir leur propre historique"
ON public.eco_wash_history
FOR SELECT
USING (auth.uid()::text = user_id);

CREATE POLICY "Les utilisateurs peuvent ajouter à leur propre historique"
ON public.eco_wash_history
FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- Accorder les permissions nécessaires
GRANT ALL ON public.eco_stations TO authenticated;
GRANT ALL ON public.eco_stations TO anon;
GRANT ALL ON public.eco_stations TO service_role;

GRANT ALL ON public.eco_wash_history TO authenticated;
GRANT ALL ON public.eco_wash_history TO anon;
GRANT ALL ON public.eco_wash_history TO service_role;

-- Insérer des stations de test pour l'éco-lavage
INSERT INTO public.eco_stations (id, name, address, city, status, type)
VALUES 
  ('station_01', 'Lavatrans Dunkerque', '4116 Rue DE LOOPERSFORT PORT', 'Craywick', 'active', 'STATION_LAVAGE'),
  ('station_02', 'Lavatrans Lille', '178, rue des Sureaux - P.A.M 59262 SAINGHIN EN MELANTOIS', 'Sainghin en Melantois', 'active', 'STATION_LAVAGE')
ON CONFLICT (id) DO NOTHING; 