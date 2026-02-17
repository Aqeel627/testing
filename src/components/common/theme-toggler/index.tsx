"use client";

import Icon from "@/icons/icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
   <button
  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
  className="dark:text-gray-400 h-10 w-10 flex items-center  justify-center  hidden min-[600px]:flex transition-colors p-1 cursor-pointer rounded-full hover:scale-[1.04] hover:bg-[rgba(145,158,171,0.08)]"
  aria-label="Toggle color scheme"
>
       {theme === "dark" ? (
    <Icon name="moon" className="w-6 h-6 transition-transform" />
  ) : (
<img 
  src="/sun.svg" 
  alt="sun" 
  className="w-6 h-6 transition-transform"
  style={{ filter: "invert(67%) sepia(9%) saturate(354%) hue-rotate(174deg) brightness(70%) contrast(87%)" }}
/>
  )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
