"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Line, Bar } from "react-chartjs-2";
import { useRouter } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { LayoutDashboard, MapPin, Clock } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("daily");
  const [salesData, setSalesData] = useState({
    labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
    datasets: [
      {
        label: "Création de stations",
        data: [2, 3, 1, 4, 2, 3, 2],
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  });

  const salesFunnelData = {
    labels: ["1.Demandes", "2.En cours", "3.Validées", "4.Actives"],
    datasets: [
      {
        label: "Progression des stations",
        data: [25, 15, 8, 5],
        backgroundColor: "#FFD700",
        barThickness: 20,
      },
    ],
  };

  const bookingData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août"],
    datasets: [
      {
        label: "Nouvelles stations par mois",
        data: [3, 5, 4, 6, 8, 7, 10, 12],
        backgroundColor: "rgb(75, 192, 192)",
        barThickness: 30,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Création de stations",
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

  const horizontalBarOptions = {
    indexAxis: "y" as const,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
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

  const verticalBarOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
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
          callback: (value: number) => `€${value}K`,
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
    if (!session) return;

    try {
      // Utiliser les données mockées en attendant que l'API soit prête
      const mockData = {
        daily: {
          labels: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
          values: [2, 3, 1, 4, 2, 3, 2],
        },
        weekly: {
          labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
          values: [8, 12, 10, 15],
        },
        monthly: {
          labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
          values: [20, 25, 30, 35, 40, 45],
        },
        yearly: {
          labels: ["2021", "2022", "2023", "2024"],
          values: [100, 150, 200, 250],
        },
      };

      const periodData = mockData[selectedPeriod] || mockData.daily;

      setSalesData((prevData) => ({
        ...prevData,
        labels: periodData.labels,
        datasets: [
          {
            ...prevData.datasets[0],
            data: periodData.values,
          },
        ],
      }));
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      setLoading(false);
    }
  }, [selectedPeriod, session]);

  useEffect(() => {
    fetchProductivityData();
  }, [fetchProductivityData]);

  const handlePeriodChange = (
    period: "daily" | "weekly" | "monthly" | "yearly"
  ) => {
    setSelectedPeriod(period);
  };

  const handleStationsClick = () => {
    router.push("/pages/AdminStation");
  };

  const DashboardContent = () => (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Graphique principal */}
        <div className="bg-gray-800 p-4 md:p-6 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-lg font-semibold">Création de stations</h2>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedPeriod === "daily" ? "bg-green-500" : "bg-gray-700"
                }`}
                onClick={() => handlePeriodChange("daily")}
              >
                Journalier
              </button>
              <button
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedPeriod === "weekly" ? "bg-green-500" : "bg-gray-700"
                }`}
                onClick={() => handlePeriodChange("weekly")}
              >
                Semaine
              </button>
              <button
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedPeriod === "monthly" ? "bg-green-500" : "bg-gray-700"
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

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg mb-2">Total des stations</h3>
            <p className="text-4xl font-bold">55</p>
            <p className="text-sm text-gray-400">+12%</p>
            <p className="text-xs text-gray-500 mt-2">Stations actives</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg mb-2">Services disponibles</h3>
            <p className="text-4xl font-bold text-green-500">89</p>
            <p className="text-sm text-gray-400">+15</p>
            <p className="text-xs text-gray-500 mt-2">
              Points de service totaux
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg mb-2">Taux de validation</h3>
            <p className="text-4xl font-bold text-yellow-500">75%</p>
            <p className="text-sm text-gray-400">+5%</p>
            <p className="text-xs text-gray-500 mt-2">
              Des demandes sont validées
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg mb-2">Croissance</h3>
            <p className="text-4xl font-bold text-blue-500">+8</p>
            <p className="text-sm text-gray-400">Ce mois</p>
            <p className="text-xs text-gray-500 mt-2">Nouvelles stations</p>
          </div>
        </div>
      </div>

      {/* Graphiques supplémentaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-4 md:p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">État des stations</h3>
            <button className="px-3 py-1 bg-blue-500 rounded-md text-sm">
              Voir détails
            </button>
          </div>
          <div className="h-[300px]">
            <Bar data={salesFunnelData} options={horizontalBarOptions} />
          </div>
        </div>
        <div className="bg-gray-800 p-4 md:p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Évolution mensuelle</h3>
            <button className="px-3 py-1 bg-blue-500 rounded-md text-sm">
              2024
            </button>
          </div>
          <div className="h-[300px]">
            <Bar data={bookingData} options={verticalBarOptions} />
          </div>
        </div>
      </div>
    </>
  );

  if (session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return <div>Accès non autorisé</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-8 gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Tableau de bord</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
            <select className="bg-gray-800 border border-gray-700 rounded-md px-2 sm:px-4 py-1 sm:py-2 w-full sm:w-auto text-sm sm:text-base">
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
            <select className="bg-gray-800 border border-gray-700 rounded-md px-2 sm:px-4 py-1 sm:py-2 w-full sm:w-auto text-sm sm:text-base">
              <option value="worldwide">Monde entier</option>
              <option value="france">France</option>
            </select>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto gap-1">
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Tableau de bord</span>
            </TabsTrigger>
            <TabsTrigger
              value="stations"
              className="flex items-center gap-2 text-xs sm:text-sm"
              onClick={handleStationsClick}
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Toutes les stations</span>
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">En attente</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="rounded-lg border border-gray-700 bg-gray-800 p-3 sm:p-4 md:p-6">
              <DashboardContent />
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="rounded-lg border border-gray-700 bg-gray-800 p-3 sm:p-4 md:p-6">
              {/* Le contenu des stations en attente sera chargé via la redirection */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;
