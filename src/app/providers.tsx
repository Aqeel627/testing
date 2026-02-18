"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import NProgress from "@/lib/nprogress";

export default function TopLoader() {
  const pathname = usePathname();
  const running = useRef(false);

  useEffect(() => {
    if (!running.current) {
      running.current = true;
      NProgress.start();
      NProgress.set(0.95);
    }

    const timer = setTimeout(() => {
      NProgress.done(true);
      running.current = false;
    }, 180);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
