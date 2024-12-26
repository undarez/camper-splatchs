"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Menu, Sun, Moon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
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
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/pages/StationCard" className="hover:text-blue-100">
                Stations
              </Link>
              <Link href="/pages/About" className="hover:text-blue-100">
                À propos
              </Link>
              <Link href="/pages/Contact" className="hover:text-blue-100">
                Contact
              </Link>
            </nav>
            {/* Bouton de thème (visible en mobile et desktop) */}
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
          <div className="md:hidden">
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
