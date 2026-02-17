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
  className="dark:text-gray-400 --palette-text-primary hidden min-[600px]:flex transition-colors p-1 cursor-pointer rounded-full hover:scale-[1.04] hover:bg-[rgba(145,158,171,0.08)]"
  aria-label="Toggle color scheme"
>
      <Icon
        name={theme === "dark" ? "moon" : "sun"}
        className="w-6 h-6 transition-transform"
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
