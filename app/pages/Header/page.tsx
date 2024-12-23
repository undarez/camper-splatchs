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
    "font-sans text-sm text-white",
    "hover:text-[#FFD700] hover:bg-white/10",
    "transition-all duration-300",
    "rounded-lg px-4 py-2",
    "hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
    "border border-[#A5E9FF] hover:border-[#FFD700]",
    "font-medium",
    "group"
  );

  const menuItemClass = cn(
    "font-sans text-gray-700",
    "hover:text-[#1B4B82] hover:bg-blue-50",
    "transition-all duration-200",
    "rounded-lg m-1 p-2",
    "w-full text-sm font-medium",
    "flex items-center",
    "group"
  );

  const menuContent = (
    <div className="flex items-center gap-4">
      <div className="md:flex hidden">
        <Menubar className="flex bg-transparent border-none items-center gap-2">
          <MenubarMenu>
            <MenubarTrigger asChild>
              <Button className={menuButtonClass} variant="ghost">
                Stations
                <span className="ml-1 transform group-hover:rotate-180 transition-transform duration-200">
                  ▼
                </span>
              </Button>
            </MenubarTrigger>
            <MenubarContent className="bg-white/95 backdrop-blur-sm animate-in slide-in-from-top-2 rounded-lg border border-[#A5E9FF] shadow-xl p-1 w-48 origin-top-left transition-all duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
              <MenubarItem className={menuItemClass}>
                <Link
                  href="/components/localisationStation2"
                  className="w-full"
                >
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
              <Button className={menuButtonClass} variant="ghost">
                À propos
                <span className="ml-1 transform group-hover:rotate-180 transition-transform duration-200">
                  ▼
                </span>
              </Button>
            </MenubarTrigger>
            <MenubarContent className="bg-white/95 backdrop-blur-sm animate-in slide-in-from-top-2 rounded-lg border border-[#A5E9FF] shadow-xl p-1 w-48">
              <MenubarItem className={menuItemClass}>
                <Link href="/pages/About" className="w-full">
                  À propos
                </Link>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          {session ? (
            <MenubarMenu>
              <MenubarTrigger asChild>
                <Button className={menuButtonClass} variant="ghost">
                  {`${session.user?.name}`}
                  <span className="ml-1 transform group-hover:rotate-180 transition-transform duration-200">
                    ▼
                  </span>
                </Button>
              </MenubarTrigger>
              <MenubarContent className="bg-white/95 backdrop-blur-sm animate-in slide-in-from-top-2 rounded-lg border border-[#A5E9FF] shadow-xl p-1 w-48">
                <MenubarItem className={menuItemClass}>
                  <Link href="/pages/profil" className="w-full">
                    Profil
                  </Link>
                </MenubarItem>
                {isAdmin && (
                  <>
                    <MenubarSeparator className="my-1" />
                    <MenubarItem className={menuItemClass}>
                      <Link href="/pages/AdminStation" className="w-full">
                        Administration
                      </Link>
                    </MenubarItem>
                    <MenubarItem className={menuItemClass}>
                      <Link href="/pages/AdminUsers" className="w-full">
                        Gestion des utilisateurs
                      </Link>
                    </MenubarItem>
                  </>
                )}
                <MenubarSeparator className="my-1" />
                <MenubarItem
                  onClick={() => signOut()}
                  className="font-sans text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors rounded-lg m-1 p-2.5 w-full text-base font-medium"
                >
                  Se déconnecter
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          ) : (
            <Button
              className="font-sans text-sm bg-[#FFD700] text-[#1B4B82] hover:bg-[#FFD700]/90 transition-all duration-300 rounded-lg px-4 py-2 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 font-medium"
              onClick={() => router.push("/signin")}
            >
              Se connecter
            </Button>
          )}
        </Menubar>
      </div>

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm border border-[#A5E9FF] hover:border-[#FFD700] flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
      >
        {theme === "dark" ? (
          <MoonIcon className="w-4 h-4 text-[#FFD700]" />
        ) : (
          <SunIcon className="w-4 h-4 text-[#FFD700]" />
        )}
      </button>

      <div className="md:hidden">
        <MobileSidebar />
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#2ABED9] to-[#1B4B82] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link href="/" className="flex-shrink-0 relative">
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
          {menuContent}
        </div>
      </div>
    </header>
  );
};

export default Header;
