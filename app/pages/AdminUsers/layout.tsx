import React from "react";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: "Administration des utilisateurs - SplashCamper",
  description: "Gérez les utilisateurs de la plateforme SplashCamper",
};

export default function AdminUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
