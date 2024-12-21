"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import ReCaptcha from "react-google-recaptcha";

const formSchema = z
  .object({
    email: z.string().email("Adresse e-mail invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const router = useRouter();
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    // Log pour vérifier si la clé ReCaptcha est définie
    console.log("ReCaptcha key présente:", !!recaptchaKey);
  }, [recaptchaKey]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleCaptchaChange = (token: string | null) => {
    console.log("Captcha token reçu:", !!token);
    setCaptchaToken(token);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Début de la soumission du formulaire");
    console.log("ReCaptcha key:", recaptchaKey);
    console.log("Captcha token présent:", !!captchaToken);

    if (!recaptchaKey) {
      console.error("Clé ReCaptcha manquante");
      toast({
        title: "Erreur de configuration",
        description:
          "Le service ReCaptcha n'est pas correctement configuré. Veuillez contacter l'administrateur.",
        variant: "destructive",
      });
      return;
    }

    if (!captchaToken) {
      console.error("Token captcha manquant");
      toast({
        title: "Validation requise",
        description: "Veuillez valider le captcha avant de continuer",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Envoi de la requête avec:", {
        email: values.email,
        hasCaptcha: !!captchaToken,
        captchaLength: captchaToken?.length,
      });

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          captchaToken,
        }),
      });

      const data = await response.json();
      console.log("Réponse du serveur:", data);

      if (!response.ok) {
        if (data.emailTaken) {
          throw new Error("Cette adresse email est déjà utilisée");
        } else if (data.captchaError) {
          throw new Error(
            "La validation du captcha a échoué. Veuillez réessayer."
          );
        } else if (data.missingFields) {
          throw new Error(`Champs manquants: ${data.missingFields.join(", ")}`);
        }
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      toast({
        title: "Inscription réussie!",
        description: "Vous pouvez maintenant vous connecter.",
      });

      router.push("/signin");
    } catch (error) {
      console.error("Erreur détaillée:", error);
      toast({
        title: "Erreur",
        description:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse e-mail</FormLabel>
              <FormControl>
                <Input placeholder="exemple@email.com" {...field} />
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
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmer le mot de passe</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <ReCaptcha
            sitekey={recaptchaKey || ""}
            onChange={handleCaptchaChange}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !captchaToken}
        >
          {isLoading ? "Inscription en cours..." : "S'inscrire"}
        </Button>
      </form>
    </Form>
  );
}
