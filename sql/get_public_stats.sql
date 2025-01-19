CREATE OR REPLACE FUNCTION public.get_public_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'total_stations', (SELECT COUNT(*) FROM stations WHERE type = 'STATION_LAVAGE'),
        'total_parkings', (SELECT COUNT(*) FROM stations WHERE type = 'PARKING'),
        'total_users', (SELECT COUNT(*) FROM users),
        'total_reviews', (SELECT COUNT(*) FROM reviews),
        'average_rating', (SELECT COALESCE(AVG(rating), 0) FROM reviews),
        'stations_by_status', (
            SELECT json_object_agg(status, count)
            FROM (
                SELECT status, COUNT(*) as count
                FROM stations
                GROUP BY status
            ) s
        )
    ) INTO result;

    RETURN result;
END;
$$; 