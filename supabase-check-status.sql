-- Script pour vérifier l'état actuel des tables et des politiques dans Supabase

-- Vérifier les tables existantes
SELECT table_name, table_schema
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Vérifier si RLS est activé pour les tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('eco_stations', 'eco_wash_history');

-- Vérifier les politiques existantes
SELECT tablename, policyname, permissive, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('eco_stations', 'eco_wash_history');

-- Vérifier les permissions accordées
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
AND table_name IN ('eco_stations', 'eco_wash_history')
ORDER BY grantee, table_name, privilege_type; 