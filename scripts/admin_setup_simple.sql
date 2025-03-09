-- Script SQL simplifié pour configurer les utilisateurs administrateurs dans Supabase
-- À exécuter dans l'éditeur SQL de Supabase

-- Définir l'email administrateur (à remplacer par votre email)
DO $$
DECLARE
    admin_email TEXT := 'fortuna77320@gmail.com'; -- Remplacez par votre email d'administrateur
    user_id UUID;
    user_role TEXT;
    session_count INTEGER;
BEGIN
    -- Afficher les informations sur l'email administrateur
    RAISE NOTICE 'Configuration de l''administrateur avec l''email: %', admin_email;
    
    -- 1. Afficher la liste des utilisateurs (limité à 10 pour éviter de surcharger les logs)
    RAISE NOTICE 'Liste des utilisateurs récents:';
    
    -- Cette requête affiche les utilisateurs mais n'est pas utilisée dans une boucle
    SELECT COUNT(*) INTO session_count FROM "User";
    RAISE NOTICE 'Nombre total d''utilisateurs: %', session_count;
    
    -- 2. Vérifier si l'utilisateur administrateur existe
    SELECT id, role INTO user_id, user_role FROM "User" WHERE email = admin_email;
    
    IF user_id IS NOT NULL THEN
        RAISE NOTICE 'Utilisateur trouvé - ID: %, Email: %, Rôle actuel: %', 
            user_id, admin_email, user_role;
        
        -- 3. Mettre à jour le rôle de l'utilisateur administrateur
        UPDATE "User"
        SET role = 'ADMIN'
        WHERE email = admin_email;
        
        RAISE NOTICE 'Rôle mis à jour pour l''utilisateur avec l''email %', admin_email;
        
        -- 4. Compter les sessions existantes
        SELECT COUNT(*) INTO session_count FROM "Session" WHERE "userId" = user_id;
        RAISE NOTICE 'Sessions trouvées: %', session_count;
        
        -- 5. Supprimer les sessions existantes pour forcer une nouvelle connexion
        DELETE FROM "Session"
        WHERE "userId" = user_id;
        
        RAISE NOTICE 'Sessions supprimées pour l''utilisateur administrateur';
    ELSE
        RAISE NOTICE 'L''utilisateur administrateur n''existe pas dans la base de données';
    END IF;
    
END $$;

-- Requête pour vérifier tous les utilisateurs avec le rôle ADMIN
SELECT id, email, role, "createdAt"
FROM "User"
WHERE role = 'ADMIN'
ORDER BY "createdAt" DESC;

-- Requête pour vérifier les sessions actives
SELECT 
    s.id as session_id,
    u.email,
    u.role,
    s.expires
FROM "Session" s
JOIN "User" u ON s."userId" = u.id
WHERE s.expires > NOW()
ORDER BY s.expires DESC; 