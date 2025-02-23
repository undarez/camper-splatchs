"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const isAdmin = session?.user?.email === "fortuna77320@gmail.com";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="text-gray-400 hover:text-gray-200">
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
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 bg-[#1E2337] border-r border-gray-700/50 p-0"
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-700/50">
            <h2 className="text-lg font-semibold text-white mb-2">Menu</h2>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <div className="px-2 py-4 space-y-2">
              <Link
                href="/localisationStation2"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                Ajouter une station
              </Link>
              <Link
                href="/pages/StationCard"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                Stations vérifiées
              </Link>
              <Link
                href="/pages/About"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                À propos
              </Link>
              <Link
                href="/pages/Guide"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                Guides
              </Link>
              <Link
                href="/pages/FAQ"
                className="block px-4 py-2 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                FAQ
              </Link>

              {session && (
                <>
                  <Link
                    href="/pages/profil"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Profil
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <div className="my-2 border-t border-gray-700/50"></div>
                  <Link
                    href="/pages/AdminStation"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Gestion des stations
                  </Link>
                  <Link
                    href="/pages/AdminStation/AdminPage"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Tableau de bord
                  </Link>
                  <Link
                    href="/pages/AdminUsers"
                    className="block px-4 py-2 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Gestion des utilisateurs
                  </Link>
                </>
              )}
            </div>
          </nav>
          <div className="p-4 border-t border-gray-700/50">
            {session ? (
              <Button
                onClick={() => {
                  signOut({ callbackUrl: "/signin" });
                  setOpen(false);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Se déconnecter
              </Button>
            ) : (
              <Button
                onClick={() => {
                  router.push("/signin");
                  setOpen(false);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Se connecter
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
