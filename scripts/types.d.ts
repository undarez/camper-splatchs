interface OpeningHours {
  open: string;
  close: string;
}

interface Station {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: string;
  status: string;
  description: string;
  equipments: string[];
  openingHours: {
    [key: string]: OpeningHours;
  };
  pricing: {
    [key: string]: string;
  };
  averageRating: number;
  images: string[];
  reviews: Array<{
    id: string;
    content: string;
    rating: number;
    userId: string;
    createdAt: string;
  }>;
}

interface StationsData {
  stations: Station[];
}

declare module "*.json" {
  const value: StationsData;
  export default value;
}
