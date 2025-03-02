"use client";

import { Card } from "@/app/components/ui/card";

interface ServiceProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface WashLaneProps {
  laneNumber: number;
  hasHighPressure: boolean;
  hasBusesPortique: boolean;
  hasRollerPortique: boolean;
}

interface StationServiceProps {
  isDelisle?: boolean;
  portiquePrice?: number | null;
  manualWashPrice?: number | null;
  washLanes?: WashLaneProps[];
}

const ServiceCard = ({ title, description, icon }: ServiceProps) => (
  <Card className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl transition-all hover:scale-105 hover:shadow-lg">
    <div className="text-blue-500 mb-4">{icon}</div>
    <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600 text-center">{description}</p>
  </Card>
);

const LocationIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="text-blue-400 w-8 h-8"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeWidth="2" />
    <circle cx="12" cy="10" r="3" strokeWidth="2" />
  </svg>
);

const VerifiedIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="text-blue-400 w-8 h-8"
  >
    <path
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      strokeWidth="2"
    />
  </svg>
);

const TrustIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="text-blue-400 w-8 h-8"
  >
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" />
  </svg>
);

export default function Services() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
      <ServiceCard
        title="Localisation Facile"
        description="Trouvez rapidement les stations près de vous"
        icon={<LocationIcon />}
      />
      <ServiceCard
        title="Stations Vérifiées"
        description="Toutes nos stations sont vérifiées par notre équipe"
        icon={<VerifiedIcon />}
      />
      <ServiceCard
        title="Avis de Confiance"
        description="Des avis authentiques de notre communauté"
        icon={<TrustIcon />}
      />
    </div>
  );
}

export function StationServices({
  isDelisle,
  portiquePrice,
  manualWashPrice,
  washLanes,
}: StationServiceProps) {
  if (!washLanes || washLanes.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-6">
      {isDelisle && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Station Delisle
          </h3>

          {/* Tarifs */}
          <div className="mb-4">
            <h4 className="text-md font-medium text-blue-700 mb-2">Tarifs</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-600">Lavage au portique</p>
                <p className="text-lg font-bold text-blue-600">
                  {portiquePrice || 40}€ HT
                </p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm text-gray-600">10 min lavage manuel</p>
                <p className="text-lg font-bold text-blue-600">
                  {manualWashPrice || 10}€ HT
                </p>
              </div>
            </div>
          </div>

          {/* Pistes de lavage */}
          <div>
            <h4 className="text-md font-medium text-blue-700 mb-2">
              Pistes de lavage ({washLanes.length})
            </h4>
            <div className="space-y-3">
              {washLanes.map((lane, index) => (
                <div key={index} className="bg-white p-3 rounded-md shadow-sm">
                  <h5 className="font-medium text-blue-600 mb-1">
                    Piste {lane.laneNumber}
                  </h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {lane.hasHighPressure && (
                      <li className="flex items-center">
                        <svg
                          className="w-4 h-4 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        Lances HP + Canon à Mousse
                      </li>
                    )}
                    {lane.hasBusesPortique && (
                      <li className="flex items-center">
                        <svg
                          className="w-4 h-4 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        Portique à BUSES
                      </li>
                    )}
                    {lane.hasRollerPortique && (
                      <li className="flex items-center">
                        <svg
                          className="w-4 h-4 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        Portique ROULEAUX
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
