"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Home,
  Info,
  Mail,
  MapPin,
  Map,
  Settings,
  Users,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

  const handleNavigation = (href: string) => {
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Ouvrir le menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

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

          <div className="p-4 space-y-4">
            <Button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span>Se déconnecter</span>
            </Button>

            <div className="rounded-lg bg-white/10 p-4 text-white text-sm">
              <p className="font-medium">Version 1.0.0</p>
              <p className="mt-1 text-white/80">© 2024 CamperWash</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
