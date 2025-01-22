-- Activation de RLS pour les tables
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parking_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Création des politiques de lecture
CREATE POLICY "Allow public read for stations"
ON public.stations
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read for services"
ON public.services
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read for parking_details"
ON public.parking_details
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public read for reviews"
ON public.reviews
FOR SELECT
TO public
USING (true);

-- Création d'une vue pour les statistiques
CREATE OR REPLACE VIEW public.view_statistics AS
SELECT
  (SELECT COUNT(*) FROM public.stations WHERE status = 'active') as total_stations,
  (SELECT COUNT(*) FROM auth.users) as total_users,
  (SELECT COUNT(*) FROM public.reviews r
   JOIN public.stations s ON r.station_id = s.id
   WHERE s.status = 'active') as total_reviews;

-- Création d'une vue pour les derniers avis
CREATE OR REPLACE VIEW public.view_recent_reviews AS
SELECT 
  r.content,
  r.rating,
  r.created_at,
  u.raw_user_meta_data->>'name' as author_name
FROM public.reviews r
JOIN public.stations s ON r.station_id = s.id
JOIN auth.users u ON r.author_id = u.id
WHERE s.status = 'active'
ORDER BY r.created_at DESC
LIMIT 2;

-- Création d'une vue pour les dernières stations
CREATE OR REPLACE VIEW public.view_latest_stations AS
SELECT 
  s.id,
  s.name,
  s.address,
  s.latitude,
  s.longitude,
  s.status,
  s.type,
  s.validated_by,
  s.created_at,
  s.updated_at,
  s.author_id,
  s.user_id,
  serv.high_pressure,
  serv.tire_pressure,
  serv.vacuum,
  serv.handicap_access as service_handicap_access,
  serv.waste_water as service_waste_water,
  serv.water_point as service_water_point,
  serv.waste_water_disposal as service_waste_water_disposal,
  serv.black_water_disposal as service_black_water_disposal,
  serv.electricity as service_electricity,
  serv.max_vehicle_length,
  pd.is_payant,
  pd.tarif,
  pd.taxe_sejour,
  pd.has_electricity as parking_electricity,
  pd.commerces_proches,
  pd.handicap_access as parking_handicap_access,
  pd.total_places,
  pd.has_wifi,
  pd.has_charging_point,
  pd.water_point as parking_water_point,
  pd.waste_water as parking_waste_water,
  pd.waste_water_disposal as parking_waste_water_disposal,
  pd.black_water_disposal as parking_black_water_disposal,
  COALESCE(
    (SELECT AVG(r2.rating)::numeric(10,1)
     FROM public.reviews r2
     WHERE r2.station_id = s.id
    ), 0
  ) as average_rating,
  (SELECT COUNT(*)
   FROM public.reviews r3
   WHERE r3.station_id = s.id
  ) as review_count
FROM public.stations s
LEFT JOIN public.services serv ON s.id = serv.station_id
LEFT JOIN public.parking_details pd ON s.id = pd.station_id
WHERE s.status = 'active'
ORDER BY s.created_at DESC
LIMIT 3;

-- Fonction pour obtenir les statistiques
CREATE OR REPLACE FUNCTION public.get_statistics()
RETURNS TABLE (
  total_stations bigint,
  total_users bigint,
  total_reviews bigint,
  recent_reviews json
) 
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    vs.total_stations,
    vs.total_users,
    vs.total_reviews,
    (
      SELECT json_agg(
        json_build_object(
          'userName', COALESCE(SPLIT_PART(vrr.author_name, ' ', 1), 'Anonyme'),
          'rating', vrr.rating,
          'comment', vrr.content,
          'createdAt', vrr.created_at
        )
      )
      FROM public.view_recent_reviews vrr
    ) as recent_reviews
  FROM public.view_statistics vs;
END;
$$;

-- Attribution des permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_statistics TO postgres, anon, authenticated; 