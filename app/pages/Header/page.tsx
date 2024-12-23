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

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const isAdmin = session?.user?.email === "fortuna77320@gmail.com";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const menuButtonClass =
    "font-sans text-base text-white hover:text-[#FFD700] hover:bg-white/10 transition-all duration-300 rounded-xl px-6 py-2.5 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 border border-[#A5E9FF] hover:border-[#FFD700] font-medium";
  const menuItemClass =
    "font-sans text-gray-700 hover:text-[#1B4B82] hover:bg-blue-50 transition-colors rounded-lg m-1 p-2.5 w-full text-base font-medium";

  return (
    <header className="w-full bg-gradient-to-r from-[#2ABED9] to-[#1B4B82] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <Link href="/" className="flex-shrink-0 relative">
            <div className="w-[160px] h-[160px] relative mt-4">
              <Image
                src="/images/logo.png"
                alt="logo"
                fill
                style={{ objectFit: "contain" }}
                priority
                className="hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <Menubar className="flex bg-transparent border-none items-center gap-4">
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <Button className={menuButtonClass} variant="ghost">
                    Stations
                  </Button>
                </MenubarTrigger>
                <MenubarContent className="bg-white/95 backdrop-blur-sm animate-in slide-in-from-top-2 rounded-xl border border-[#A5E9FF] shadow-xl p-2">
                  <MenubarItem className={menuItemClass}>
                    <Link
                      href="/components/localisationStation2"
                      className="flex w-full items-center"
                    >
                      Ajouter une station
                    </Link>
                  </MenubarItem>
                  <MenubarSeparator className="my-2" />
                  <MenubarItem className={menuItemClass}>
                    <Link
                      href="/pages/StationCard"
                      className="flex w-full items-center"
                    >
                      Stations vérifiées
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger asChild>
                  <Button className={menuButtonClass} variant="ghost">
                    À propos
                  </Button>
                </MenubarTrigger>
                <MenubarContent className="bg-white/95 backdrop-blur-sm animate-in slide-in-from-top-2 rounded-xl border border-[#A5E9FF] shadow-xl p-2">
                  <MenubarItem className={menuItemClass}>
                    <Link
                      href="/pages/About"
                      className="flex w-full items-center"
                    >
                      À propos
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {session ? (
                <MenubarMenu>
                  <MenubarTrigger asChild>
                    <Button className={menuButtonClass} variant="ghost">
                      {`Bienvenue, ${session.user?.name}`}
                    </Button>
                  </MenubarTrigger>
                  <MenubarContent className="bg-white/95 backdrop-blur-sm animate-in slide-in-from-top-2 rounded-xl border border-[#A5E9FF] shadow-xl p-2">
                    <MenubarItem className={menuItemClass}>
                      <Link
                        href="/pages/profil"
                        className="flex w-full items-center"
                      >
                        Profil
                      </Link>
                    </MenubarItem>
                    {isAdmin && (
                      <>
                        <MenubarSeparator className="my-2" />
                        <MenubarItem className={menuItemClass}>
                          <Link
                            href="/pages/AdminStation"
                            className="flex w-full items-center"
                          >
                            Administration
                          </Link>
                        </MenubarItem>
                        <MenubarItem className={menuItemClass}>
                          <Link
                            href="/pages/AdminUsers"
                            className="flex w-full items-center"
                          >
                            Gestion des utilisateurs
                          </Link>
                        </MenubarItem>
                      </>
                    )}
                    <MenubarSeparator className="my-2" />
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
                  className="font-sans text-base bg-[#FFD700] text-[#1B4B82] hover:bg-[#FFD700]/90 transition-all duration-300 rounded-xl px-6 py-2.5 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 font-medium"
                  onClick={() => router.push("/signin")}
                >
                  Se connecter
                </Button>
              )}
            </Menubar>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-[#A5E9FF] hover:border-[#FFD700] flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              {theme === "dark" ? (
                <MoonIcon className="w-5 h-5 text-[#FFD700]" />
              ) : (
                <SunIcon className="w-5 h-5 text-[#FFD700]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
