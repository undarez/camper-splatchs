-- Fonction pour créer la table stations si elle n'existe pas
CREATE OR REPLACE FUNCTION create_stations_table()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'stations') THEN
    CREATE TABLE stations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      latitude DOUBLE PRECISION NOT NULL,
      longitude DOUBLE PRECISION NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      description TEXT,
      averageRating DOUBLE PRECISION,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Trigger pour mettre à jour updated_at
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON stations
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer la table station_equipments si elle n'existe pas
CREATE OR REPLACE FUNCTION create_station_equipments_table()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'station_equipments') THEN
    CREATE TABLE station_equipments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(station_id, name)
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer la table opening_hours si elle n'existe pas
CREATE OR REPLACE FUNCTION create_opening_hours_table()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'opening_hours') THEN
    CREATE TABLE opening_hours (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
      day TEXT NOT NULL,
      open_time TEXT NOT NULL,
      close_time TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(station_id, day)
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer la table pricing si elle n'existe pas
CREATE OR REPLACE FUNCTION create_pricing_table()
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'pricing') THEN
    CREATE TABLE pricing (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
      service_type TEXT NOT NULL,
      price TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(station_id, service_type)
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour le trigger updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql; 