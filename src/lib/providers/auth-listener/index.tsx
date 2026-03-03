"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthListener() {
  const router = useRouter();

  useEffect(() => {
    // Jab interceptor event fire karega, yeh function chalega
    const handleUnauthorized = () => {
      router.push("/"); // ✅ Client-side redirect without reload
    };

    // Event listener attach karein
    window.addEventListener("auth-unauthorized", handleUnauthorized);

    // Cleanup function
    return () => {
      window.removeEventListener("auth-unauthorized", handleUnauthorized);
    };
  }, [router]);

  return null; // Yeh component UI mein kuch render nahi karega
}