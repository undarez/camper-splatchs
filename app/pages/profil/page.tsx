"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import ConnectYou from "@/app/pages/auth/connect-you/page";

const Profil = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Chargement...</div>;
  }

  if (!session) {
    return <ConnectYou />;
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-lg mx-auto shadow-md">
        <CardHeader>
          <CardTitle>Profil utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={session.user?.image || "/images/default-avatar.png"}
                alt="User Avatar"
              />
              <AvatarFallback>
                {session.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="w-full space-y-4">
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={session.user?.name || "Non renseigné"}
                  disabled
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={session.user?.email || "Non renseigné"}
                  disabled
                />
              </div>

              <div>
                <Label htmlFor="department">Département</Label>
                <Input
                  id="department"
                  value={session.user?.department || "Non renseigné"}
                  disabled
                />
              </div>

              <div>
                <Label htmlFor="age">Âge</Label>
                <Input
                  id="age"
                  value={session.user?.age?.toString() || "Non renseigné"}
                  disabled
                />
              </div>

              <div>
                <Label htmlFor="camperModel">Modèle de camping-car</Label>
                <Input
                  id="camperModel"
                  value={session.user?.camperModel || "Non renseigné"}
                  disabled
                />
              </div>

              <div>
                <Label htmlFor="usageFrequency">
                  Fréquence d&apos;utilisation
                </Label>
                <Input
                  id="usageFrequency"
                  value={session.user?.usageFrequency || "Non renseigné"}
                  disabled
                />
              </div>

              <Link href="/pages/profil/editprofil" className="w-full">
                <Button variant="destructive" className="w-full">
                  Modifier le profil
                </Button>
              </Link>

              <Link href="/pages/profil/delete-account" className="w-full">
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700"
                >
                  Supprimer mon compte
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profil;
