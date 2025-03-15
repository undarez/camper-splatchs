-- Script pour mettre à jour les politiques RLS dans Supabase

-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Tout le monde peut voir les stations" ON public.eco_stations;
DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leur propre historique" ON public.eco_wash_history;
DROP POLICY IF EXISTS "Les utilisateurs peuvent ajouter à leur propre historique" ON public.eco_wash_history;
DROP POLICY IF EXISTS "Tout le monde peut ajouter des stations" ON public.eco_stations;
DROP POLICY IF EXISTS "Tout le monde peut modifier des stations" ON public.eco_stations;
DROP POLICY IF EXISTS "Tout le monde peut ajouter à l'historique" ON public.eco_wash_history;
DROP POLICY IF EXISTS "Tout le monde peut voir l'historique" ON public.eco_wash_history;
DROP POLICY IF EXISTS "Tout le monde peut modifier l'historique" ON public.eco_wash_history;

-- Activer RLS sur les tables
ALTER TABLE public.eco_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco_wash_history ENABLE ROW LEVEL SECURITY;

-- Créer des politiques très permissives pour les stations
CREATE POLICY "Accès public aux stations"
ON public.eco_stations
FOR ALL
USING (true)
WITH CHECK (true);

-- Créer des politiques très permissives pour l'historique des lavages
CREATE POLICY "Accès public à l'historique"
ON public.eco_wash_history
FOR ALL
USING (true)
WITH CHECK (true);

-- Accorder les permissions nécessaires
GRANT ALL ON public.eco_stations TO authenticated;
GRANT ALL ON public.eco_stations TO anon;
GRANT ALL ON public.eco_stations TO service_role;

GRANT ALL ON public.eco_wash_history TO authenticated;
GRANT ALL ON public.eco_wash_history TO anon;
GRANT ALL ON public.eco_wash_history TO service_role;

-- Vérifier les politiques mises à jour
SELECT tablename, policyname, permissive, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('eco_stations', 'eco_wash_history'); 