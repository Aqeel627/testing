"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import BreadCrumb from "@/components/common/bread-crumb";

 const themeOptions = [
  // 1. Aapki Original Default Theme (Isko bilkul nahi chhera)
  {
    id: "default-blue",
    name: "Original Blue",
    colors: ["#078dee", "#68cdf9"],
    bg: { light: "#f4f6f8", dark: "#141a21" }
  },

  // 2. Premium VIP Gold (Bohat decent aur luxury look - Best for Casino)
  {
    id: "premium-gold",
    name: "Premium Gold",
    colors: ["#eab308", "#fef08a"],
    bg: { light: "#fefce8", dark: "radial-gradient(circle at 50% 0%, #422006 0%, #09090b 100%)" }
  },

  // 3. Royal Amethyst (Modern aur mysterious deep purple)
  {
    id: "royal-amethyst",
    name: "Royal Purple",
    colors: ["#a855f7", "#d8b4fe"],
    bg: { light: "#faf5ff", dark: "radial-gradient(circle at 50% 0%, #2e1065 0%, #09090b 100%)" }
  },

  // 4. Mint FinTech (Aankhon ko thendak dene wala fresh teal/mint)
  {
    id: "mint-fintech",
    name: "Mint Breeze",
    colors: ["#14b8a6", "#5eead4"],
    bg: { light: "#f0fdfa", dark: "radial-gradient(circle at 50% 0%, #042f2e 0%, #09090b 100%)" }
  },

  // 5. Velvet Rose (Chubne wala red nahi, bohat soft aur premium ruby/rose)
  {
    id: "velvet-rose",
    name: "Velvet Rose",
    colors: ["#f43f5e", "#fda4af"],
    bg: { light: "#fff1f2", dark: "radial-gradient(circle at 50% 0%, #4c0519 0%, #09090b 100%)" }
  },

  // 6. Oceanic Trust (FinTech apps wala deep blue, trust build karta hai)
  {
    id: "oceanic-trust",
    name: "Oceanic Blue",
    colors: ["#3b82f6", "#93c5fd"],
    bg: { light: "#eff6ff", dark: "radial-gradient(circle at 50% 0%, #1e3a8a 0%, #09090b 100%)" }
  },

  // 7. Ignite Orange (Sports vibes ke liye energetic aur warm)
  {
    id: "ignite-orange",
    name: "Ignite Orange",
    colors: ["#f97316", "#fdba74"],
    bg: { light: "#fff7ed", dark: "radial-gradient(circle at 50% 0%, #431407 0%, #09090b 100%)" }
  },

  // 8. Neon Matrix (Hacker/Trading style ka sharp neon green glow)
  {
    id: "neon-matrix",
    name: "Matrix Green",
    colors: ["#22c55e", "#86efac"],
    bg: { light: "#f0fdf4", dark: "radial-gradient(circle at 50% 0%, #14532d 0%, #09090b 100%)" }
  },

  // 9. Cosmic Pink (Bohat trendy aur Gen-Z appealing color)
  {
    id: "cosmic-pink",
    name: "Cosmic Pink",
    colors: ["#d946ef", "#f0abfc"],
    bg: { light: "#fdf4ff", dark: "radial-gradient(circle at 50% 0%, #4a044e 0%, #09090b 100%)" }
  },

  // 10. Platinum Sleek (Un users k liye jinhe srf black/grey pasand hai)
  {
    id: "platinum-sleek",
    name: "Platinum Sleek",
    colors: ["#94a3b8", "#cbd5e1"],
    bg: { light: "#f8fafc", dark: "radial-gradient(circle at 50% 0%, #1e293b 0%, #09090b 100%)" }
  }
];
export default function ThemePage() {
  const { theme, resolvedTheme } = useTheme();
  const [activeThemeId, setActiveThemeId] = useState("default-blue");
  const [updatingThemeId, setUpdatingThemeId] = useState<string | null>(null);

  // Yeh function DOM mein ja kar variables change karta hai (100% working approach)
  const applyThemeColors = (themeId: string, currentMode: string | undefined) => {
    const selectedTheme = themeOptions.find((t) => t.id === themeId);
    if (selectedTheme) {
      const root = document.documentElement;
      const primary = selectedTheme.colors[0];
      const secondary = selectedTheme.colors[1];

      const mode = currentMode === "dark" ? "dark" : "light";
      const bgColor = selectedTheme.bg[mode];

      // Colors Update
      root.style.setProperty("--primary-color", primary);
      root.style.setProperty("--secondary-color", secondary);
      root.style.setProperty("--palette-primary-main", primary);
      root.style.setProperty("--tab-active-text", primary);
      root.style.setProperty("--sidebar-badge-text", primary);
      root.style.setProperty("--accordion-text", primary);

      // Backgrounds Update
      // root.style.setProperty("--background", bgColor);
      root.style.setProperty("--palette-background-default", bgColor);
      root.style.setProperty("--market-bg", bgColor);

      localStorage.setItem("app-color-theme", themeId);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("app-color-theme") || "default-blue";
    setActiveThemeId(savedTheme);
    applyThemeColors(savedTheme, resolvedTheme);
  }, [resolvedTheme]);

  const handleApplyTheme = (themeId: string) => {
    if (themeId === activeThemeId || updatingThemeId) return;

    setUpdatingThemeId(themeId);

    setTimeout(() => {
      setActiveThemeId(themeId);
      applyThemeColors(themeId, resolvedTheme);
      setUpdatingThemeId(null);
    }, 600);
  };

  return (
    <div>
      <BreadCrumb title="Theme" showTitle={true} />
      <section className="min-h-auto w-full flex items-center justify-center">
        <div className={cn("flex flex-col rounded-2xl! w-full max-w-5xl transition-all duration-300 bg-transparent!")}>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-2 mt-1">
            {themeOptions.map((item) => {
              const isActive = activeThemeId === item.id;
              const isUpdatingThis = updatingThemeId === item.id;
              const dynamicShadow = isActive ? `0 0 20px ${item.colors[0]}66` : "none";

              return (
                <div
                  key={item.id}
                  onClick={() => handleApplyTheme(item.id)}
                  className={cn(
                    "relative flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group backdrop-blur-xl",
                    theme === "dark" ? "bg-white/5 hover:bg-white/10" : "bg-white/40 hover:bg-white/50",
                    isActive ? "border-2 scale-[1.03]" : "border-2 border-(--dotted-line) hover:scale-[1.03]",
                    updatingThemeId && updatingThemeId !== item.id ? "opacity-50 pointer-events-none" : "opacity-100"
                  )}
                  style={{
                    borderColor: isActive ? item.colors[0] : "",
                    boxShadow: dynamicShadow,
                  }}
                >
                  {isActive && !isUpdatingThis && (
                    <div
                      className="absolute top-2 right-2 rounded-full p-1 z-10 shadow-md animate-in zoom-in duration-200"
                      style={{ backgroundColor: item.colors[0] }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}

                  {isUpdatingThis && (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-20 flex items-center justify-center">
                      <span className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    </div>
                  )}

                  <div className="h-20 w-full flex flex-col opacity-90 group-hover:opacity-100 transition-opacity">
                    <div className="flex-1 w-full" style={{ backgroundColor: item.colors[0] }} />
                    <div className="flex-1 w-full" style={{ backgroundColor: item.colors[1] }} />
                  </div>

                  <div className="p-3 text-center border-t border-white/10">
                    <span
                      className="text-xs md:text-sm font-semibold transition-colors block truncate"
                      style={{ color: isActive ? item.colors[0] : "var(--sidebar-badge-text)" }}
                    >
                      {item.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}