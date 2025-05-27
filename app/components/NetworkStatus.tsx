"use client";

import { useEffect, useState } from "react";
import { Network } from "@capacitor/network";

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Vérifiez l'état initial de la connexion
    const checkNetworkStatus = async () => {
      try {
        const status = await Network.getStatus();
        setIsOnline(status.connected);
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de la connexion réseau:",
          error
        );
      }
    };

    checkNetworkStatus();

    // Écouteurs d'événements pour les changements de connectivité
    const networkListener = Network.addListener(
      "networkStatusChange",
      (status) => {
        setIsOnline(status.connected);
      }
    );

    // Support de base pour le web en cas de problème avec Capacitor
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      // Nettoyage
      networkListener.remove();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) {
    return null; // Ne rien afficher quand en ligne
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 m-4 bg-red-500 text-white p-4 rounded-md shadow-lg">
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
          <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
          <line x1="12" y1="20" x2="12.01" y2="20"></line>
        </svg>
        <h3 className="font-bold">Vous êtes hors ligne</h3>
      </div>
      <p className="mt-2">
        Certaines fonctionnalités de l'application pourraient ne pas être
        disponibles. Reconnectez-vous à Internet pour une expérience complète.
      </p>
    </div>
  );
}

export default NetworkStatus;
