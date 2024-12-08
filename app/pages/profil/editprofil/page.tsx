"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const EditProfilePage = () => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    department: session?.user?.department || "",
    age: session?.user?.age || "",
    camperModel: session?.user?.camperModel || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age as string) || null,
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour");

      const updatedData = await response.json();

      // Mise à jour de la session avec les nouvelles données
      await update({
        ...session,
        user: {
          ...session?.user,
          ...updatedData,
        },
      });

      toast.success("Profil mis à jour avec succès");
      window.location.href = "/pages/profil";
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil", error);
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Modifier le profil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="department">Département</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="age">Âge</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="camperModel">Modèle de camping-car</Label>
              <Input
                id="camperModel"
                name="camperModel"
                value={formData.camperModel}
                onChange={handleChange}
              />
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="flex-1">
                Enregistrer
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfilePage;
