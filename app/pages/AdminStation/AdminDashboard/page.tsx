"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStations: 0,
    activeStations: 0,
    pendingStations: 0,
    weeklyVisits: 0,
    monthlyVisits: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/AdminStation/StatisqueStation");
        const data = await response.json();
        setStats(data);
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
            <CardTitle>Visites hebdomadaires</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.weeklyVisits}</p>
            <p className="text-xs text-muted-foreground">
              Visites cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visites mensuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.monthlyVisits}</p>
            <p className="text-xs text-muted-foreground">Visites ce mois</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
