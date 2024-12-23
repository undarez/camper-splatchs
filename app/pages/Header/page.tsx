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

  return (
    <header className="w-full bg-gradient-to-r from-[#2ABED9] to-[#1B4B82] dark:from-[#1B4B82] dark:to-[#0F2B4D] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <Link href="/" className="flex-shrink-0 relative">
            <div className="w-[180px] h-[180px] relative -mt-8">
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
                  <Button
                    className="font-mono text-lg text-white dark:text-gray-100 hover:text-[#FFD700] dark:hover:text-[#FFD700] hover:bg-white/10 dark:hover:bg-gray-800/40 transition-all duration-300 transform hover:scale-105"
                    variant="ghost"
                  >
                    Stations
                  </Button>
                </MenubarTrigger>
                <MenubarContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm animate-in slide-in-from-top-2">
                  <MenubarItem className="dark:text-gray-100 dark:focus:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
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
                  <MenubarItem className="dark:text-gray-100 dark:focus:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    <Link
                      href="/pages/StationCard"
                      className="flex w-full"
                      onClick={() => router.push("/pages/StationCard")}
                    >
                      Stations lavage vérifiées
                    </Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>

              <MenubarMenu>
                <MenubarTrigger asChild>
                  <Button
                    className="font-mono text-lg text-white dark:text-gray-100 hover:text-[#FFD700] dark:hover:text-[#FFD700] hover:bg-white/10 dark:hover:bg-gray-800/40 transition-all duration-300 transform hover:scale-105"
                    variant="ghost"
                  >
                    About
                  </Button>
                </MenubarTrigger>
                <MenubarContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm animate-in slide-in-from-top-2">
                  <MenubarItem className="dark:text-gray-100 dark:focus:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
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
                      className="font-mono text-lg text-white dark:text-gray-100 hover:text-[#FFD700] dark:hover:text-[#FFD700] hover:bg-white/10 dark:hover:bg-gray-800/40 transition-all duration-300 transform hover:scale-105"
                      variant="ghost"
                    >
                      {`Bienvenue, ${session.user?.name}`}
                    </Button>
                  </MenubarTrigger>
                  <MenubarContent className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm animate-in slide-in-from-top-2">
                    <MenubarItem className="dark:text-gray-100 dark:focus:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
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
                        <MenubarItem className="dark:text-gray-100 dark:focus:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <Link
                            href="/pages/AdminStation"
                            className="flex w-full"
                            onClick={() => router.push("/pages/AdminStation")}
                          >
                            Administration
                          </Link>
                        </MenubarItem>
                        <MenubarItem className="dark:text-gray-100 dark:focus:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                          <Link
                            href="/pages/AdminUsers"
                            className="flex w-full"
                            onClick={() => router.push("/pages/AdminUsers")}
                          >
                            Gestion des utilisateurs
                          </Link>
                        </MenubarItem>
                      </>
                    )}
                    <MenubarSeparator className="dark:bg-gray-700" />
                    <MenubarItem
                      onClick={() => signOut()}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Se déconnecter
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              ) : (
                <Button
                  className="font-mono text-lg bg-[#FFD700] text-[#1B4B82] hover:bg-[#FFC000] dark:bg-[#FFD700] dark:text-[#0F2B4D] dark:hover:bg-[#FFC000] transition-all duration-300 transform hover:scale-105"
                  onClick={() => router.push("/signin")}
                >
                  Se connecter
                </Button>
              )}
            </Menubar>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`relative w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 dark:from-gray-700 dark:to-gray-900 transition-all duration-500 transform hover:scale-110 ml-4`}
            >
              <div
                className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 ${
                  theme === "dark" ? "translate-x-1" : "-translate-x-1"
                }`}
              >
                {theme === "dark" ? (
                  <MoonIcon className="w-6 h-6 text-yellow-300" />
                ) : (
                  <SunIcon className="w-6 h-6 text-yellow-400" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
