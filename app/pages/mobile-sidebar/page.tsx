"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
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
  Menu,
} from "lucide-react";

const menuItems = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/pages/StationCard", label: "Stations", icon: MapPin },
  { href: "/pages/Localisation_Station", label: "Carte", icon: Map },
  { href: "/pages/Contact", label: "Contact", icon: Mail },
  { href: "/pages/About", label: "À propos", icon: Info },
];

const adminItems = [
  { href: "/admin/stations", label: "Gestion des stations", icon: Settings },
  { href: "/admin/users", label: "Gestion des utilisateurs", icon: Users },
];

const MobileSidebar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-50"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <div className="flex flex-col h-full">
          {/* En-tête */}
          <div className="border-b p-4">
            <div className="flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="CamperWash Logo"
                width={150}
                height={40}
                className="object-contain"
              />
            </div>
          </div>

          {/* Menu principal */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                <>
                  <div className="my-4 border-t" />
                  {adminItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          pathname === item.href
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </>
              )}
            </div>
          </nav>

          {/* Pied de page */}
          <div className="border-t p-4">
            <div className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()} CamperWash
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
