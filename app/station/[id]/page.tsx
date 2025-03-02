"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Station } from "@prisma/client";
import Image from "next/image";
import WashLanesCorrected from "@/app/components/WashLanesCorrected";

export default function StationDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [station, setStation] = useState<Station | null>(null);

  useEffect(() => {
    const fetchStation = async () => {
      const response = await fetch(`/api/stations/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setStation(data);
      }
    };
    fetchStation();
  }, [params.id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/stations/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Station supprimée",
          description: "La station a été supprimée avec succès",
        });
        router.push("/");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la station", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la station",
        variant: "destructive",
      });
    }
  };

  if (!station) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
      <div className="bg-[#1E2337] rounded-lg shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-0">
            {station.name}
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <Button
              onClick={() => router.push(`/station/${params.id}/edit`)}
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600"
            >
              Modifier
            </Button>
            <Button
              onClick={() => handleDelete()}
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations générales */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              Informations générales
            </h2>
            <div className="space-y-2">
              <p className="text-gray-300">
                <span className="font-medium">Adresse:</span> {station.address}
              </p>
              <p className="text-gray-300">
                <span className="font-medium">Ville:</span> {station.city}
              </p>
              <p className="text-gray-300">
                <span className="font-medium">Code postal:</span>{" "}
                {station.postalCode}
              </p>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ... services existants ... */}
            </div>
          </div>
        </div>

        {/* Pistes de lavage */}
        <div className="mt-8">
          <WashLanesCorrected stationId={params.id} />
        </div>

        {/* Images */}
        {station.images && station.images.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">Photos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {station.images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden bg-gray-800"
                >
                  <Image
                    src={image}
                    alt={`Vue ${index + 1} de la station`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Carte */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Localisation
          </h2>
          <div className="h-[300px] sm:h-[400px] rounded-lg overflow-hidden">
            {/* ... composant carte ... */}
          </div>
        </div>
      </div>
    </div>
  );
}
