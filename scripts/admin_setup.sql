-- Script SQL pour configurer les utilisateurs administrateurs dans Supabase
-- À exécuter dans l'éditeur SQL de Supabase

-- Définir l'email administrateur (à remplacer par votre email)
DO $$
DECLARE
    admin_email TEXT := 'fortuna77320@gmail.com'; -- Remplacez par votre email d'administrateur
    r RECORD;
BEGIN
    -- Afficher les informations sur l'email administrateur
    RAISE NOTICE 'Configuration de l''administrateur avec l''email: %', admin_email;
    
    -- 1. Récupérer tous les utilisateurs avec leurs sessions
    RAISE NOTICE 'Liste de tous les utilisateurs:';
    FOR r IN 
        SELECT 
            u.id, 
            u.email, 
            u.role, 
            (SELECT COUNT(*) FROM "Session" s WHERE s."userId" = u.id) as session_count,
            u."createdAt"
        FROM "User" u
        ORDER BY u."createdAt" DESC
    LOOP
        RAISE NOTICE 'ID: %, Email: %, Rôle: %, Sessions: %, Créé le: %', 
            r.id, r.email, r.role, r.session_count, r."createdAt";
    END LOOP;
    
    -- 2. Vérifier si l'utilisateur administrateur existe
    IF EXISTS (SELECT 1 FROM "User" WHERE email = admin_email) THEN
        RAISE NOTICE 'L''utilisateur administrateur existe déjà';
        
        -- 3. Mettre à jour le rôle de l'utilisateur administrateur
        UPDATE "User"
        SET role = 'ADMIN'
        WHERE email = admin_email;
        
        RAISE NOTICE 'Rôle mis à jour pour l''utilisateur avec l''email %', admin_email;
        
        -- 4. Supprimer les sessions existantes pour forcer une nouvelle connexion
        DELETE FROM "Session"
        WHERE "userId" = (SELECT id FROM "User" WHERE email = admin_email);
        
        RAISE NOTICE 'Sessions supprimées pour l''utilisateur administrateur';
    ELSE
        RAISE NOTICE 'L''utilisateur administrateur n''existe pas dans la base de données';
    END IF;
    
    -- 5. Vérifier le résultat
    RAISE NOTICE 'État actuel de l''utilisateur administrateur:';
    FOR r IN 
        SELECT 
            u.id, 
            u.email, 
            u.role, 
            (SELECT COUNT(*) FROM "Session" s WHERE s."userId" = u.id) as session_count
        FROM "User" u
        WHERE u.email = admin_email
    LOOP
        RAISE NOTICE 'ID: %, Email: %, Rôle: %, Sessions: %', 
            r.id, r.email, r.role, r.session_count;
    END LOOP;
    
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