"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { StationType } from "@prisma/client";

export default function AddPointModal({
  isOpen,
  onClose,
  formData,
  onFormDataChange,
  onSubmit,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1E2337] border border-gray-700/50 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Ajouter un point d'intérêt
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Type de point */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className={`p-4 rounded-lg border ${
                formData.type === StationType.STATION_LAVAGE
                  ? "bg-blue-500/20 border-blue-500 text-blue-400"
                  : "bg-[#252B43] border-gray-700/50 text-gray-400 hover:bg-[#2A3150]"
              } transition-all`}
              onClick={() =>
                onFormDataChange({ type: StationType.STATION_LAVAGE })
              }
            >
              Station de lavage
            </button>
            <button
              type="button"
              className={`p-4 rounded-lg border ${
                formData.type === StationType.PARKING
                  ? "bg-purple-500/20 border-purple-500 text-purple-400"
                  : "bg-[#252B43] border-gray-700/50 text-gray-400 hover:bg-[#2A3150]"
              } transition-all`}
              onClick={() => onFormDataChange({ type: StationType.PARKING })}
            >
              Parking
            </button>
          </div>

          {/* Informations générales */}
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Nom</Label>
              <Input
                className="bg-[#252B43] border-gray-700/50 text-white mt-1"
                value={formData.name}
                onChange={(e) => onFormDataChange({ name: e.target.value })}
                placeholder="Nom du point d'intérêt"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Ville</Label>
                <Input
                  className="bg-[#252B43] border-gray-700/50 text-white mt-1"
                  value={formData.city}
                  onChange={(e) => onFormDataChange({ city: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-gray-300">Code postal</Label>
                <Input
                  className="bg-[#252B43] border-gray-700/50 text-white mt-1"
                  value={formData.postalCode}
                  onChange={(e) =>
                    onFormDataChange({ postalCode: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Services spécifiques selon le type */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Services disponibles
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {formData.type === StationType.STATION_LAVAGE ? (
                // Services pour station de lavage
                <>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded bg-[#252B43] border-gray-700/50"
                      checked={formData.tirePressure}
                      onChange={(e) =>
                        onFormDataChange({ tirePressure: e.target.checked })
                      }
                    />
                    <span className="text-gray-300">Pression des pneus</span>
                  </label>
                  {/* Ajoutez d'autres services similaires */}
                </>
              ) : (
                // Services pour parking
                <>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded bg-[#252B43] border-gray-700/50"
                      checked={formData.isPayant}
                      onChange={(e) =>
                        onFormDataChange({ isPayant: e.target.checked })
                      }
                    />
                    <span className="text-gray-300">Parking payant</span>
                  </label>
                  {/* Ajoutez d'autres services similaires */}
                </>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-transparent border-gray-700 text-gray-300 hover:bg-[#2A3150]"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Ajouter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
