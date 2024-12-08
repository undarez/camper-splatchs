"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Facebook, Twitter, Instagram } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
const Footer = () => {
  const handleMailTo = () => {
    window.location.href = "/pages/Contact";
  };
  return (
    <footer className="bg-gradient-to-r from-[#2ABED9] to-[#1B4B82] text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Card className="bg-white/10 backdrop-blur-sm border-none">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4 text-[#FFD700]">
                À propos
              </h3>
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/pages/About"
                  className="text-[#A5E9FF] hover:text-white transition-colors"
                >
                  Qui sommes-nous
                </Link>
                <Link
                  href="/pages/Juridique/PolitiqueConfidentialiter"
                  className="text-[#A5E9FF] hover:text-white transition-colors"
                >
                  Politique de confidentialité
                </Link>
                <Link
                  href="/pages/Juridique/ConditionUtilisation"
                  className="text-[#A5E9FF] hover:text-white transition-colors"
                >
                  Conditions d&apos;utilisation
                </Link>
                <Link
                  href="/pages/Juridique/mentions-legales"
                  className="text-[#A5E9FF] hover:text-white transition-colors"
                >
                  Mentions légales
                </Link>
              </nav>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-none">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4 text-[#FFD700]">
                Contact
              </h3>
              <Button
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border border-[#A5E9FF] hover:border-[#FFD700] transition-all"
                onClick={handleMailTo}
              >
                <Mail className="h-4 w-4 mr-2" />
                Nous contacter
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-none">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4 text-[#FFD700]">
                Réseaux sociaux
              </h3>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/10 hover:bg-white/20 text-white border-[#A5E9FF] hover:border-[#FFD700]"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/10 hover:bg-white/20 text-white border-[#A5E9FF] hover:border-[#FFD700]"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/10 hover:bg-white/20 text-white border-[#A5E9FF] hover:border-[#FFD700]"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-none">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4 text-[#FFD700]">
                Newsletter
              </h3>
              <p className="text-[#A5E9FF] mb-4">
                Restez informé des dernières mises à jour
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Votre email"
                  className="bg-white/10 border-[#A5E9FF] text-white placeholder:text-[#A5E9FF]/70"
                />
                <Button
                  variant="outline"
                  className="bg-[#FFD700] hover:bg-[#FFC000] text-[#1B4B82] border-none font-semibold"
                >
                  S&apos;inscrire
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Separator className="my-8 bg-[#A5E9FF]/30" />
        <div className="text-center text-[#A5E9FF]">
          <p>
            &copy; {new Date().getFullYear()} SplashCamper. Tous droits
            réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
