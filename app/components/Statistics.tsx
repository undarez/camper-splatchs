"use client";

import { Card } from "@/app/components/ui/card";

interface StatisticProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const StatisticCard = ({ value, label, icon }: StatisticProps) => (
  <Card className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl transition-all hover:scale-105 hover:shadow-lg">
    <div className="text-blue-500 mb-4 p-4">{icon}</div>
    <div className="text-4xl font-bold text-gray-900 mb-2">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </Card>
);

const CamperIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="text-blue-500 w-8 h-8"
  >
    <path d="M4 11h16v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8z" strokeWidth="2" />
    <path
      d="M4 11V7a2 2 0 012-2h12a2 2 0 012 2v4M8 17h.01M16 17h.01"
      strokeWidth="2"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="text-blue-500 w-8 h-8"
  >
    <path
      d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
      strokeWidth="2"
    />
  </svg>
);

const StarIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="text-blue-500 w-8 h-8"
  >
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      strokeWidth="2"
    />
  </svg>
);

export default function Statistics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 -mt-24 relative z-10">
      <StatisticCard
        value="17+"
        label="Stations référencées"
        icon={<CamperIcon />}
      />
      <StatisticCard
        value="3+"
        label="Utilisateurs actifs"
        icon={<UsersIcon />}
      />
      <StatisticCard value="0+" label="Avis vérifiés" icon={<StarIcon />} />
    </div>
  );
}
