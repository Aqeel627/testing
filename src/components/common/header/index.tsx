"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./headerPage.module.css";
import { useEffect, useRef, useState } from "react";
import { CONFIG } from "@/lib/config";
import { useAppStore } from "@/lib/store/store";
import { fetchData } from "@/lib/functions";
import { useAuthStore } from "@/lib/useAuthStore";
import { ThemeToggle } from "../theme-toggler";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useCacheStore } from "@/lib/store/cacheStore";
import dynamic from "next/dynamic";
import { useUIStore } from "@/lib/store/ui-store";
import Icon from "@/icons/icons";
import { Ripple } from "primereact/ripple";

type HeaderProps = {
  onMenuClick?: () => void;
  hideMenuBtn?: boolean;
};

export default function Header({ onMenuClick, hideMenuBtn }: HeaderProps) {
  // New state for checkbox toggles - default true
  const { toggleBets } = useUIStore();
  const [showBalance, setShowBalance] = useState(true);
  const [showExposure, setShowExposure] = useState(true);
  const { userBalance, setUserBalance } = useAppStore();
  const { setLoginModal, openPasswordModal } = useCacheStore();
  const { token, isLoggedIn, logout } = useAuthStore();
  const { resolvedTheme, theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [hideBalance, setHideBalance] = useState(false);
  const { clearSelectedBet } = useAppStore();
  const pathName = usePathname();
  const router = useRouter();
  const userName =
    token && typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userDetail") || "null")?.userName || ""
      : "";

  useEffect(() => {
    if (token) {
      fetchData({
        url: CONFIG.getUserBalance,
        payload: {},
        headers: { Authorization: `Bearer ${token}` },
        setFn: setUserBalance,
      });
    }
  }, [token]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    router.push("/");
  };

  return (
    <div id="header.tsx">
      <header
        className={cn(
          "w-full glass-header  --palette-text-primary  sticky top-0 z-[9999999]",
          theme === "light" &&
          "backdrop-blur-[10px]! bg-linear-to-br! from-white/25! to-white/5! border-b! border-[rgb(205_192_192/0.4)]! shadow-[0_8px_32px_rgba(0,0,0,0.2)]!",
        )}
      >
        <div className="max-w-[1600px] mx-auto px-2 h-12 flex items-center justify-between">
          {/* 👇 Left: Hamburger & Logo */}
          <div className="flex items-center gap-0 min-[321px]:gap-3 md:gap-4">
            {!hideMenuBtn && (
              <button
                type="button"
                onClick={onMenuClick}
                className="text-(--palette-text-secondary) transition-colors p-1 cursor-pointer rounded-full hover:scale-[1.04] hover:bg-(--IconButton-hoverBg)"
                aria-label="Toggle sidebar"
              >
                <Icon name="logo" className="h-6 w-6" />
              </button>
            )}
            {/* <div className="relative"> */}
            {/* <div className="neon-underline min-[960]:bottom-[9px] bottom-[7px]">
              <span className="neon-glow glow-main"></span>
              <span className="neon-line line-main"></span>

              <span className="neon-glow glow-center"></span>
              <span className="neon-line line-center"></span>
            </div> */}
            <Link
              href="/"
              onClick={() => {
                window.dispatchEvent(new Event("reset-sidebar"));
                clearSelectedBet();
              }}
              className="relative font-[inherit]  no-underline shrink-0 text-transparent inline-flex h-[44px] w-[120px] min-[321px]:w-[152px] cursor-pointer"
            >
              <Image
                src={theme === "dark" ? "/logo-black.svg" : "/logo-white.svg"}
                alt="GJEXCH Logo"
                fill
                loading="lazy"
                className="object-contain relative! mx-1 "
              />
            </Link>
            {/* </div> */}
          </div>

          <nav className="hidden min-[960px]:flex items-center gap-2 font-bold --palette-text-primary  relative left-[3px]">
            <Link
              href="/"
              onClick={() => window.dispatchEvent(new Event("reset-sidebar"))}
              className={cn(
                pathName !== "/live-casino" && "active text-(--primary-color)!",
                "flex p-1 items-center relative text-[13px] font-bold --palette-text-primary  hover:--palette-text-primary  transition-colors group rounded-lg  hover:bg-(--primary-hover) ",
              )}
            >
              {/* {pathName === "/" && (
              <div className="neon-underline none exch">
                <span className="neon-glow glow-main"></span>
                <span className="neon-line line-main"></span>

                <span className="neon-glow glow-center"></span>
                <span className="neon-line line-center"></span>
              </div>
            )} */}
              <span
                className={cn(
                  pathName !== "/live-casino"
                    ? "active text-(--primary-color)! border-(--primary-color)!"
                    : "border-[#a5a7a9]",
                  " group-hover:--palette-text-primary transition-colors mr-[4px]  border rounded-full p-[2px]",
                )}
              >
                <Icon
                  name="exchange"
                  className={cn(
                    "h-4 w-4",
                    pathName !== "/live-casino" && "text-(--primary-color)!",
                  )}
                />
              </span>
              <span className="relative top-[-0.5px]">Exchange</span>
            </Link>

            <Link
              prefetch={false}
              href="/live-casino"
              className={cn(
                pathName === "/live-casino" && "active text-(--primary-color)!",
                "flex p-1 items-center text-[13px] --palette-text-primary  hover:--palette-text-primary  transition-colors group relative left-[2px] font-bold rounded-lg  hover:bg-(--primary-hover) ",
              )}
            >
              {/* {pathName === "/live-casino" && (
              <div className="neon-underline none casino">
                <span className="neon-glow glow-main"></span>
                <span className="neon-line line-main"></span>

                <span className="neon-glow glow-center"></span>
                <span className="neon-line line-center"></span>
              </div>
            )} */}
              {/* Live Casino Icon */}
              <span
                className={cn(
                  pathName === "/live-casino" && " text-(--primary-color)!",
                  " group-hover:--palette-text-primar transition-colors mr-[2px]",
                )}
              >
                <Icon name="casino" className="h-6 w-6" />
              </span>
              <span className="relative top-[-0.5px]">Casino</span>
            </Link>

            {/* <Link
            href="/casinos/q-tech/aviator"
            className="flex p-1 items-center text-[13px] font-medium --palette-text-primary  hover:--palette-text-primary  transition-colors relative left-[0.5px] rounded-lg  hover:bg-[rgba(145,158,171,0.08)] "
          >
            <span className=" group-hover:--palette-text-primary  transition-colors mr-[3px] inline-block">
              <Icon name="sportbook" className="h-4 w-4" />
            </span>
            <span className="font-bold --palette-text-primary  relative top-[-0.5px]">
              Sportbook
            </span>
          </Link> */}

            {/* <Link
            href="/slot"
            className="flex p-1 items-center justify-center text-[13px] font-bold --palette-text-primary  hover:--palette-text-primary  transition-colors w-[70px] relative left-[3px] rounded-lg  hover:bg-[rgba(145,158,171,0.08)] "
          >
            <span className=" group-hover:--palette-text-primary  transition-colors mr-[3px] inline-block">
              <Icon name="fancty" className="h-4 w-4" />
            </span>
            <span className="--palette-text-primary  font-bold relative top-[-0.5px]">
              Fancty
            </span>
          </Link> */}
          </nav>

          <div className="flex items-center gap-2 sm:gap-[6px]">
            {isLoggedIn && (
              // <button
              //   onClick={toggleBets}
              //   className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-sans font-bold leading-[1.71429] normal-case min-w-[64px] text-[0.8125rem] h-[30px] outline-none m-0 no-underline rounded-lg border border-solid py-[3px] px-1 min-[600px]:px-[8px] transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] bg-transparent hover:border-[1px] hover:border-[#078dee] text-[#078DEE] border-[#078dee7a] hover:bg-blue-600/5 hover:shadow-[0px_0px_0px_0.75px_currentColor]"
              // >
              //   Bets
              // </button>

              <div
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative inline-flex items-center justify-center h-[29px] rounded-[8px] p-[1px] overflow-hidden bg-transparent group cursor-pointer max-w-16"
              >
                <span
                  className="absolute inset-0 m-auto w-full h-full rounded-[inherit] content-[''] pointer-events-none 
        [mask:linear-gradient(#fff_0_0)_content-box_xor,linear-gradient(#fff_0_0)] 
        -webkit-[mask:linear-gradient(#fff_0_0)_content-box_xor,linear-gradient(#fff_0_0)]"
                >
                  <span className="absolute inset-0 bg-white/10 opacity-20"></span>

                  {/* 👇 Dono shapes with exact colors */}
                  <span
                    className={`${styles.movingShape} ${styles.shapeGold}`}
                  ></span>
                  <span
                    className={`${styles.movingShape} ${styles.shapeBlue}`}
                  ></span>
                </span>
                <button className="p-ripple relative z-10 flex flex-col items-center justify-center px-4 py-1 bg-[var(--background)] hover:bg-[var(--head-hover)] h-[28px] rounded-[7px] w-full h-full min-w-[62px] cursor-pointer">
                  <span className="text-[0.6rem] text-[#919EAB] font-semibold leading-[1] uppercase tracking-[1px]">
                    Pts
                  </span>
                  <span className="text-[10px] font-bold leading-[1] text-[var(--palette-text-primary)]">
                    {hideBalance
                      ? "-"
                      : (
                        (userBalance?.bankBalance ?? 0) -
                        (userBalance?.exposure ?? 0)
                      ).toFixed(2)}
                  </span>
                  <Ripple
                    pt={{
                      root: {
                        style: { background: "rgba(145, 158, 171, 0.4)" },
                      },
                    }}
                  />
                </button>
              </div>
            )}
            {!isLoggedIn && (
              <div className="hidden md:block">
                {theme === "dark" ? (
                  <Icon
                    name="themeSettingDark"
                    className="h-5 w-5 mr-2 cursor-pointer"
                    onClick={() => router.push("/theme")}
                  />
                ) : (
                  <Icon
                    name="themeSettingLight"
                    className="h-5 w-5 mr-2 cursor-pointer"
                    onClick={() => router.push("/theme")}
                  />
                )}
              </div>
            )}
            {!isLoggedIn && (
              <span className="hidden min-[600px]:flex ">
                <ThemeToggle />
              </span>
            )}
            {!isLoggedIn && (
              // <Link
              //   href="/login"
              //   className="text-sm leading-[1.71429] [text-transform:unset] min-w-16 py-[5px] px-3 flex justify-center items-center text-sm border-1 border-[#919eab52] rounded-[8px] --palette-text-primary  rounded-lg  hover:bg-[rgba(145,158,171,0.08)]   font-bold transition-all duration-300 mr-1"
              // >
              //   Login
              // </Link>
              <div
                onClick={() => setLoginModal(true)}
                className="p-ripple text-sm leading-[1.71429] cursor-pointer [text-transform:unset] min-w-16 py-[5px] px-3 flex justify-center items-center text-sm border-1 border-[rgba(var(--palette-grey-500Channel)_/_32%)] rounded-[8px] --palette-text-primary  rounded-lg  hover:bg-[rgba(145,158,171,0.08)]   font-bold transition-all duration-300 mr-1"
              >
                Login
                <Ripple
                  pt={{
                    root: {
                      style: { background: "rgba(145, 158, 171, 0.4)" },
                    },
                  }}
                />
              </div>
            )}
            {isLoggedIn && (
              <div className="flex items-center gap-2 mr-1" ref={menuRef}>
                <div className="relative inline-flex items-center justify-center h-[29px] rounded-[8px] p-[1px] overflow-hidden bg-transparent group cursor-pointer max-w-16">
                  <span
                    className="absolute inset-0 m-auto w-full h-full rounded-[inherit] content-[''] pointer-events-none 
        [mask:linear-gradient(#fff_0_0)_content-box_xor,linear-gradient(#fff_0_0)] 
        -webkit-[mask:linear-gradient(#fff_0_0)_content-box_xor,linear-gradient(#fff_0_0)]"
                  >
                    <span className="absolute inset-0 bg-white/10 opacity-20"></span>

                    {/* 👇 Dono shapes with exact colors */}
                    <span
                      className={`${styles.movingShape} ${styles.shapeGold}`}
                    ></span>
                    <span
                      className={`${styles.movingShape} ${styles.shapeBlue}`}
                    ></span>
                  </span>
                  <button className="p-ripple relative z-10 flex flex-col items-center justify-center px-4 py-1 bg-[var(--background)] hover:bg-[var(--head-hover)] h-[28px] rounded-[7px] w-full h-full min-w-[62px] cursor-pointer">
                    <span className="text-[0.6rem] text-[#919EAB] font-semibold leading-[1] uppercase tracking-[1px]">
                      Exp
                    </span>
                    <span className="text-[10px] font-bold leading-[1] text-[var(--palette-text-primary)]">
                      {userBalance?.exposure ?? 0}
                    </span>
                    <Ripple
                      pt={{
                        root: {
                          style: { background: "rgba(145, 158, 171, 0.4)" },
                        },
                      }}
                    />
                  </button>
                </div>

                {isMenuOpen && (
                  <div className="absolute top-0 md:top-[16px] md:top-[38px] right-0 md:right-[10px] w-[250px] bg-[var(--dropdownBg)] rounded-xl  z-[9999999] flex flex-col var(--palette-text-primary) overflow-hidden overflow-y-auto max-md:h-[100vh] md:max-h-[calc(100vh-32px)] border border-[#919eab29] scrollbar-hide">
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#078dee] blur-[60px] opacity-[0.50] pointer-events-none z-0 rounded-full"></div>
                    <div
                      className={cn(
                        theme === "dark"
                          ? "shadow-[0_8px_32px_rgba(0,0,0,0.35),_inset_0_0px_0_rgba(255,255,255,0.25),_inset_0_-2px_6px_rgba(255,255,255,0.05)]"
                          : "shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
                        "px-4 pt-4 pb-[9px]",
                      )}
                    >
                      <h6 className="text-[0.875rem] font-semibold text-[var(--palette-text-primary)] truncate leading-[1.57143]">
                        {userName}
                      </h6>
                    </div>

                    <hr className="m-0 shrink-0 border-0 border-b border-dashed border-(--dotted-line)" />

                    <div className="flex flex-col gap-2 px-4 py-2.5">
                      <div className="rounded-[16px] shadow-[0_1px_2px_0_rgb(0_0_0_/_16%)] border-(--dropdown-balance-border) border-[1px]">
                        <div className="flex flex-col p-2 items-center cursor-pointer">
                          <p className="text-[0.875rem] leading-[1.25] text-(--secondary-text-color) font-[500] uppercase">
                            Balance
                          </p>
                          <p className="text-[1rem] font-semibold leading-[1.5]">
                            {hideBalance
                              ? "-"
                              : (
                                (userBalance?.bankBalance ?? 0) -
                                (userBalance?.exposure ?? 0)
                              ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="rounded-[16px] shadow-[0_1px_2px_0_rgb(0_0_0_/_16%)] border-(--dropdown-balance-border) border-[1px]">
                        <div className="flex flex-col p-2 items-center cursor-pointer">
                          <p className="text-[0.875rem] leading-[1.25] text-(--secondary-text-color) font-[500] uppercase">
                            Exposure
                          </p>
                          <p className="text-[1rem] font-semibold leading-[1.5]">
                            {userBalance?.exposure ?? 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <hr className="m-0 shrink-0 border-0 border-b border-dashed border-(--dotted-line)" />

                    {/* Links List */}
                    <ul className="my-2 px-2 flex flex-col">
                      {[
                        {
                          label: "Change Password",
                          href: "",
                          icon: "changepassword",
                        },
                        {
                          label: "Statement",
                          href: "/statement",
                          icon: "statement",
                        },
                        {
                          label: "Profit/Loss",
                          href: "/profit-loss",
                          icon: "profitloss",
                        },
                        {
                          label: "Bets History",
                          href: "/bets-history",
                          icon: "bethistory",
                        },
                        {
                          label: "Settings",
                          href: "/settings",
                          icon: "settings",
                        },
                        {
                          label: "Light",
                          href: "/activity",
                          icon: "activity",
                        },
                      ].map((item, index) => (
                        <li
                          key={index}
                          className="p-ripple mb-1 hover:bg-[rgba(145,158,171,0.08)] rounded-[8px]"
                        >
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
                            className="flex items-center justify-between w-full px-4 py-2 text-[0.875rem] text-[var(--dropdowntext)] hover:text-[var(--palette-text-primary)] transition-colors h-[34px]"
                          >
                            {/* Text + 5px space + Icon */}
                            <div className="flex items-center">
                              <span className="flex items-center">
                                <Icon name={item.icon} className="h-4 w-4" />
                              </span>
                                                            <span className="ml-[5px] ">{item.label}</span>

                            </div>
                            <Ripple
                              pt={{
                                root: {
                                  style: {
                                    background: "rgba(145, 158, 171, 0.4)",
                                  },
                                },
                              }}
                            />
                          </Link>
                        </li>
                      ))}
                      <hr className="m-0 shrink-0 border-0 p-0! my-2! border-b border-dashed border-(--dotted-line) max-md:hidden"></hr>

                      {/* Theme Option (Static Icon for now) */}
                      <li
                        onClick={() => {
                          setTheme(theme === "dark" ? "light" : "dark");
                        }}
                        className="p-ripple  mb-1 no-underline hidden md:block h-9.5 min-[600px]:h-auto text-[0.875rem] leading-[1.57143px] hover:bg-[rgba(145,158,171,0.08)] rounded-[8px]"
                      >
                        <div className="flex items-center justify-between w-full  text-[14px] text-[var(--dropdowntext)] hover:text-[var(--palette-text-primary)] hover:bg-white/5 transition-colors cursor-pointer">
                          <span className="ml-4">
                            {typeof window !== "undefined" &&
                              (localStorage.getItem("theme") === "dark"
                                ? "Light"
                                : "Dark")}{" "}
                          </span>
                          <span>
                            <ThemeToggle />
                          </span>
                        </div>
                        <Ripple
                          pt={{
                            root: {
                              style: { background: "rgba(145, 158, 171, 0.4)" },
                            },
                          }}
                        />
                      </li>

                      <li
                        className="p-ripple mb-1 no-underline  hidden md:block h-9.5 min-[600px]:h-auto text-[0.875rem] leading-[1.57143px] hover:bg-[rgba(145,158,171,0.08)] rounded-[8px]"
                        onClick={() => {
                          setIsMenuOpen(false);
                          router.push("/theme");
                        }}
                      >
                        <div className="flex items-center justify-between w-full  py-2 text-[14px] text-[var(--dropdowntext)] hover:text-[var(--palette-text-primary)] hover:bg-white/5 transition-colors cursor-pointer">
                          <span className="ml-4">Theme</span>
                          <span>
                            {theme === "dark" ? (
                              <Icon
                                name="themeSettingDark"
                                className="h-5 w-5 mr-2"
                              />
                            ) : (
                              <Icon
                                name="themeSettingLight"
                                className="h-5 w-5 mr-2"
                              />
                            )}
                          </span>
                        </div>
                        <Ripple
                          pt={{
                            root: {
                              style: { background: "rgba(145, 158, 171, 0.4)" },
                            },
                          }}
                        />
                      </li>
   
                      {/* Hide Balance Toggle */}

                                            <hr className="m-0 shrink-0 border-0 p-0! my-2! border-b border-dashed border-(--dotted-line) min-md:hidden"></hr>

                      <li
                        onClick={() => {
                          // Prevent menu from closing
                          setHideBalance(!hideBalance);
                        }}
                        className="p-ripple mb-1 no-underline h-9.5 min-[600px]:h-[44px] text-[0.875rem] leading-[1.57143px] flex items-center hover:bg-[rgba(145,158,171,0.08)] rounded-[8px]"
                      >
                        <div className="flex items-center justify-between w-full  text-[14px] text-[var(--dropdowntext)] hover:text-[var(--palette-text-primary)] transition-colors cursor-pointer">
                          <span className="ml-4">Hide Balance</span>
                          {/* Custom Tailwind Switch */}
                          <span className="w-[58px] h-[38px] flex justify-end items-center">
                            <div
                              className={`relative w-[34px] h-5 mr-[10px] rounded-full transition-colors ${hideBalance ? "bg-[#078dee]" : "bg-gray-600"}`}
                            >
                              <div
                                className={`absolute top-[3px] left-[3px] bg-white w-3.5 h-3.5 rounded-full transition-transform ${hideBalance ? "translate-x-[14px]" : "translate-x-0"}`}
                              ></div>
                            </div>
                          </span>
                        </div>
                        <Ripple
                          pt={{
                            root: {
                              style: { background: "rgba(145, 158, 171, 0.4)" },
                            },
                          }}
                        />
                      </li>
                    </ul>

                    <hr className="m-0 shrink-0 border-0 border-b border-dashed border-(--dotted-line) max-md:hidden" />

                    {/* Logout Button */}
                    <div className="p-2 relative hidden md:block">
                      {/* 👇 Ye optional background glow hai jo corner main red light dega (bilkul image jaisa) */}
                      <div className="absolute -bottom-4 hidden md:flex -left-4 w-20 h-20 bg-[#FF5630] blur-[30px] opacity-15 pointer-events-none"></div>

                      <button
                        onClick={handleLogout}
                        className="p-ripple relative z-10 w-full text-left px-2 py-2 text-[14px] font-bold text-(--dropdown-logout-color) hover:bg-(--dropdown-logout-bg-hover) rounded-lg transition-colors cursor-pointer "
                      >
                        Logout
                        <Ripple
                          pt={{
                            root: {
                              style: { background: "rgba(145, 158, 171, 0.4)" },
                            },
                          }}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex min-[960px]:hidden border-b-1  border-[#919eab14] relative overflow-hidden px-3">
          <hr className="m-0 shrink-0 border-0 border-t-[1px] border-dashed border-(--dotted-line) absolute top-0 left-0 w-full z-[9]" />

          <nav className="flex items-center gap-[8.5px] w-full lg:gap-4 font-bold --palette-text-primary  overflow-x-auto overflow-y-hidden scrollbar-hide h-[30px]">
            <Link
              href="/"
              className={cn(
                pathName !== "/live-casino" && "active text-(--primary-color)!",
                "flex py-1 relative pr-[4px] pl-1 items-center text-[13px] font-bold --palette-text-primary hover:--palette-text-primary  transition-colors group whitespace-nowrap",
              )}
            >
              {/* {pathName === "/" && (
              <div
                className="neon-underline none exch bottom-[5px]!"
              >
                <span className="neon-glow glow-main"></span>
                <span className="neon-line line-main"></span>

                <span className="neon-glow glow-center"></span>
                <span className="neon-line line-center"></span>
              </div>
            )} */}
              <span
                className={cn(
                  pathName !== "/live-casino" && "text-(--primary-color)!",
                  " group-hover:--palette-text-primary transition-colors mr-[4px] ",
                )}
              >
                <Icon name="exchange" className="h-4.5 w-4.5 " />
              </span>
              <span className="relative !top-[-0.5px] ml-[0.3px]">
                Exchange
              </span>
            </Link>

            <Link
              href="/live-casino"
              prefetch={false}
              className={cn(
                pathName === "/live-casino" && "active text-(--primary-color)",
                "flex py-1 pr-[4px] pl-[0.5px] items-center text-[13px] font-medium --palette-text-primary  hover:--palette-text-primary  transition-colors group whitespace-nowrap relative left-[3px] font-bold",
              )}
            >
              {/* {pathName === "/live-casino" && (
              <div className="neon-underline none casino bottom-[8px]!">
                <span className="neon-glow glow-main"></span>
                <span className="neon-line line-main"></span>

                <span className="neon-glow glow-center"></span>
                <span className="neon-line line-center"></span>
              </div>
            )} */}
              {/* Live Casino Icon */}
              <span
                className={cn(
                  pathName === "/live-casino" &&
                  "active text-(--primary-color)",
                  " group-hover:--palette-text-primary  transition-colors mr-[1.8px] ",
                )}
              >
                <Icon name="casino" className="h-6 w-6" />
              </span>
              <span className="relative !top-[-0.5px] font-bold">Casino</span>
            </Link>

            {/* <Link
            href="/slot"
            className="flex py-1 pr-[4px] pl-[2.8px] items-center justify-center min-w-[70px] text-[13px] font-medium --palette-text-primary  hover:--palette-text-primary  transition-colors whitespace-nowrap relative !left-[4px]"
          >
            <span className="mr-[3px] inline-block ">
              <Icon name="fancty" className="h-5 w-5" />
            </span>
            <span className="--palette-text-primary  font-bold relative !top-[-0.5px]">
              Fancty
            </span>
          </Link> */}

            {/* <Link
            href="/casinos/q-tech/aviator"
            className="flex py-1 pr-[4px] pl-[3.8px] items-center text-[13px] font-medium --palette-text-primary  hover:--palette-text-primary  transition-colors whitespace-nowrap"
          >
            <span className="mr-[3px] inline-block">
              <Icon name="sportbook" className="h-5 w-5" />
            </span>
            <span className="font-bold --palette-text-primary    relative !top-[-0.5px]">
              Sportbook
            </span>
          </Link> */}
          </nav>
        </div>
      </header>
    </div>
  );
}
