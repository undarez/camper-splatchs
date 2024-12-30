"use client";

import { Card } from "@/app/components/ui/card";

interface ServiceProps {
  title: string;
  description: string;
  icon: React.ReactNode;
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
