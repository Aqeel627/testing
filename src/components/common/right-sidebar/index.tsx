"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils"; // Assuming you have this utility based on your old code
import {
  Wallet,
  Shield,
  KeyRound,
  FileText,
  BarChart2,
  ListTodo,
  Settings,
  History,
  EyeOff,
  LogOut,
  DivideCircle,
} from "lucide-react";
import Icon from "@/icons/icons";
import { useAuthStore } from "@/lib/useAuthStore";
import { useAppStore } from "@/lib/store/store";
import { useCacheStore } from "@/lib/store/cacheStore";
import { ThemeToggle } from "../theme-toggler";
import { Ripple } from "primereact/ripple";
import { useTheme } from "next-themes";

// Add your existing props or context hooks here
export default function RightSidebar({
  isMenuOpen,
  setIsMenuOpen,
  hideBalance,
  setHideBalance,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  hideBalance: boolean;
  setHideBalance: (hide: boolean) => void;
}) {
  const pathname = usePathname();
  const { openPasswordModal } = useCacheStore();
  const router = useRouter();
  const { token, isLoggedIn, logout } = useAuthStore();
  const { userBalance } = useAppStore();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const userName =
    token && typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userDetail") || "null")?.userName || ""
      : "";

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    router.push("/");
  };

  // Combined menu items with Lucide Icons
  const menuItems = [
    { label: "Change Password", href: "", icon: "changepassword" },
    { label: "Statement", href: "/statement", icon: "statement" },
    { label: "Profit/Loss", href: "/profit-loss", icon: "profitloss" },
    { label: "Bets History", href: "/bets-history", icon: "bethistory" },
    { label: "Settings", href: "/settings", icon: "settings" },
    { label: "Activity", href: "/activity", icon: "activity" },
  ];

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isMenuOpen && (
        <>
          {/* ── Full-viewport Backdrop ── */}
          <motion.div
            key="menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ position: "fixed", inset: 0, zIndex: 999999998 }}
            className="bg-black/40 backdrop-blur-[2px]"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMenuOpen(false);
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            aria-hidden="true"
          />

          {/* ── Menu Panel — slides in from right ── */}
          <motion.div
            key="menu-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              top: "0px",
              right: 0,
              height: "100%",
              zIndex: 999999999,
              willChange: "transform",
            }}
            className="w-[280px] bg-[var(--dropdownBg)] flex flex-col shadow-[-8px_0_32px_rgba(0,0,0,0.5)] overflow-y-auto overflow-x-hidden"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header / Username */}
            <div className="px-4 pt-4 pb-[9px]">
              <h6 className="text-[0.875rem] font-semibold text-[var(--palette-text-primary)] truncate leading-[1.57143]">
                {userName}
              </h6>
            </div>

            <hr className="m-0 shrink-0 border-0 border-b border-dashed border-(--dotted-line)" />

            {/* Stats Cards (Balance & Exposure) */}
            <div className="flex gap-4 px-4 py-5 shrink-0">
              <div className="flex-1 flex flex-col items-center justify-center py-4 rounded-xl border-2 border-[var(--primary-color)] dark:border-[var(--secondary-color)] shadow-[0_0_12px_0px_var(--primary-color)] dark:shadow-[0_0_12px_0px_var(--secondary-color)]">
                <Icon
                  name={"wallet"}
                  className="w-8 h-8 mb-2 text-(--primary-color) dark:text-[var(--secondary-color)]"
                />
                <span className="text-[10px] text-(--tab-default-text) mb-1 tracking-widest uppercase font-semibold">
                  Balance
                </span>
                <span className="text-lg font-bold">
                  {hideBalance
                    ? "-"
                    : (
                        (userBalance?.bankBalance ?? 0) -
                        (userBalance?.exposure ?? 0)
                      ).toFixed(2)}
                </span>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center py-4 rounded-xl border-2 border-[var(--primary-color)] dark:border-[var(--secondary-color)] shadow-[0_0_12px_0px_var(--primary-color)] dark:shadow-[0_0_12px_0px_var(--secondary-color)]">
                <Icon
                  name={"exp"}
                  className="w-8 h-8 mb-2 text-(--primary-color) dark:text-[var(--secondary-color)]"
                />
                <span className="text-[10px] text-(--tab-default-text) mb-1 tracking-widest uppercase font-semibold">
                  Exposure
                </span>
                <span className="text-lg font-bold">
                  {userBalance?.exposure ?? 0}
                </span>
              </div>
            </div>

            {/* Menu List */}
            <ul className="flex flex-col gap-1 flex-grow px-2">
              {menuItems.map((item, index) => {
                const isActive = pathname === item.href;

                return (
                  <li key={index}>
                    <Link
                      prefetch={false}
                      href={item.href}
                      onClick={(e) => {
                        if (item.label === "Change Password") {
                          e.preventDefault();
                          openPasswordModal();
                          setIsMenuOpen(false);
                        } else {
                          setIsMenuOpen(false);
                        }
                      }}
                      className={cn(
                        "relative flex items-center gap-4 px-4 py-3 rounded-lg transition-all w-full",
                        isActive
                          ? "bg-[linear-gradient(90deg,var(--background)_0%,var(--primary-color)_90%)] dark:bg-[linear-gradient(90deg,var(--background)_25%,var(--secondary-color)_90%)] before:content-[''] before:absolute before:-left-[8px] before:top-0 before:h-full before:w-[4px] before:bg-[var(--primary-color)] dark:before:bg-[var(--secondary-color)] before:rounded-[4px]"
                          : "hover:bg-(--primary-hover) border-l-[3px] border-transparent",
                      )}
                    >
                      <Icon
                        className={`w-[22px] h-[22px] text-(--primary-color) dark:text-[var(--secondary-color)]`}
                        name={item.icon}
                      />
                      <span className={`text-[15px] text-(--tab-default-text)`}>
                        {item.label}
                      </span>
                      {/* <Ripple
                        pt={{
                          root: {
                            style: { background: "rgba(145, 158, 171, 0.4)" },
                          },
                        }}
                      /> */}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <hr className="mb-2.5 shrink-0 border-0 border-b border-dashed border-(--dotted-line)" />

            {/* Bottom Actions (Hide Balance & Logout) */}
            <div className="mt-auto mb-2.5 shrink-0 flex flex-col px-2 gap-1">
              <li
                className="p-ripple hidden md:block rounded-lg"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <div
                  className={
                    "flex items-center gap-4 px-4 py-3 cursor-pointer transition-all w-full hover:bg-(--primary-hover) border-l-[3px] border-transparent"
                  }
                >
                  <Icon
                    className={`w-[22px] h-[22px]`}
                    name={theme === "dark" ? "moon" : "moonOutline"}
                  />
                  <span className={`text-[15px] text-(--tab-default-text)`}>
                    {theme === "dark" ? "Light" : "Dark"}
                  </span>
                </div>
                <Ripple
                  pt={{
                    root: { style: { background: "rgba(145, 158, 171, 0.4)" } },
                  }}
                />
              </li>

              <li className="hidden md:block rounded-lg">
                <Link
                  prefetch={false}
                  href={"/theme"}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "relative flex items-center gap-4 px-4 py-3 rounded-lg transition-all w-full",
                    pathname === "/theme"
                      ? "bg-[linear-gradient(90deg,var(--background)_0%,var(--primary-color)_90%)] dark:bg-[linear-gradient(90deg,var(--background)_25%,var(--secondary-color)_90%)] before:content-[''] before:absolute before:-left-[8px] before:top-0 before:h-full before:w-[4px] before:bg-[var(--primary-color)] dark:before:bg-[var(--secondary-color)] before:rounded-[4px]"
                      : "hover:bg-(--primary-hover) border-l-[3px] border-transparent",
                  )}
                >
                  <Icon
                    className={`w-[22px]! h-[22px]! text-(--primary-color) dark:text-[var(--secondary-color)]`}
                    name={
                      theme === "dark"
                        ? "themeSettingDark"
                        : "themeSettingLight"
                    }
                  />
                  <span className={`text-[15px] text-(--tab-default-text)`}>
                    Theme
                  </span>
                </Link>
              </li>
              <li
                className="p-ripple rounded-lg"
                onClick={() => setHideBalance(!hideBalance)}
              >
                <div
                  className={
                    "flex items-center gap-4 px-4 py-3 cursor-pointer transition-all w-full hover:bg-(--primary-hover) border-l-[3px] border-transparent"
                  }
                >
                  <Icon
                    className={`w-[22px] h-[22px] text-(--primary-color) dark:text-[var(--secondary-color)]`}
                    name={"hideBalance"}
                  />
                  <span className="text-[15px] text-(--tab-default-text)">
                    Hide Balance
                  </span>
                  <div
                    className={`w-11 ml-auto rounded-full p-1 flex items-center transition-colors ${
                      hideBalance
                        ? "bg-[var(--secondary-color)]"
                        : "bg-gray-600"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                        hideBalance ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>
                <Ripple
                  pt={{
                    root: { style: { background: "rgba(145, 158, 171, 0.4)" } },
                  }}
                />
              </li>

              {/* Logout Button */}
              <li
                className="p-ripple hidden md:block rounded-lg"
                onClick={handleLogout}
              >
                <div
                  className={
                    "flex items-center gap-4 px-4 py-3 cursor-pointer transition-all w-full hover:bg-(--primary-hover) border-l-[3px] border-transparent"
                  }
                >
                  <Icon name="powerOff" className="w-[22px] h-[22px]" />
                  <span className="text-[15px] text-[#e23a4b] font-medium">
                    Logout
                  </span>
                </div>
                <Ripple
                  pt={{
                    root: { style: { background: "rgba(145, 158, 171, 0.4)" } },
                  }}
                />
              </li>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
