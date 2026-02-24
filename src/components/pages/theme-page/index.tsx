// app/theme/page.tsx (Ya jahan bhi apka component hai)
"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import BreadCrumb from "@/components/common/bread-crumb";
// Naye provider se import karein
import { themeOptions, applyThemeColors } from "@/components/pages/color-theme-provider/index";

export default function ThemePage() {
  const { theme, resolvedTheme } = useTheme();
  const [activeThemeId, setActiveThemeId] = useState("default-blue");
  const [updatingThemeId, setUpdatingThemeId] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("app-color-theme") || "default-blue";
    setActiveThemeId(savedTheme);
  }, []); // Yahan se resolvedTheme ki dependency hata dein, kyu k wo global provider handle kar rha hai

  const handleApplyTheme = (themeId: string) => {
    if (themeId === activeThemeId || updatingThemeId) return;

    setUpdatingThemeId(themeId);

    setTimeout(() => {
      setActiveThemeId(themeId);
      applyThemeColors(themeId, resolvedTheme); // Colors DOM pe lagayega aur storage update karega
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