"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    console.log("1234567890")
    const el = document.getElementById("main-scroll");
    el?.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}