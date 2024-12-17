"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Review {
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Statistics {
  stations: number;
  users: number;
  reviews: number;
}

export function Statistics() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/statistics");
        const data = await response.json();
        setStats(data.statistics);
        setReviews(data.recentReviews);
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
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 border-2 border-[#A5E9FF] hover:border-[#FFD700]">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Image
                src="/images/van-icon.svg"
                alt="Stations"
                width={30}
                height={30}
                className="w-8 h-8"
              />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-center mb-2 text-blue-600">
            {stats?.stations}+
          </h3>
          <Link href="/pages/StationCard">
            <p className="text-gray-600 text-center">Stations référencées</p>
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 border-2 border-[#A5E9FF] hover:border-[#FFD700]">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Image
                src="/images/users-icon.svg"
                alt="Utilisateurs"
                width={30}
                height={30}
                className="w-8 h-8"
              />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-center mb-2 text-blue-600">
            {stats?.users}+
          </h3>
          <p className="text-gray-600 text-center">Utilisateurs actifs</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 border-2 border-[#A5E9FF] hover:border-[#FFD700]">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Image
                src="/images/star-icon.svg"
                alt="Avis"
                width={30}
                height={30}
                className="w-8 h-8"
              />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-center mb-2 text-blue-600">
            {stats?.reviews}+
          </h3>
          <p className="text-gray-600 text-center">Avis vérifiés</p>
        </div>
      </div>

      {reviews && reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Derniers Avis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 border-2 border-[#A5E9FF] hover:border-[#FFD700]"
              >
                <div className="flex items-center mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">{review.userName}</h3>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">
                          {i < review.rating ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
