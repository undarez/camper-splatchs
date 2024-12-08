import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/AuthOptions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Star,
  Shield,
  Users,
  ArrowRight,
  Car,
  Droplets,
} from "lucide-react";
import ReviewCard from "@/app/components/ReviewCard";

export default async function Home() {
  const session = await getServerSession(authOptions);
  // Redirection si non connecté
  if (!session) {
    redirect("/signin");
  }
  return (
    <div className="min-h-screen flex">
      {/* Left Ad Space */}
      <aside className="hidden lg:block w-64 p-4 sticky top-0 h-screen">
        {/* <AdComponent position="left" /> */}
      </aside>
      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <section className="relative h-[500px] rounded-xl overflow-hidden mb-16 mt-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2ABED9] to-[#1B4B82]" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/images/station-lavage.png')", // Assurez-vous que l'image est dans le bon dossier
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.4,
              mixBlendMode: "overlay",
            }}
          />
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-white text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bienvenue sur SplashCamper
            </h1>
            <p className="text-xl mb-8 max-w-2xl">
              Trouvez les meilleures stations de lavage pour votre camping-car
            </p>
            <Button
              size="lg"
              className="bg-[#FFD700] hover:bg-[#FFC000] text-[#1B4B82] font-bold"
              asChild
            >
              <Link href="/pages/StationCard">
                Découvrir les stations
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
        {/* Statistics Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 backdrop-blur-sm border-[#A5E9FF]">
            <CardContent className="p-6 text-center">
              <Car className="h-12 w-12 mx-auto mb-4 text-[#2ABED9]" />
              <h3 className="text-2xl font-bold mb-2">150+</h3>
              <p className="text-muted-foreground">Stations référencées</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-[#A5E9FF]">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-[#2ABED9]" />
              <h3 className="text-2xl font-bold mb-2">2000+</h3>
              <p className="text-muted-foreground">Utilisateurs actifs</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm border-[#A5E9FF]">
            <CardContent className="p-6 text-center">
              <Star className="h-12 w-12 mx-auto mb-4 text-[#2ABED9]" />
              <h3 className="text-2xl font-bold mb-2">5000+</h3>
              <p className="text-muted-foreground">Avis vérifiés</p>
            </CardContent>
          </Card>
        </section>
        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Nos Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPin className="h-8 w-8" />}
              title="Localisation Facile"
              description="Trouvez rapidement les stations près de vous grâce à notre carte interactive"
            />
            <FeatureCard
              icon={<Droplets className="h-8 w-8" />}
              title="Stations Vérifiées"
              description="Toutes nos stations sont vérifiées par notre équipe"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Avis de Confiance"
              description="Des avis authentiques de notre communauté"
            />
          </div>
        </section>
        {/* Community Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-[#2ABED9] to-[#1B4B82] rounded-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4 text-center">
              Rejoignez notre communauté
            </h2>
            <p className="text-center mb-8 max-w-2xl mx-auto">
              Partagez vos expériences et aidez d&apos;autres camping-caristes à
              trouver les meilleures stations
            </p>
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-[#A5E9FF] hover:border-[#FFD700]"
                asChild
              >
                <Link href="/pages/Localisation_Station">
                  Ajouter une station
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        {/* Latest Reviews Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Derniers Avis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ici vous pouvez mapper sur vos derniers avis */}
            <ReviewCard
              name="Jean D."
              rating={5}
              comment="Excellente station, très propre et bien entretenue"
              date="Il y a 2 jours"
            />
            <ReviewCard
              name="Marie L."
              rating={4}
              comment="Bonne station, facile d'accès pour les grands véhicules"
              date="Il y a 4 jours"
            />
          </div>
        </section>
      </main>
      {/* Right Ad Space */}
      <aside className="hidden lg:block w-64 p-4 sticky top-0 h-screen">
        {/* <AdComponent position="right" /> */}
      </aside>
    </div>
  );

  // Components
  function FeatureCard({
    icon,
    title,
    description,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-[#A5E9FF] hover:border-[#FFD700] transition-all">
        <CardContent className="p-6">
          <div className="text-[#2ABED9] mb-4">{icon}</div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    );
  }
}
