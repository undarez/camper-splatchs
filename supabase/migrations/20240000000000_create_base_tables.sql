-- Table stations
CREATE TABLE IF NOT EXISTS public.stations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  postal_code TEXT,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'en_attente',
  type TEXT DEFAULT 'STATION_LAVAGE',
  validated_at TIMESTAMP WITH TIME ZONE,
  validated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID REFERENCES auth.users(id),
  user_id UUID REFERENCES auth.users(id)
);

-- Table services
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  high_pressure TEXT DEFAULT 'NONE',
  tire_pressure BOOLEAN DEFAULT false,
  vacuum BOOLEAN DEFAULT false,
  handicap_access BOOLEAN DEFAULT false,
  waste_water BOOLEAN DEFAULT false,
  water_point BOOLEAN DEFAULT false,
  waste_water_disposal BOOLEAN DEFAULT false,
  black_water_disposal BOOLEAN DEFAULT false,
  electricity TEXT DEFAULT 'NONE',
  max_vehicle_length FLOAT,
  station_id UUID UNIQUE REFERENCES public.stations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table parking_details
CREATE TABLE IF NOT EXISTS public.parking_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  is_payant BOOLEAN DEFAULT false,
  tarif FLOAT,
  taxe_sejour FLOAT,
  has_electricity TEXT DEFAULT 'NONE',
  commerces_proches TEXT[],
  handicap_access BOOLEAN DEFAULT false,
  total_places INTEGER DEFAULT 0,
  has_wifi BOOLEAN DEFAULT false,
  has_charging_point BOOLEAN DEFAULT false,
  water_point BOOLEAN DEFAULT false,
  waste_water BOOLEAN DEFAULT false,
  waste_water_disposal BOOLEAN DEFAULT false,
  black_water_disposal BOOLEAN DEFAULT false,
  station_id UUID UNIQUE REFERENCES public.stations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID REFERENCES auth.users(id),
  station_id UUID REFERENCES public.stations(id) ON DELETE CASCADE
); 