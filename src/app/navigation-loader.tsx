"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "@/lib/nprogress";

export default function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const loadingRef = useRef(false);

  useEffect(() => {
    if (!loadingRef.current) {
      loadingRef.current = true;
      NProgress.start();
      NProgress.set(0.8);
    }

    const doneTimer = setTimeout(() => {
      NProgress.done(true);
      loadingRef.current = false;
    }, 250);

    return () => clearTimeout(doneTimer);
  }, [pathname, searchParams]);

  return null;
}
