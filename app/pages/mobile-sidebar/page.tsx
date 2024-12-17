"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Home, Info, Mail, MapPin, Map, Settings, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/pages/StationCard", label: "Stations", icon: MapPin },
  { href: "/components/localisationStation2", label: "Carte", icon: Map },
  { href: "/pages/Contact", label: "Contact", icon: Mail },
  { href: "/pages/About", label: "À propos", icon: Info },
];

const adminItems = [
  {
    href: "/pages/AdminStation",
    label: "Gestion des stations",
    icon: Settings,
  },
  { href: "/pages/AdminUsers", label: "Gestion des utilisateurs", icon: Users },
];

const MobileSidebar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Effet pour gérer la visibilité de la carte
  useEffect(() => {
    const mapContainer = document.querySelector(".leaflet-container");
    if (mapContainer) {
      if (open) {
        mapContainer.classList.add("map-hidden");
        mapContainer.classList.remove("map-visible");
      } else {
        mapContainer.classList.add("map-visible");
        mapContainer.classList.remove("map-hidden");
      }
    }
  }, [open]);

  // Gestion du chargement lors du changement de page
  const handleNavigation = (href: string) => {
    if (href !== pathname) {
      setIsLoading(true);
      setOpen(false);
    }
  };

  // Réinitialiser le chargement après le changement de route
  useEffect(() => {
    setIsLoading(false);
    setOpen(false);
  }, [pathname]);

  // Gestionnaire pour les événements clavier
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <>
      <button
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        className={cn(
          "fixed z-[60] md:hidden flex flex-col items-center justify-center w-8 h-8 bg-gradient-to-r from-[#2ABED9] to-[#1B4B82] rounded-lg shadow-lg transition-all duration-300",
          open
            ? "top-2 right-4 scale-90 hover:scale-100"
            : "top-2 left-4 scale-75 hover:scale-90"
        )}
        onClick={() => setOpen(!open)}
      >
        <div className="flex flex-col justify-center items-center gap-1">
          <span
            className={`block h-0.5 w-5 bg-white transform transition-all duration-300 ${
              open ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-white transform transition-all duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-white transform transition-all duration-300 ${
              open ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </div>
      </button>

      {/* Overlay sombre avec gestion de l'accessibilité */}
      {open && (
        <div
          role="presentation"
          aria-hidden="true"
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[45] md:hidden"
          onClick={() => setOpen(false)}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          style={{ pointerEvents: "auto" }}
        />
      )}

      <div
        role="navigation"
        aria-label="Menu principal"
        className={cn(
          "fixed inset-y-0 left-0 z-[50] h-full w-72 transform shadow-lg transition-all duration-300 ease-in-out md:hidden overflow-hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Fond avec animation de vague améliorée */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2ABED9] to-[#1B4B82] overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 animate-wave1">
              <svg
                className="h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  fill="rgba(255, 255, 255, 0.1)"
                  d="M0 50 Q 25 40, 50 50 T 100 50 V100 H0 Z"
                />
              </svg>
            </div>
            <div className="absolute inset-0 animate-wave2 delay-150">
              <svg
                className="h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  fill="rgba(255, 255, 255, 0.15)"
                  d="M0 50 Q 25 45, 50 50 T 100 50 V100 H0 Z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="relative flex h-full flex-col">
          <div className="flex items-center justify-between p-4">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={45}
                height={45}
                className="rounded-full bg-white p-1"
              />
              <span className="text-2xl font-bold text-white">CamperWash</span>
            </Link>
          </div>

          <nav className="flex-1 space-y-2 p-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-4 py-3 text-white transition-all duration-200",
                  pathname === item.href
                    ? "bg-white/20 shadow-lg"
                    : "hover:bg-white/10 hover:translate-x-1"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            {session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
              <>
                <div className="my-4 border-t border-white/20" />
                {adminItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => handleNavigation(item.href)}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg px-4 py-3 text-white transition-all duration-200",
                      pathname === item.href
                        ? "bg-white/20 shadow-lg"
                        : "hover:bg-white/10 hover:translate-x-1"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </>
            )}
          </nav>

          <div className="p-4">
            <div className="rounded-lg bg-white/10 p-4 text-white text-sm">
              <p className="font-medium">Version 1.0.0</p>
              <p className="mt-1 text-white/80">© 2024 CamperWash</p>
            </div>
          </div>
        </div>
      </div>

      {/* Écran de chargement */}
      {isLoading && (
        <div
          role="alert"
          aria-live="polite"
          className="fixed inset-0 bg-gradient-to-b from-[#2ABED9] to-[#1B4B82] z-[70] flex items-center justify-center"
        >
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-white text-lg font-medium">Chargement...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileSidebar;
