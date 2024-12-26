"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import AuthProvider from "@/app/context/AuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
