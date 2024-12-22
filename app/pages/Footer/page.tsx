"use client";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Mail, Facebook, Twitter, Instagram } from "lucide-react";
import { Separator } from "@/app/components/ui/separator";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent } from "@/app/components/ui/card";
const Footer = () => {
  const handleMailTo = () => {
    window.location.href = "/pages/Contact";
  };
  return (
    <footer className="bg-gradient-to-r from-[#2ABED9] to-[#1B4B82] text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <Card className="bg-white/10 backdrop-blur-sm border-none">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4 text-[#FFD700]">
                À propos
              </h3>
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/pages/About"
                  className="text-[#A5E9FF] hover:text-white transition-colors text-sm md:text-base"
                >
                  Qui sommes-nous
                </Link>
                <Link
                  href="/pages/Juridique/regles-de-confidentialite"
                  className="text-[#A5E9FF] hover:text-white transition-colors text-sm md:text-base"
                >
                  Règles de confidentialité
                </Link>
                <Link
                  href="/pages/Juridique/ConditionUtilisation"
                  className="text-[#A5E9FF] hover:text-white transition-colors text-sm md:text-base"
                >
                  Conditions d&apos;utilisation
                </Link>
                <Link
                  href="/pages/Juridique/mentions-legales"
                  className="text-[#A5E9FF] hover:text-white transition-colors text-sm md:text-base"
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
              <div className="flex flex-col space-y-4">
                <Button
                  variant="outline"
                  className="w-full text-sm md:text-base bg-white/10 hover:bg-white/20 text-white border border-[#A5E9FF] hover:border-[#FFD700] transition-all"
                  onClick={handleMailTo}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Nous contacter
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-none">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4 text-[#FFD700]">
                Réseaux sociaux
              </h3>
              <div className="flex flex-wrap gap-4">
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
              <div className="flex flex-col space-y-2">
                <p className="text-sm md:text-base text-[#A5E9FF]">
                  Restez informé de nos dernières actualités
                </p>
                <div className="relative w-full">
                  <Input
                    type="email"
                    placeholder="Votre email..."
                    className="w-full bg-white/10 border-[#A5E9FF] text-white placeholder:text-white/70 text-sm md:text-base h-10 md:h-12"
                  />
                  <Button className="absolute right-0 top-0 h-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#1B4B82] text-sm md:text-base">
                    S&apos;abonner
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Separator className="my-8 bg-[#A5E9FF]/30" />
        <div className="text-center text-[#A5E9FF] text-sm md:text-base">
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
