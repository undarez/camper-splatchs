"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
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
      }
    };

    fetchStats();
  }, []);

  const activeStationsPercentage =
    (stats.activeStations / stats.totalStations) * 100 || 0;
  const pendingStationsPercentage =
    (stats.pendingStations / stats.totalStations) * 100 || 0;

  const chartData = [
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

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Stations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalStations}</p>
            <p className="text-xs text-muted-foreground">
              Nombre total de stations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stations Actives</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.activeStations}</p>
            <p className="text-xs text-muted-foreground">
              Stations validées et actives
            </p>
            <Progress value={activeStationsPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>En Attente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.pendingStations}</p>
            <p className="text-xs text-muted-foreground">Stations à valider</p>
            <Progress value={pendingStationsPercentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Visites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold">{stats.weeklyVisits}</p>
                <p className="text-xs text-muted-foreground">Cette semaine</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.monthlyVisits}</p>
                <p className="text-xs text-muted-foreground">Ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nouvelles Stations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold">{stats.weeklyStations}</p>
                <p className="text-xs text-muted-foreground">Cette semaine</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.monthlyStations}</p>
                <p className="text-xs text-muted-foreground">Ce mois</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques comparatives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visites" name="Visites" fill="#2563eb" />
                <Bar dataKey="stations" name="Stations" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
