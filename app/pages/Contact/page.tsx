"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          name: formData.get("name"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast({
          title: "Message envoyé",
          description: "Nous vous répondrons dans les plus brefs délais.",
        });
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Nous contacter</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block mb-2">
            Votre email
          </label>
          <Input required type="email" name="email" id="email" />
        </div>
        <div>
          <label htmlFor="name" className="block mb-2">
            Votre nom
          </label>
          <Input required name="name" id="name" />
        </div>
        <div>
          <label htmlFor="subject" className="block mb-2">
            Sujet
          </label>
          <Input required name="subject" id="subject" />
        </div>
        <div>
          <label htmlFor="message" className="block mb-2">
            Votre message
          </label>
          <Textarea required name="message" id="message" rows={6} />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours..." : "Envoyer"}
        </Button>
      </form>
    </div>
  );
};

export default Contact;
