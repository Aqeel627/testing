"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

// 8 Theme configurations
const themeOptions = [
  {
    id: "blue-pro",
    name: "Blue Professional",
    colors: ["#3498db", "#2c3e50"], 
  },
  {
    id: "green-nature",
    name: "Green Nature",
    colors: ["#2ecc71", "#1abc9c"],
  },
  {
    id: "purple-creative",
    name: "Purple Creative",
    colors: ["#9b59b6", "#e91e63"],
  },
  {
    id: "dark-pro",
    name: "Dark Professional",
    colors: ["#34495e", "#7f8c8d"],
  },
  {
    id: "sunset-vibe",
    name: "Sunset Vibe",
    colors: ["#e67e22", "#f39c12"],
  },
  {
    id: "crimson-fire",
    name: "Crimson Fire",
    colors: ["#e53935", "#b71c1c"],
  },
  {
    id: "midnight-neon",
    name: "Midnight Neon",
    colors: ["#0f2027", "#203a43"],
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    colors: ["#00c6ff", "#0072ff"],
  },
];

export default function ThemePage() {
  const { theme, setTheme } = useTheme();
  const [activeThemeId, setActiveThemeId] = useState("blue-pro");
  const [updatingThemeId, setUpdatingThemeId] = useState<string | null>(null);

  const handleApplyTheme = (themeId: string) => {
    // Agar already selected hai to kuch mat karo
    if (themeId === activeThemeId || updatingThemeId) return;

    setUpdatingThemeId(themeId);
    
    // Fake delay to show spinner, then apply theme
    setTimeout(() => {
      setActiveThemeId(themeId);
      // Actual theme set karne ka code:
      // setTheme(themeId); 
      setUpdatingThemeId(null);
    }, 600);
  };

  return (
    <section className="min-h-auto w-full flex items-center justify-center min-[900px]:py-6">
      
      {/* Main Glass Container */}
      <div
        className={cn(
          "flex flex-col rounded-2xl! w-full max-w-5xl p-6 md:p-10 shadow-2xl transition-all duration-300",
          theme === "dark" ? "bg-(--background)" : "bg-(--background)"
        )}
      >
        {/* Header Section */}
        <div className="mb-8">
          <h2 className={cn(
            "text-2xl md:text-3xl font-bold tracking-tight mb-2",
            theme === "dark" ? "text-white" : "text-gray-900"
          )}>
            Choose Your Theme
          </h2>
          <p className={cn(
            "text-sm",
            theme === "dark" ? "text-(--palette-text-secondary)" : "text-gray-500"
          )}>
            Personalize your experience by selecting a color palette that suits your style.
          </p>
        </div>

        {/* Theme Grid: Mobile: 2 cols, Desktop: 4 cols */}
        {/* 8 cards hone ki wajah se perfectly 2 rows banengi desktop par */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-2">
          {themeOptions.map((item) => {
            const isActive = activeThemeId === item.id;
            const isUpdatingThis = updatingThemeId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => handleApplyTheme(item.id)}
                className={cn(
                  "relative flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group backdrop-blur-xl",
                  
                  // GLASS EFFECT LOGIC
                  theme === "dark" 
                    ? "bg-white/5 hover:bg-white/10 border-white/10" 
                    : "bg-white/40 hover:bg-white/50 border-white/50 shadow-lg",
                  
                  // Active vs Inactive state
                  isActive
                    ? "border-2 border-[#078DEE] shadow-[0_0_20px_rgba(7,141,238,0.4)] scale-[1.03]"
                    : "border-2 hover:scale-[1.03]",

                  // Disable clicks when updating
                  updatingThemeId && updatingThemeId !== item.id ? "opacity-50 pointer-events-none" : "opacity-100"
                )}
              >
                {/* Active Checkmark Badge */}
                {isActive && !isUpdatingThis && (
                  <div className="absolute top-2 right-2 bg-[#078DEE] rounded-full p-1 z-10 shadow-md animate-in zoom-in duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                {/* Updating Spinner Overlay */}
                {isUpdatingThis && (
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-20 flex items-center justify-center">
                     <span className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  </div>
                )}

                {/* Color Palette Preview (Half & Half with slight transparency to blend with glass) */}
                <div className="h-20 w-full flex flex-col opacity-90 group-hover:opacity-100 transition-opacity">
                  <div 
                    className="flex-1 w-full" 
                    style={{ backgroundColor: item.colors[0] }} 
                  />
                  <div 
                    className="flex-1 w-full" 
                    style={{ backgroundColor: item.colors[1] }} 
                  />
                </div>

                {/* Theme Name - Transparent background to keep it glassy */}
                <div className="p-3 text-center border-t border-white/10">
                  <span className={cn(
                    "text-xs md:text-sm font-semibold transition-colors block truncate",
                    isActive 
                      ? "text-[#078DEE]" 
                      : (theme === "dark" ? "text-gray-200" : "text-gray-800")
                  )}>
                    {item.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}