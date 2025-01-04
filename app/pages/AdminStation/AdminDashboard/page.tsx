"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";

interface ChartData {
  name: string;
  visites: number;
  stations: number;
}

interface TooltipData {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    color: string;
  }[];
  label?: string;
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStations: 0,
    activeStations: 0,
    pendingStations: 0,
    weeklyVisits: 0,
    monthlyVisits: 0,
    weeklyStations: 0,
    monthlyStations: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsResponse, trackingResponse] = await Promise.all([
          fetch("/api/AdminStation/StatisqueStation"),
          fetch("/api/tracking"),
        ]);

        const statsData = await statsResponse.json();
        const trackingData = await trackingResponse.json();

        setStats({
          ...statsData,
          ...trackingData,
        });
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des statistiques:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  const activeStationsPercentage =
    (stats.activeStations / stats.totalStations) * 100 || 0;
  const pendingStationsPercentage =
    (stats.pendingStations / stats.totalStations) * 100 || 0;

  const chartData: ChartData[] = [
    {
      name: "Cette semaine",
      visites: stats.weeklyVisits,
      stations: stats.weeklyStations,
    },
    {
      name: "Ce mois",
      visites: stats.monthlyVisits,
      stations: stats.monthlyStations,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: TooltipData) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-6 p-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-700">
              Total Stations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <p className="text-3xl font-bold text-blue-600">
                {stats.totalStations}
              </p>
              <p className="text-sm text-gray-500">Nombre total de stations</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-700">
              Stations Actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <p className="text-3xl font-bold text-green-600">
                {stats.activeStations}
              </p>
              <p className="text-sm text-gray-500">
                Stations validées et actives
              </p>
              <div className="mt-4">
                <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${activeStationsPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {activeStationsPercentage.toFixed(1)}% du total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-700">
              En Attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <p className="text-3xl font-bold text-yellow-600">
                {stats.pendingStations}
              </p>
              <p className="text-sm text-gray-500">Stations à valider</p>
              <div className="mt-4">
                <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 transition-all"
                    style={{ width: `${pendingStationsPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {pendingStationsPercentage.toFixed(1)}% du total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">
              Visites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="visitesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="visites"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#visitesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.weeklyVisits}
                </p>
                <p className="text-sm text-gray-500">Cette semaine</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.monthlyVisits}
                </p>
                <p className="text-sm text-gray-500">Ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">
              Nouvelles Stations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="stationsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="stations"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#stationsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {stats.weeklyStations}
                </p>
                <p className="text-sm text-gray-500">Cette semaine</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {stats.monthlyStations}
                </p>
                <p className="text-sm text-gray-500">Ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
