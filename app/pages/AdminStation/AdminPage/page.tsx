"use client";

import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminDashboard from "@/app/pages/AdminStation/AdminDashboard/page";
import PendingStations from "@/app/pages/AdressGeoapify/PendingStations/page";
import { redirect, useRouter } from "next/navigation";
import { Loader2, LayoutDashboard, MapPin, Clock } from "lucide-react";

const AdminPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (
    status === "unauthenticated" ||
    session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL
  ) {
    redirect("/");
  }

  const handleStationsClick = () => {
    router.push("/pages/AdminStation"); // Assurez-vous que ce chemin correspond à votre structure de routes
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Administration</h1>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Tableau de bord</span>
          </TabsTrigger>
          <TabsTrigger
            value="stations"
            className="flex items-center gap-2"
            onClick={handleStationsClick}
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Toutes les stations</span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">En attente</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="rounded-lg border bg-card p-6">
            <AdminDashboard />
          </div>
        </TabsContent>

        <TabsContent value="pending">
          <div className="rounded-lg border bg-card">
            <PendingStations />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
