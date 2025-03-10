"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/app/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { Input } from "@/app/components/ui/input";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  console.log("AuthForm: Rendu du composant");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("AuthForm: Soumission du formulaire");
    setIsLoading(true);
    try {
      // Désactiver le mode invité avant la connexion
      console.log("AuthForm: Désactivation du mode invité");
      localStorage.removeItem("guest-mode");

      console.log("AuthForm: Tentative de connexion avec credentials");
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      console.log("AuthForm: Résultat de la connexion:", result);

      if (result?.error) {
        console.log("AuthForm: Erreur de connexion:", result.error);
        toast({
          title: "Erreur",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
      } else if (result?.ok) {
        // Désactiver explicitement le mode invité après une connexion réussie
        console.log(
          "AuthForm: Connexion réussie, désactivation du mode invité"
        );
        localStorage.removeItem("guest-mode");

        toast({
          title: "Succès",
          description: "Connexion réussie",
        });
        console.log("AuthForm: Redirection vers la page d'accueil");
        router.push("/");
        console.log("AuthForm: Rechargement de la page prévu dans 100ms");
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    } catch (error) {
      console.error("AuthForm: Erreur de connexion:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    console.log("AuthForm: Tentative de connexion avec Google");
    setIsLoading(true);
    try {
      // Désactiver le mode invité avant la connexion avec Google
      console.log("AuthForm: Désactivation du mode invité");
      localStorage.removeItem("guest-mode");

      console.log("AuthForm: Redirection vers l'authentification Google");
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("AuthForm: Erreur de connexion Google:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion avec Google",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Button
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="flex items-center gap-3 w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 hover:border-gray-400 transition-all py-6"
      >
        <Image
          src="/images/google.svg"
          alt="Google"
          width={20}
          height={20}
          className="w-5 h-5"
        />
        <span className="flex-1 text-center">
          {isLoading ? "Connexion..." : "Continuer avec Google"}
        </span>
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#252B43] px-2 text-muted-foreground">
            Ou continuez avec
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Adresse e-mail</FormLabel>
                <FormControl>
                  <Input
                    placeholder="exemple@email.com"
                    {...field}
                    className="bg-[#1E2337] border-gray-700 text-white placeholder-gray-500"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Mot de passe</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    className="bg-[#1E2337] border-gray-700 text-white placeholder-gray-500"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </Form>

      <div className="space-y-4">
        <div className="text-center text-sm text-gray-400">
          <p>Vous n'avez pas encore de compte ?</p>
        </div>
        <Link
          href="/signup"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-[#1E2337] hover:bg-[#252B43] text-white h-10 px-4 py-2 w-full"
        >
          Créer un compte
        </Link>
      </div>
    </div>
  );
}
