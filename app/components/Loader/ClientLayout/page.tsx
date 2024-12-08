"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import LoadingScreen from "@/app/components/Loader/LoadingScreen/page";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {isLoading && <LoadingScreen />}
      {children}
    </>
  );
}
