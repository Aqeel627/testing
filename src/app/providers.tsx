"use client";

import { useEffect } from "react";
import NProgress from "nprogress";
import { usePathname, useSearchParams } from "next/navigation";

NProgress.configure({
  minimum: 0.3,     
  easing: "linear",
  speed: 300,
  trickle: false, 
  showSpinner: false,
});

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {

    NProgress.start();

    NProgress.set(0.95);

    const timer = setTimeout(() => {
      NProgress.done(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}
