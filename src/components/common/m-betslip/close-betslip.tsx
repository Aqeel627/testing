"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store/store";
import { useAuthStore } from "@/lib/useAuthStore";

export function Closebetslip() {
  const pathname = usePathname();
  const { clearSelectedBet, setSlipPreview } = useAppStore();
  const { isLoggedIn, token } = useAuthStore();
  const prevPathname = useRef<string | null>(null);
  const prevLoggedIn = useRef<boolean | null>(null);

  // ✅ close on route change
  useEffect(() => {
    if (prevPathname.current !== null && prevPathname.current !== pathname) {
      clearSelectedBet();
    }
    prevPathname.current = pathname;
  }, [pathname, clearSelectedBet]);

  useEffect(() => {
    if (prevLoggedIn.current === true && !isLoggedIn) {
      clearSelectedBet();
      setSlipPreview({ stake: 0, price: 0 });
    }
    prevLoggedIn.current = isLoggedIn;
  }, [isLoggedIn, token]);

  return null;
}