// components/ColorThemeProvider.tsx
"use client";

import React, { useEffect } from "react";
import { useTheme } from "next-themes";

export const themeOptions = [
    // 1. Aapki Original Default Theme (Isko bilkul nahi chhera)
    {
        id: "default-blue",
        name: "Original Blue",
        colors: ["#078dee", "#68cdf9", "#0351ab"],
        bg: { light: "#f4f6f8", dark: "#141a21" }
    },

    // 2. Premium VIP Gold (Bohat decent aur luxury look - Best for Casino)
    {
        id: "premium-gold",
        name: "Premium Gold",
        colors: ["#eab308", "#fef08a", "#a16207"],
        bg: { light: "#fefce8", dark: "radial-gradient(circle at 50% 0%, #422006 0%, #09090b 100%)" }
    },

    // 3. Royal Amethyst (Modern aur mysterious deep purple)
    {
        id: "royal-amethyst",
        name: "Royal Purple",
        colors: ["#a855f7", "#d8b4fe", "#6d28d9"],
        bg: { light: "#faf5ff", dark: "radial-gradient(circle at 50% 0%, #2e1065 0%, #09090b 100%)" }
    },

    // 4. Mint FinTech (Aankhon ko thendak dene wala fresh teal/mint)
    {
        id: "mint-fintech",
        name: "Mint Breeze",
        colors: ["#14b8a6", "#5eead4", "#0f766e"],
        bg: { light: "#f0fdfa", dark: "radial-gradient(circle at 50% 0%, #042f2e 0%, #09090b 100%)" }
    },

    // 5. Velvet Rose (Chubne wala red nahi, bohat soft aur premium ruby/rose)
    {
        id: "velvet-rose",
        name: "Velvet Rose",
        colors: ["#f43f5e", "#fda4af", "#be123c"],
        bg: { light: "#fff1f2", dark: "radial-gradient(circle at 50% 0%, #4c0519 0%, #09090b 100%)" }
    },

    // 6. Oceanic Trust (FinTech apps wala deep blue, trust build karta hai)
    {
        id: "oceanic-trust",
        name: "Oceanic Blue",
        colors: ["#3b82f6", "#93c5fd", "#1d4ed8"],
        bg: { light: "#eff6ff", dark: "radial-gradient(circle at 50% 0%, #1e3a8a 0%, #09090b 100%)" }
    },

    // 7. Ignite Orange (Sports vibes ke liye energetic aur warm)
    {
        id: "ignite-orange",
        name: "Ignite Orange",
        colors: ["#f97316", "#fdba74", "#c2410c"],
        bg: { light: "#fff7ed", dark: "radial-gradient(circle at 50% 0%, #431407 0%, #09090b 100%)" }
    },

    // 8. Neon Matrix (Hacker/Trading style ka sharp neon green glow)
    {
        id: "neon-matrix",
        name: "Matrix Green",
        colors: ["#22c55e", "#86efac", "#15803d"],
        bg: { light: "#f0fdf4", dark: "radial-gradient(circle at 50% 0%, #14532d 0%, #09090b 100%)" }
    },

    // 9. Cosmic Pink (Bohat trendy aur Gen-Z appealing color)
    {
        id: "cosmic-pink",
        name: "Cosmic Pink",
        colors: ["#d946ef", "#f0abfc", "#a21caf"],
        bg: { light: "#fdf4ff", dark: "radial-gradient(circle at 50% 0%, #4a044e 0%, #09090b 100%)" }
    },

    // 10. Platinum Sleek (Un users k liye jinhe srf black/grey pasand hai)
    {
        id: "platinum-sleek",
        name: "Platinum Sleek",
        colors: ["#94a3b8", "#cbd5e1", "#475569"],
        bg: { light: "#f8fafc", dark: "radial-gradient(circle at 50% 0%, #1e293b 0%, #09090b 100%)" }
    }
];

export const applyThemeColors = (themeId: string, currentMode: string | undefined) => {
    const selectedTheme = themeOptions.find((t) => t.id === themeId);
    if (selectedTheme) {
        const root = document.documentElement;
        const primary = selectedTheme.colors[0];
        const secondary = selectedTheme.colors[1];
        const primaryDark = selectedTheme.colors[2];
        const mode = currentMode === "dark" ? "dark" : "light";
        const bgColor = selectedTheme.bg[mode];

        root.style.setProperty("--primary-color", primary);
        root.style.setProperty("--primary-color-dark", primaryDark);
        root.style.setProperty("--secondary-color", secondary);
        root.style.setProperty("--palette-primary-main", primary);
        root.style.setProperty("--tab-active-text", primary);
        root.style.setProperty("--sidebar-badge-text", primary);
        root.style.setProperty("--accordion-text", primary);
        root.style.setProperty("--palette-background-default", bgColor);
        root.style.setProperty("--market-bg", bgColor);

        root.style.setProperty("--palette-background-default", bgColor);
        root.style.setProperty("--market-bg", bgColor);

        localStorage.setItem("app-color-theme", themeId);
    }
};

export default function ColorThemeProvider({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();

    // Yeh global useEffect app load hote hi har page par theme apply kar dega
    useEffect(() => {
        const savedTheme = localStorage.getItem("app-color-theme") || "default-blue";
        applyThemeColors(savedTheme, resolvedTheme);
    }, [resolvedTheme]);

    return <>{children}</>;
}