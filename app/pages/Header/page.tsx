"use client";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/app/components/ui/menubar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import MobileSidebar from "@/app/pages/mobile-sidebar/page";

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const isAdmin = session?.user?.email === "fortuna77320@gmail.com";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const menuButtonClass = cn(
    "font-sans text-sm text-gray-200",
    "hover:text-blue-400 hover:bg-[#1E2337]/50",
    "transition-all duration-300",
    "rounded-lg px-4 py-2",
    "hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
    "border border-gray-700/50 hover:border-blue-500/50",
    "font-medium",
    "group"
  );

  const menuItemClass = cn(
    "font-sans text-gray-300",
    "hover:text-blue-400 hover:bg-[#1E2337]/80",
    "transition-all duration-200",
    "rounded-lg m-1 p-2",
    "w-full text-sm font-medium",
    "flex items-center",
    "group"
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1E2337]/95 backdrop-blur-md border-b border-gray-700/50 shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <MobileSidebar />
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none">
            <Link href="/" className="flex-shrink-0 relative block">
              <div className="w-[120px] h-[120px] relative">
                <Image
                  src="/images/logo.png"
                  alt="logo"
                  fill
                  sizes="(max-width: 768px) 100px, 120px"
                  style={{ objectFit: "contain" }}
                  priority
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Menubar className="flex bg-transparent border-none items-center gap-2">
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <Button className={menuButtonClass} variant="outline">
                    Stations
                    <span className="ml-1 transform group-hover:rotate-180 transition-transform duration-200">
                      ▼
                    </span>
                  </Button>
                </MenubarTrigger>
                <MenubarContent className="bg-[#1E2337]/95 backdrop-blur-md animate-in slide-in-from-top-2 rounded-lg border border-gray-700/50 shadow-xl p-1 w-48">
                  <MenubarItem className={menuItemClass}>
                    <Link href="/localisationStation2" className="w-full">
                      Ajouter une station
                    </Link>
                  </MenubarItem>
                  <MenubarSeparator className="my-1" />
                  <MenubarItem className={menuItemClass}>
                    <Link href="/pages/StationCard" className="w-full">
                      Stations vérifiées
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger asChild>
                  <Button className={menuButtonClass} variant="outline">
                    À propos
                    <span className="ml-1 transform group-hover:rotate-180 transition-transform duration-200">
                      ▼
                    </span>
                  </Button>
                </MenubarTrigger>
                <MenubarContent className="bg-[#1E2337]/95 backdrop-blur-md animate-in slide-in-from-top-2 rounded-lg border border-gray-700/50 shadow-xl p-1 w-48">
                  <MenubarItem className={menuItemClass}>
                    <Link href="/pages/About" className="w-full">
                      À propos
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger asChild>
                  <Button className={menuButtonClass} variant="outline">
                    Guide
                    <span className="ml-1 transform group-hover:rotate-180 transition-transform duration-200">
                      ▼
                    </span>
                  </Button>
                </MenubarTrigger>
                <MenubarContent className="bg-[#1E2337]/95 backdrop-blur-md animate-in slide-in-from-top-2 rounded-lg border border-gray-700/50 shadow-xl p-1 w-48">
                  <MenubarItem className={menuItemClass}>
                    <Link href="/pages/Guide" className="w-full">
                      Guides
                    </Link>
                  </MenubarItem>
                  <MenubarSeparator className="my-1" />
                  <MenubarItem className={menuItemClass}>
                    <Link href="/pages/FAQ" className="w-full">
                      FAQ
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {session ? (
                <MenubarMenu>
                  <MenubarTrigger asChild>
                    <Button className={menuButtonClass} variant="outline">
                      {`${session.user?.name}`}
                      <span className="ml-1 transform group-hover:rotate-180 transition-transform duration-200">
                        ▼
                      </span>
                    </Button>
                  </MenubarTrigger>
                  <MenubarContent className="bg-[#1E2337]/95 backdrop-blur-md animate-in slide-in-from-top-2 rounded-lg border border-gray-700/50 shadow-xl p-1 w-48">
                    <MenubarItem className={menuItemClass}>
                      <Link href="/pages/profil" className="w-full">
                        Profil
                      </Link>
                    </MenubarItem>
                    <MenubarItem className={menuItemClass}>
                      <Link href="/pages/Calendar" className="w-full">
                        Mon Calendrier
                      </Link>
                    </MenubarItem>
                    {isAdmin && (
                      <>
                        <MenubarSeparator className="my-1" />
                        <MenubarItem className={menuItemClass}>
                          <Link href="/pages/AdminStation" className="w-full">
                            Gestion des stations
                          </Link>
                        </MenubarItem>
                        <MenubarItem className={menuItemClass}>
                          <Link
                            href="/pages/AdminStation/AdminPage"
                            className="w-full"
                          >
                            Tableau de bord
                          </Link>
                        </MenubarItem>
                        <MenubarItem className={menuItemClass}>
                          <Link href="/pages/AdminUsers" className="w-full">
                            Gestion des utilisateurs
                          </Link>
                        </MenubarItem>
                      </>
                    )}
                    <MenubarSeparator className="my-1 bg-slate-50" />
                    <MenubarItem
                      onClick={() => signOut({ callbackUrl: "/signin" })}
                      className="font-sans text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors rounded-lg m-1 p-2.5 w-full text-base font-medium"
                    >
                      Se déconnecter
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              ) : (
                <Button
                  className="font-sans text-sm bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 rounded-lg px-4 py-2 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 font-medium"
                  onClick={() => router.push("/signin")}
                >
                  Se connecter
                </Button>
              )}
            </Menubar>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-8 h-8 rounded-lg bg-[#1E2337]/80 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 flex items-center justify-center transition-all duration-300 hover:bg-[#1E2337] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              {theme === "dark" ? (
                <MoonIcon className="w-4 h-4 text-blue-400" />
              ) : (
                <SunIcon className="w-4 h-4 text-blue-400" />
              )}
            </button>
          </div>

          {/* Placeholder mobile */}
          <div className="w-10 md:hidden"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
