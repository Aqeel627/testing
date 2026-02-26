"use client";

import { useEffect, useMemo, useRef } from "react";
import { useCacheStore } from "@/lib/store/cacheStore";
import { useAuthStore } from "@/lib/useAuthStore";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setLoginModal } = useCacheStore();
  const { token } = useAuthStore();

  const triggeredRef = useRef(false);

  // token store se ya localStorage se (same flow as your project)
  const hasToken = useMemo(() => {
    if (typeof window === "undefined") return !!token;
    return !!(token || localStorage.getItem("token"));
  }, [token]);

  useEffect(() => {
    if (!hasToken && !triggeredRef.current) {
      triggeredRef.current = true;
      setLoginModal(true);
    }
  }, [hasToken, setLoginModal]);

  // content block
  if (!hasToken) return null;

  return <>{children}</>;
}