"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push("/(auth)/signup");
  }, [router]);

  return null;
}
