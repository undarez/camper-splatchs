import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    loading: false,
    error: null,
  });

  const getLocation = useCallback(() => {
    console.log("Demande de géolocalisation...");

    if (!navigator.geolocation) {
      console.error("Géolocalisation non supportée");
      toast({
        title: "Erreur",
        description:
          "La géolocalisation n'est pas supportée par votre navigateur",
        variant: "destructive",
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));
    console.log("État de chargement activé");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Position obtenue:", position.coords);
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null,
        });
        toast({
          title: "Succès",
          description: "Votre position a été trouvée",
        });
      },
      (error) => {
        console.error("Erreur de géolocalisation:", error);
        let message = "Une erreur est survenue";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Vous devez autoriser la géolocalisation";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Position non disponible";
            break;
          case error.TIMEOUT:
            message = "La demande de géolocalisation a expiré";
            break;
        }
        setState((prev) => ({
          ...prev,
          loading: false,
          error: message,
        }));
        toast({
          title: "Erreur",
          description: message,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);

  return {
    ...state,
    getLocation,
  };
};
