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
      className="text-gray-400 hover:text-white hidden min-[600]:flex transition-colors p-1 cursor-pointer"
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
