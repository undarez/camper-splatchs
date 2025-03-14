"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/app/components/ui/button";
import { Icons } from "@/app/components/Icons";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";

function AuthForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignIn = async (
    provider: "google" | "facebook" | "instagram"
  ) => {
    try {
      setIsLoading(true);
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Button
          variant="outline"
          onClick={() => handleSignIn("google")}
          disabled={isLoading}
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}
          Google
        </Button>

        <Button
          variant="outline"
          onClick={() => handleSignIn("facebook")}
          disabled={isLoading}
          className="bg-[#1877F2] text-white hover:bg-[#166fe5] hover:text-white"
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.facebook className="mr-2 h-4 w-4" />
          )}
          Facebook
        </Button>

        <Button
          variant="outline"
          onClick={() => handleSignIn("instagram")}
          disabled={isLoading}
          className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white hover:opacity-90"
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.instagram className="mr-2 h-4 w-4" />
          )}
          Instagram
        </Button>
      </div>
    </div>
  );
}

export default function AuthPage() {
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

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Bienvenue sur CamperWash
          </h1>
          <p className="text-sm text-muted-foreground">
            Connectez-vous avec votre compte social
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
