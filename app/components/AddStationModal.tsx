"use client";

import { useState } from "react";
import GoogleAdsense from "./GoogleAdsense";

interface StationData {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface AddStationModalProps {
  onClose: () => void;
  onSubmit: (data: StationData) => void;
}

export default function AddStationModal({
  onClose,
  onSubmit,
}: AddStationModalProps) {
  const [showAd, setShowAd] = useState(false);
  const [formData, setFormData] = useState<StationData>({
    name: "",
    address: "",
    latitude: 0,
    longitude: 0,
  });

  const handleSubmit = () => {
    onSubmit(formData);
    setShowAd(true);
  };

  if (showAd) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              Station ajoutée avec succès!
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Merci de votre contribution.
            </p>
            <GoogleAdsense
              slot="4467963311"
              style={{ display: "block", textAlign: "center" }}
              format="auto"
              responsive={true}
            />
          </div>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nom de la station"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Adresse"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          {/* Ajoutez d'autres champs selon vos besoins */}
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
