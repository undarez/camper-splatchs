"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import Image from "next/image";
import ExportDonnees from "@/app/components/ExportDonnees";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Veuillez vous connecter pour accéder à votre profil</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Mon Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              {session.user?.image && (
                <div className="relative w-24 h-24 rounded-full overflow-hidden">
                  <Image
                    src={session.user.image}
                    alt="Photo de profil"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold">{session.user?.name}</h2>
              <p className="text-gray-600">{session.user?.email}</p>

              <div className="w-full space-y-4 mt-8">
                <Button variant="outline" className="w-full">
                  Modifier mon profil
                </Button>
                <Button variant="destructive" className="w-full">
                  Supprimer mon compte
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section Export des données */}
        <section>
          <h2 className="text-xl font-semibold text-white mb-6">
            Mes données personnelles
          </h2>
          <ExportDonnees />
        </section>
      </div>
    </div>
  );
}
