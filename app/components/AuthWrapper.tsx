"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginAd from "./LoginAd";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const [showLoginAd, setShowLoginAd] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && !showLoginAd) {
      setShowLoginAd(true);
    }
  }, [status, showLoginAd]);

  const handleContinue = () => {
    setShowLoginAd(false);
    router.push("/");
  };

  return (
    <>
      {children}
      {showLoginAd && <LoginAd onContinue={handleContinue} />}
    </>
  );
}
