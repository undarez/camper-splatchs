"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/auth/signin");
  };

  if (!isMounted) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#1E2337] border-b border-gray-700/50 z-[2000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et Menu Burger */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 shadow-lg border border-white/20 transition-all duration-200"
              aria-label="Menu"
            >
              <Menu className="h-6 w-6 text-white" />
            </button>
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="SplashCamper Logo"
                width={40}
                height={40}
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-bold">SplashCamper</span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex items-center space-x-8 relative">
              <div className="relative group">
                <button className="hover:text-blue-100 py-4">Stations</button>
                <div className="absolute left-0 top-[calc(100%+1px)] pt-2 w-48">
                  <div className="bg-[#1E2337] border border-gray-700/50 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[2001]">
                    <Link
                      href="/pages/StationCard"
                      className="block px-4 py-2 text-sm text-white hover:bg-white/10 rounded-t-lg"
                    >
                      Liste des stations
                    </Link>
                    <Link
                      href="/localisationStation2"
                      className="block px-4 py-2 text-sm text-white hover:bg-white/10"
                    >
                      Carte des stations
                    </Link>
                    <Link
                      href="/pages/AdminStation"
                      className="block px-4 py-2 text-sm text-white hover:bg-white/10 rounded-b-lg"
                    >
                      Administration
                    </Link>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="hover:text-blue-100 py-4">À propos</button>
                <div className="absolute left-0 top-[calc(100%+1px)] pt-2 w-48">
                  <div className="bg-[#1E2337] border border-gray-700/50 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[2001]">
                    <Link
                      href="/pages/About"
                      className="block px-4 py-2 text-sm text-white hover:bg-white/10 rounded-t-lg"
                    >
                      Notre projet
                    </Link>
                    <Link
                      href="/pages/Contact"
                      className="block px-4 py-2 text-sm text-white hover:bg-white/10 rounded-b-lg"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            {/* Bouton de connexion/profil */}
            {status === "authenticated" && session ? (
              <div className="relative group">
                <button className="hover:text-blue-100 py-4">
                  {session.user?.name || session.user?.email || "Profil"}
                </button>
                <div className="absolute right-0 top-[calc(100%+1px)] pt-2 w-48">
                  <div className="bg-[#1E2337] border border-gray-700/50 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[2001]">
                    <Link
                      href="/pages/profil"
                      className="block px-4 py-2 text-sm text-white hover:bg-white/10 rounded-t-lg"
                    >
                      Mon profil
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 rounded-b-lg"
                    >
                      Se déconnecter
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => router.push("/auth/signin")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Se connecter
              </Button>
            )}

            {/* Bouton de thème */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 shadow-lg border border-white/20 transition-all duration-200"
              aria-label="Changer le thème"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden absolute w-full bg-[#1E2337] border-b border-gray-700/50 shadow-xl z-[2001]">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/pages/StationCard"
                className="block px-3 py-2 rounded-md text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Stations
              </Link>
              <Link
                href="/pages/About"
                className="block px-3 py-2 rounded-md text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </Link>
              <Link
                href="/pages/Contact"
                className="block px-3 py-2 rounded-md text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
