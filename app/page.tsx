import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/AuthOptions";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { MapPin, Shield, ArrowRight, Droplets } from "lucide-react";
import { Statistics } from "@/app/components/Statistics";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin");
  }
  return (
    <div className="w-full">
      <main className="px-4 py-8 max-w-7xl mx-auto">
        {/* Hero Section - Plus compact et moderne */}
        <section className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-12 group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2ABED9] to-[#1B4B82] transition-opacity duration-300" />
          <div
            className="absolute inset-0 transform transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: "url('/images/station-lavage.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.4,
              mixBlendMode: "overlay",
            }}
          />
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-white text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#A5E9FF]">
              Bienvenue sur SplashCamper
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-xl text-[#A5E9FF]">
              Trouvez les meilleures stations de lavage pour votre camping-car
            </p>
            <Button
              size="lg"
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#1B4B82] font-bold transform hover:-translate-y-1 transition-all duration-300"
              asChild
            >
              <Link
                href="/pages/StationCard"
                className="flex items-center gap-2"
              >
                Découvrir les stations
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mb-12">
          <Statistics />
        </section>

        {/* Features Section - Design plus moderne */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#2ABED9] to-[#1B4B82] bg-clip-text text-transparent">
            Nos Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<MapPin className="h-8 w-8" />}
              title="Localisation Facile"
              description="Trouvez rapidement les stations près de vous"
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

        {/* Community Section - Plus compact et attrayant */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-[#2ABED9] to-[#1B4B82] rounded-2xl p-6 md:p-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                Rejoignez notre communauté
              </h2>
              <p className="text-[#A5E9FF] mb-6 text-sm md:text-base">
                Partagez vos expériences et aidez d&apos;autres camping-caristes
              </p>
              <Button
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-[#A5E9FF] hover:border-[#FFD700] transform hover:-translate-y-1 transition-all duration-300"
                asChild
              >
                <Link
                  href="/components/localisationStation2"
                  className="flex items-center gap-2"
                >
                  Ajouter une station
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Feature Card Component - Design plus moderne
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
    <Card className="group bg-white/5 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-[#A5E9FF]/30 hover:border-[#FFD700] overflow-hidden">
      <CardContent className="p-6">
        <div className="text-[#2ABED9] mb-4 transform group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-[#2ABED9] to-[#1B4B82] bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}
