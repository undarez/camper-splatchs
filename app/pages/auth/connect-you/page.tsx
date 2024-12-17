"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { LockIcon } from "lucide-react";
import { AuthForm } from "@/app/components/AuthForm";

export default function ConnectYou() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <LockIcon className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Accès Restreint
          </h1>
          <p className="text-sm text-muted-foreground">
            Veuillez vous connecter pour accéder à cette page
          </p>
        </CardHeader>
        <CardContent>
          <AuthForm />
        </CardContent>
      </Card>
    </div>
  );
}
