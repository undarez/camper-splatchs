"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartOptions,
  Scale,
  CoreScaleOptions,
  Tick,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement);

export function AdminDashboard() {
  const bookingData = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
    datasets: [
      {
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const verticalBarOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        type: "linear",
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
          callback: function (
            this: Scale<CoreScaleOptions>,
            tickValue: number | string,
            _index: number,
            _ticks: Tick[]
          ) {
            return tickValue.toString();
          },
        },
      },
      x: {
        type: "category",
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
    },
  };

  return (
    <div className="p-6">
      <div className="h-[300px]">
        <Bar data={bookingData} options={verticalBarOptions} />
      </div>
    </div>
  );
}
