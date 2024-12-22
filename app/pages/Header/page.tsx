"use client";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon, MonitorIcon } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/app/components/ui/menubar";
import { useRouter } from "next/navigation";

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const isAdmin = session?.user?.email === "fortuna77320@gmail.com";

  const themeIcons = {
    light: <SunIcon className="h-5 w-5 text-yellow-500" />,
    dark: <MoonIcon className="h-5 w-5 text-blue-400" />,
    system: <MonitorIcon className="h-5 w-5 text-gray-400" />,
  };

  return (
    <header className="w-full bg-gradient-to-r from-[#2ABED9] to-[#1B4B82] shadow-xl">
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
          <Menubar className="flex bg-transparent border-none items-center gap-2">
            <MenubarMenu>
              <MenubarTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative overflow-hidden group bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <div className="relative z-10 transition-transform duration-300 ease-in-out group-hover:scale-110">
                    {themeIcons[theme as keyof typeof themeIcons] ||
                      themeIcons.system}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity" />
                </Button>
              </MenubarTrigger>
              <MenubarContent className="bg-white/95 backdrop-blur-sm">
                <MenubarItem
                  onClick={() => setTheme("light")}
                  className="gap-2"
                >
                  {themeIcons.light}
                  <span>Clair</span>
                </MenubarItem>
                <MenubarItem onClick={() => setTheme("dark")} className="gap-2">
                  {themeIcons.dark}
                  <span>Sombre</span>
                </MenubarItem>
                <MenubarItem
                  onClick={() => setTheme("system")}
                  className="gap-2"
                >
                  {themeIcons.system}
                  <span>Système</span>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger asChild>
                <Button
                  className="font-mono text-lg text-white hover:text-[#FFD700] hover:bg-white/10 transition-colors"
                  variant="ghost"
                >
                  Stations
                </Button>
              </MenubarTrigger>
              <MenubarContent className="bg-white/95 backdrop-blur-sm">
                <MenubarItem>
                  <Link
                    href="/components/localisationStation2"
                    className="flex w-full"
                  >
                    Ajouter une station
                  </Link>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>
                  <Link href="/pages/StationCard" className="flex w-full">
                    Stations lavage verifier
                  </Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger asChild>
                <Button
                  className="font-mono text-lg text-white hover:text-[#FFD700] hover:bg-white/10 transition-colors"
                  variant="ghost"
                >
                  About
                </Button>
              </MenubarTrigger>
              <MenubarContent className="bg-white/95 backdrop-blur-sm">
                <MenubarItem>
                  <Link href="/pages/About" className="flex w-full">
                    À propos
                  </Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            {session ? (
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <Button
                    className="font-mono text-lg text-white hover:text-[#FFD700] hover:bg-white/10 transition-colors"
                    variant="ghost"
                  >
                    {`Bienvenue, ${session.user?.name}`}
                  </Button>
                </MenubarTrigger>
                <MenubarContent className="bg-white/95 backdrop-blur-sm">
                  <MenubarItem>
                    <Link href="/pages/profil" className="flex w-full">
                      Profil
                    </Link>
                  </MenubarItem>
                  {isAdmin && (
                    <>
                      <MenubarSeparator />
                      <MenubarItem>
                        <Link
                          href="/pages/AdminStation/AdminPage"
                          className="flex w-full"
                        >
                          Administration
                        </Link>
                      </MenubarItem>
                    </>
                  )}
                  <MenubarSeparator />
                  <MenubarItem
                    onClick={() => signOut()}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Se déconnecter
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            ) : (
              <Button
                className="font-mono text-lg bg-[#FFD700] text-[#1B4B82] hover:bg-[#FFC000] transition-colors"
                onClick={() => router.push("/signin")}
              >
                Se connecter
              </Button>
            )}
          </Menubar>
        </div>
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="votre-client-id"
        data-ad-slot="votre-slot-id"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </header>
  );
};
export default Header;
