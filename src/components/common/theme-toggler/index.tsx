"use client";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Icon from "@/icons/icons";

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
      className="dark:text-gray-400 h-10 w-10 flex items-center  justify-center transition-colors p-1 cursor-pointer rounded-full hover:scale-[1.04] hover:bg-[rgba(145,158,171,0.08)]"
      aria-label="Toggle color scheme"
    >
      {theme === "dark" ? (
        <Icon name="moon" className="w-6 h-6 transition-transform" />
      ) : (
        <Icon name="moonOutline" className="w-6 h-6" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
