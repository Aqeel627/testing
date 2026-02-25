"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store/store";


export function Closebetslip() {
  const pathname = usePathname();
  const { clearSelectedBet } = useAppStore();
  const prevPathname = useRef<string | null>(null);

  useEffect(() => {

    // Only fire when the path actually changed (skip very first render)
    if (prevPathname.current !== null && prevPathname.current !== pathname) {
        // console.log("closebetslip")
      clearSelectedBet();

    }

    prevPathname.current = pathname;
  }, [pathname, clearSelectedBet]);

  return null;
}