"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Home,
  MapPin,
  Map,
  Mail,
  Info,
  Settings,
  Users,
  LogOut,
  Star,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/", label: "Accueil", icon: Home },
  {
    href: "/pages/StationCard",
    label: "Stations vérifiées",
    icon: MapPin,
    highlight: true,
  },
  {
    href: "/localisationStation2",
    label: "Ajouter un emplacement",
    icon: Map,
    highlight: true,
  },
  { href: "/pages/Contact", label: "Contact", icon: Mail },
  { href: "/pages/About", label: "À propos", icon: Info },
];

const adminItems = [
  {
    href: "/pages/AdminStation",
    label: "Gestion des stations",
    icon: Settings,
  },
  {
    href: "/pages/AdminUsers",
    label: "Gestion des utilisateurs",
    icon: Users,
  },
  {
    href: "/pages/AdminStation/AdminPage",
    label: "Statistiques Admin",
    icon: Star,
  },
];

const MobileSidebar = ({
  isSidebarOpen = false,
}: {
  isSidebarOpen?: boolean;
}) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(isSidebarOpen);

  useEffect(() => {
    setOpen(isSidebarOpen);
  }, [isSidebarOpen]);

  return (
    <>
      <style>{`
        .sidebar-bg {
          background: #0a0f1c;
          border-radius: 16px;
          margin: 8px;
          height: calc(100vh - 16px);
          width: 250px;
        }

        .highlight-green {
          background: linear-gradient(90deg, rgba(34, 197, 94, 0.2), transparent);
          border-left: 3px solid rgb(34, 197, 94);
        }

        .highlight-blue {
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.2), transparent);
          border-left: 3px solid rgb(59, 130, 246);
        }

        .menu-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          color: #94a3b8;
          transition: all 0.2s;
          border-radius: 8px;
          margin: 4px 0;
        }

        .menu-item:hover {
          color: #f8fafc;
          background: rgba(59, 130, 246, 0.1);
        }

        .menu-item.active {
          color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
        }

        .menu-item span {
          margin-left: 12px;
          font-size: 14px;
          font-weight: 500;
        }
      `}</style>

      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-white md:hidden"
        aria-label="Toggle menu"
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

      <div
        role="navigation"
        aria-label="Menu principal"
        className={cn(
          "fixed inset-y-0 left-0 z-[40] transform transition-all duration-300 ease-in-out sidebar-bg",
          open ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        <div className="relative flex h-full flex-col">
          <div className="flex items-center p-4">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={35}
                height={35}
                className="rounded-full"
              />
              <span className="text-white text-lg font-medium">CamperWash</span>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "menu-item",
                  pathname === item.href && "active",
                  item.highlight && "highlight-blue"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}

            {session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
              <>
                <div className="my-4 border-t border-white/5" />
                {adminItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "menu-item",
                      pathname === item.href && "active"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </>
            )}
          </nav>

          <div className="p-4 mt-auto">
            <div className="flex space-x-4 justify-center">
              <Link href="#" className="text-gray-500 hover:text-gray-300">
                <LogOut className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
