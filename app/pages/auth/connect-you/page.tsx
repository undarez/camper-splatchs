"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { LockIcon } from "lucide-react";

export default function ConnectYou() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/signin");
  };

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
        <CardContent className="flex justify-center">
          <Button onClick={handleSignIn} className="w-full max-w-xs" size="lg">
            Se connecter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
