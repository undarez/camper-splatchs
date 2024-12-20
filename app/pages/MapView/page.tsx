import { MapViewComponent } from "./MapViewComponent";

export default async function MapViewPage() {
  // Récupérer les stations depuis l'API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/stations`
  );
  const stations = await response.json();

  return <MapViewComponent stations={stations} />;
}
