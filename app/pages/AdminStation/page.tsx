"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { StationType, HighPressureType, ElectricityType } from "@prisma/client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Station {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  type: StationType;
  status: string;
  images: string[];
  services?: {
    id: string;
    highPressure: HighPressureType;
    tirePressure: boolean;
    vacuum: boolean;
    handicapAccess: boolean;
    wasteWater: boolean;
    electricity: ElectricityType;
    maxVehicleLength?: string;
  };
  parkingDetails?: {
    id: string;
    isPayant: boolean;
    tarif: number;
    hasElectricity: ElectricityType;
    commercesProches: string[];
    handicapAccess: boolean;
  };
}

const AdminStations = () => {
  const { data: session, status } = useSession();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "daily" | "monthly" | "yearly"
  >("daily");
  const [salesData, setSalesData] = useState({
    labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    datasets: [
      {
        label: "Productivité des stations",
        data: [30, 45, 60, 45, 35, 48, 65],
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Productivité des stations",
        color: "white",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
      },
    },
  };

  const fetchProductivityData = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/AdminStation/StatisqueStation?period=${selectedPeriod}`
      );
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des statistiques");
      const data = await response.json();

      setSalesData((prevData) => ({
        ...prevData,
        labels: data.labels,
        datasets: [
          {
            ...prevData.datasets[0],
            data: data.values,
          },
        ],
      }));
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive",
      });
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchStations();
    fetchProductivityData();
  }, [selectedPeriod, fetchProductivityData]);

  const fetchStations = async () => {
    try {
      const response = await fetch("/api/AdminStation");
      const data = await response.json();
      setStations(data);
    } catch (error) {
      console.error("Erreur lors du chargement des stations", error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des stations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (period: "daily" | "monthly" | "yearly") => {
    setSelectedPeriod(period);
  };

  const handleStatusUpdate = async (stationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/AdminStation/${stationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");

      await fetchStations();
      toast({
        title: "Succès",
        description: "Statut mis à jour avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du statut",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (stationId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette station ?")) return;

    try {
      const response = await fetch(`/api/AdminStation/${stationId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      await fetchStations();
      toast({
        title: "Succès",
        description: "Station supprimée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la station", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la station",
        variant: "destructive",
      });
    }
  };

  if (
    session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
    status === "unauthenticated"
  ) {
    return <div>Accès non autorisé</div>;
  }

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <select className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 w-full sm:w-auto">
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
            <select className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 w-full sm:w-auto">
              <option value="worldwide">Worldwide</option>
              <option value="france">France</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-4 md:p-6 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h2 className="text-lg font-semibold">
                Productivité des stations
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedPeriod === "daily" ? "bg-green-500" : "bg-gray-700"
                  }`}
                  onClick={() => handlePeriodChange("daily")}
                >
                  Détails
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedPeriod === "monthly"
                      ? "bg-green-500"
                      : "bg-gray-700"
                  }`}
                  onClick={() => handlePeriodChange("monthly")}
                >
                  Mensuel
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-sm ${
                    selectedPeriod === "yearly" ? "bg-green-500" : "bg-gray-700"
                  }`}
                  onClick={() => handlePeriodChange("yearly")}
                >
                  Annuel
                </button>
              </div>
            </div>
            <div className="relative h-[300px] w-full">
              <Line data={salesData} options={chartOptions} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg mb-2">Total Stations</h3>
              <p className="text-4xl font-bold">{stations.length}</p>
              <div className="mt-2 text-sm text-gray-400">
                +12% par rapport au mois dernier
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg mb-2">Stations Actives</h3>
              <p className="text-4xl font-bold text-green-500">
                {stations.filter((s) => s.status === "active").length}
              </p>
              <div className="mt-2 text-sm text-green-400">
                +5% cette semaine
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg mb-2">En Attente</h3>
              <p className="text-4xl font-bold text-yellow-500">
                {stations.filter((s) => s.status === "en_attente").length}
              </p>
              <div className="mt-2 text-sm text-yellow-400">
                -2% cette semaine
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg mb-2">Inactives</h3>
              <p className="text-4xl font-bold text-red-500">
                {stations.filter((s) => s.status === "inactive").length}
              </p>
              <div className="mt-2 text-sm text-red-400">+1% cette semaine</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden p-4 md:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold">Liste des stations</h2>
            <Button variant="outline" size="sm">
              Exporter
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-700">
                  <TableHead className="text-gray-300">Nom</TableHead>
                  <TableHead className="text-gray-300">Adresse</TableHead>
                  <TableHead className="text-gray-300">Services</TableHead>
                  <TableHead className="text-gray-300">Statut</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stations.map((station) => (
                  <TableRow
                    key={station.id}
                    className="border-b border-gray-700"
                  >
                    <TableCell className="text-gray-300">
                      {station.name}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {station.address}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {station.type === "STATION_LAVAGE" &&
                          station.services && (
                            <>
                              {station.services.highPressure !== "NONE" && (
                                <Badge variant="outline" className="capitalize">
                                  {station.services.highPressure
                                    .toLowerCase()
                                    .replace(/_/g, " ")}
                                </Badge>
                              )}
                              {station.services.tirePressure && (
                                <Badge variant="outline">Gonflage pneus</Badge>
                              )}
                              {station.services.vacuum && (
                                <Badge variant="outline">Aspirateur</Badge>
                              )}
                              {station.services.wasteWater && (
                                <Badge variant="outline">
                                  Vidange eaux usées
                                </Badge>
                              )}
                            </>
                          )}
                        {station.type === "PARKING" &&
                          station.parkingDetails && (
                            <>
                              {station.parkingDetails.isPayant && (
                                <Badge variant="outline">
                                  Payant ({station.parkingDetails.tarif}€)
                                </Badge>
                              )}
                              {station.parkingDetails.hasElectricity !==
                                "NONE" && (
                                <Badge variant="outline">
                                  {station.parkingDetails.hasElectricity ===
                                  "AMP_8"
                                    ? "8A"
                                    : "15A"}
                                </Badge>
                              )}
                              {station.parkingDetails.commercesProches.map(
                                (commerce) => (
                                  <Badge
                                    key={commerce}
                                    variant="outline"
                                    className="capitalize"
                                  >
                                    {commerce.toLowerCase().replace(/_/g, " ")}
                                  </Badge>
                                )
                              )}
                            </>
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <select
                        className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-300"
                        value={station.status}
                        onChange={(e) =>
                          handleStatusUpdate(station.id, e.target.value)
                        }
                      >
                        <option value="active">Active</option>
                        <option value="en_attente">En attente</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(station.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStations;
