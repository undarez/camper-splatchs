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
import { Toggle } from "@/app/components/ui/toggle";
import { useEffect, useState } from "react";

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const isAdmin = session?.user?.email === "fortuna77320@gmail.com";
  const [mounted, setMounted] = useState(false);

  // S'assurer que le composant est monté avant d'afficher le toggle de thème
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="w-full bg-gradient-to-r from-[#2ABED9] to-[#1B4B82] dark:from-[#1B4B82] dark:to-[#0F2B4D] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <Link href="/" className="flex-shrink-0 relative z-50">
            <Image
              src="/images/logo.png"
              alt="logo"
              width={150}
              height={150}
              priority
              className="hover:scale-105 transition-transform duration-200"
            />
          </Link>

          <div className="flex items-center gap-4">
            <Menubar className="flex bg-transparent border-none items-center gap-2">
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <Button
                    className="font-mono text-lg text-white dark:text-gray-100 hover:text-[#FFD700] dark:hover:text-[#FFD700] hover:bg-white/10 dark:hover:bg-gray-800/40 transition-colors"
                    variant="ghost"
                  >
                    Stations
                  </Button>
                </MenubarTrigger>
                <MenubarContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                  <MenubarItem className="dark:text-gray-100 dark:focus:bg-gray-700">
                    <Link
                      href="/components/localisationStation2"
                      className="flex w-full"
                      onClick={() =>
                        router.push("/components/localisationStation2")
                      }
                    >
                      Ajouter une station
                    </Link>
                  </MenubarItem>
                  <MenubarSeparator className="dark:bg-gray-700" />
                  <MenubarItem className="dark:text-gray-100 dark:focus:bg-gray-700">
                    <Link
                      href="/pages/StationCard"
                      className="flex w-full"
                      onClick={() => router.push("/pages/StationCard")}
                    >
                      Stations lavage verifier
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger asChild>
                  <Button
                    className="font-mono text-lg text-white dark:text-gray-100 hover:text-[#FFD700] dark:hover:text-[#FFD700] hover:bg-white/10 dark:hover:bg-gray-800/40 transition-colors"
                    variant="ghost"
                  >
                    About
                  </Button>
                </MenubarTrigger>
                <MenubarContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                  <MenubarItem className="dark:text-gray-100 dark:focus:bg-gray-700">
                    <Link
                      href="/pages/About"
                      className="flex w-full"
                      onClick={() => router.push("/pages/About")}
                    >
                      À propos
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              {session ? (
                <MenubarMenu>
                  <MenubarTrigger asChild>
                    <Button
                      className="font-mono text-lg text-white dark:text-gray-100 hover:text-[#FFD700] dark:hover:text-[#FFD700] hover:bg-white/10 dark:hover:bg-gray-800/40 transition-colors"
                      variant="ghost"
                    >
                      {`Bienvenue, ${session.user?.name}`}
                    </Button>
                  </MenubarTrigger>
                  <MenubarContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                    <MenubarItem className="dark:text-gray-100 dark:focus:bg-gray-700">
                      <Link
                        href="/pages/profil"
                        className="flex w-full"
                        onClick={() => router.push("/pages/profil")}
                      >
                        Profil
                      </Link>
                    </MenubarItem>
                    {isAdmin && (
                      <>
                        <MenubarSeparator className="dark:bg-gray-700" />
                        <MenubarItem className="dark:text-gray-100 dark:focus:bg-gray-700">
                          <Link
                            href="/pages/AdminStation/AdminPage"
                            className="flex w-full"
                            onClick={() =>
                              router.push("/pages/AdminStation/AdminPage")
                            }
                          >
                            Administration
                          </Link>
                        </MenubarItem>
                        <MenubarItem className="dark:text-gray-100 dark:focus:bg-gray-700">
                          <Link
                            href="/pages/AdminStation/GestionStations"
                            className="flex w-full"
                            onClick={() =>
                              router.push("/pages/AdminStation/GestionStations")
                            }
                          >
                            Gestion des stations
                          </Link>
                        </MenubarItem>
                        <MenubarItem className="dark:text-gray-100 dark:focus:bg-gray-700">
                          <Link
                            href="/pages/AdminStation/GestionUtilisateurs"
                            className="flex w-full"
                            onClick={() =>
                              router.push(
                                "/pages/AdminStation/GestionUtilisateurs"
                              )
                            }
                          >
                            Gestion des utilisateurs
                          </Link>
                        </MenubarItem>
                      </>
                    )}
                    <MenubarSeparator className="dark:bg-gray-700" />
                    <MenubarItem
                      onClick={() => signOut()}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                    >
                      Se déconnecter
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              ) : (
                <Button
                  className="font-mono text-lg bg-[#FFD700] text-[#1B4B82] hover:bg-[#FFC000] dark:bg-[#FFD700] dark:text-[#0F2B4D] dark:hover:bg-[#FFC000] transition-colors"
                  onClick={() => router.push("/signin")}
                >
                  Se connecter
                </Button>
              )}
            </Menubar>

            <Toggle
              variant="outline"
              size="lg"
              pressed={theme === "dark"}
              onPressedChange={(pressed) =>
                setTheme(pressed ? "dark" : "light")
              }
              className="theme-toggle bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800"
            >
              <div className="theme-toggle-thumb bg-blue-500 dark:bg-gray-800">
                <div className="absolute inset-0 flex items-center justify-center theme-toggle-icon">
                  {theme === "dark" ? (
                    <MoonIcon className="h-5 w-5 text-white" />
                  ) : (
                    <SunIcon className="h-5 w-5 text-white" />
                  )}
                </div>
              </div>
              <span className="sr-only">Toggle theme</span>
            </Toggle>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
