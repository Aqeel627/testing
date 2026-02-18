"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./headerPage.module.css";
import Icon from "@/icons/icons";
import { useEffect, useRef, useState } from "react";
import { CONFIG } from "@/lib/config";
import { useAppStore } from "@/lib/store/store";
import { fetchData } from "@/lib/functions";
import { useAuthStore } from "@/lib/store/authStore";
import { ThemeToggle } from "../theme-toggler";
import { useTheme } from "next-themes";

type HeaderProps = {
  onMenuClick?: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  // New state for checkbox toggles - default true
  const [showBalance, setShowBalance] = useState(true);
  const [showExposure, setShowExposure] = useState(true);
  const { userBalance, setUserBalance } = useAppStore();
  // const { isLoggedIn } = useAuthStore();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { resolvedTheme } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [hideBalance, setHideBalance] = useState(false);

  //   useEffect(() => {
  //   console.log("isLoggedIn:", isLoggedIn);
  // }, [isLoggedIn]);

  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (accessToken) {
      fetchData({
        url: CONFIG.getUserBalance,
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        setFn: setUserBalance,
      });
    }
  }, [accessToken]);

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

  return (
    <header className="w-full   --palette-text-primary  sticky top-0 z-50 ">
      <div className="max-w-[1600px] mx-auto px-2 h-12 flex items-center justify-between">
        {/* 👇 Left: Hamburger & Logo */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="text-[#637381]  dark:text-gray-400  transition-colors p-1 cursor-pointer rounded-full hover:scale-[1.04] hover:bg-[rgba(145,158,171,0.08)]"
            aria-label="Toggle sidebar"
          >
            <Icon name="logo" className="h-6 w-6" />
          </button>
          <Link
            href="/"
            className="font-[inherit]  no-underline shrink-0 text-transparent inline-flex h-[44px] w-[152px] cursor-pointer"
          >
            <Image
              src={
                resolvedTheme === "light"
                  ? "/brand_logo_light.png"
                  : "/brand_logo_dark.png"
              }
              alt="AuExch Logo"
              fill
              className="object-contain relative! mx-1 "
            />
          </Link>
        </div>

        <nav className="hidden min-[960px]:flex items-center gap-2 font-bold --palette-text-primary  relative left-[3px]">
          <Link
            href="/"
            className="flex p-1 items-center text-[13px] font-bold --palette-text-primary  hover:--palette-text-primary  transition-colors group rounded-lg  hover:bg-[rgba(145,158,171,0.08)] "
          >
            <span className=" group-hover:--palette-text-primary  transition-colors mr-[2px] ">
              <Icon name="exchange" className="h-6 w-6" />
            </span>
            <span className="relative top-[-0.5px]">Exchange</span>
          </Link>

          <Link
            href="/live-casino"
            className="flex p-1 items-center text-[13px] --palette-text-primary  hover:--palette-text-primary  transition-colors group relative left-[2px] font-bold rounded-lg  hover:bg-[rgba(145,158,171,0.08)] "
          >
            {/* Live Casino Icon */}
            <span className=" group-hover:--palette-text-primary  transition-colors mr-[2px]">
              <Icon name="casino" className="h-6 w-6" />
            </span>
            <span className="relative top-[-0.5px]">Casino</span>
          </Link>

          <Link
            href="/casinos/q-tech/aviator"
            className="flex p-1 items-center text-[13px] font-medium --palette-text-primary  hover:--palette-text-primary  transition-colors relative left-[0.5px] rounded-lg  hover:bg-[rgba(145,158,171,0.08)] "
          >
            <span className=" group-hover:--palette-text-primary  transition-colors mr-[3px] inline-block">
              <Icon name="sportbook" className="h-4 w-4" />
            </span>
            <span className="font-bold --palette-text-primary  relative top-[-0.5px]">
              Sportbook
            </span>
          </Link>

          <Link
            href="/slot"
            className="flex p-1 items-center justify-center text-[13px] font-bold --palette-text-primary  hover:--palette-text-primary  transition-colors w-[70px] relative left-[3px] rounded-lg  hover:bg-[rgba(145,158,171,0.08)] "
          >
            <span className=" group-hover:--palette-text-primary  transition-colors mr-[3px] inline-block">
              <Icon name="fancty" className="h-4 w-4" />
            </span>
            <span className="--palette-text-primary  font-bold relative top-[-0.5px]">
              Fancty
            </span>
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-[6px]">

          {isLoggedIn && (
            <Link href="" className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-sans font-bold leading-[1.71429] normal-case min-w-[64px] text-[0.8125rem] h-[30px] outline-none m-0 no-underline rounded-lg border border-solid py-[3px] px-1 min-[600px]:px-[8px] transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] bg-transparent text-[#078DEE] border-[#078dee7a] hover:bg-blue-600/5">
              Bets
            </Link>
          )}

          <ThemeToggle />
          {!isLoggedIn && (
            <Link
              href="/login"
              className="text-sm leading-[1.71429] [text-transform:unset] min-w-16 py-[5px] px-3 flex justify-center items-center text-sm border-1 border-[#919eab52] rounded-[8px] --palette-text-primary  rounded-lg  hover:bg-[rgba(145,158,171,0.08)]   font-bold transition-all duration-300 mr-1"
            >
              Login
            </Link>
          )}
          {isLoggedIn && (
            <div className="flex items-center gap-2 ref={menuRef}">
              <div onClick={() => setIsMenuOpen(!isMenuOpen)} className="relative inline-flex items-center justify-center rounded-[8px] p-[1px] overflow-hidden bg-transparent group cursor-pointer max-w-16">
                <span className="absolute inset-0 m-auto w-full h-full rounded-[inherit] content-[''] pointer-events-none 
        [mask:linear-gradient(#fff_0_0)_content-box_xor,linear-gradient(#fff_0_0)] 
        -webkit-[mask:linear-gradient(#fff_0_0)_content-box_xor,linear-gradient(#fff_0_0)]">
                  <span className="absolute inset-0 bg-white/10 opacity-20"></span>

                  {/* 👇 Dono shapes with exact colors */}
                  <span className={`${styles.movingShape} ${styles.shapeGold}`}></span>
                  <span className={`${styles.movingShape} ${styles.shapeBlue}`}></span>
                </span>
                <button className="relative z-10 flex flex-col items-center justify-center px-4 py-1 bg-[#161C24] dark:bg-[#161C24] rounded-[7px] w-full h-full min-w-[64px]">

                  <span className="text-[0.6rem] text-[#919EAB] font-semibold leading-[1] uppercase tracking-wide">
                    Pts
                  </span>
                  <span className="text-[12px] text-white font-bold leading-[1]">
                    1
                  </span>
                </button>

              </div>

              {isMenuOpen && (
                <div className="absolute top-[80%] right-0 w-[250px]! bg-[#212B36] border border-gray-700/50 rounded-xl shadow-[0_8px_16px_rgba(0,0,0,0.5)] z-50 overflow-hidden flex flex-col">
                  <div className="px-4 pt-4 pb-2">
                    <h6 className="text-[0.875rem] font-semibold text-white truncate leading-[1.57143]">demo1</h6>
                    <p className="text-[0.875rem] leading-[1.57143] text-[#919EAB] truncate">demo1</p>
                  </div>

                  <hr className="m-0 shrink-0 border-0 border-b border-dashed border-[#919eab33]" />

                  <div className="flex flex-col gap-2 px-4 pb-4 pt-2">
                    <div className="rounded-[16px] shadow-[0_1px_2px_0_rgb(0_0_0_/_16%)] border-[#919eab29] border-[1px]">
                      <div className="flex flex-col p-2 items-center cursor-pointer">
                        <p className="text-[0.875rem] leading-[1.25] text-[#919EAB] font-bold uppercase">Exposure</p>
                        <p className="text-[1rem] text-white font-semibold leading-[1.5]">0</p>
                      </div>
                    </div>
                    <div className="rounded-[16px] shadow-[0_1px_2px_0_rgb(0_0_0_/_16%)] border-[#919eab29] border-[1px]">
                      <div className="flex flex-col p-2 items-center cursor-pointer">
                        <p className="text-[0.875rem] leading-[1.25] text-[#919EAB] font-bold uppercase">Balance</p>
                        <p className="text-[1rem] text-white font-semibold leading-[1.5]">{hideBalance ? "***" : "1"}</p>
                      </div>
                    </div>
                  </div>

                  <hr className="m-0 shrink-0 border-0 border-b border-dashed border-[#919eab33]" />

                  {/* Links List */}
                  <ul className="my-2 px-2 flex flex-col">
                    {[
                      { label: "Statement", href: "/account/statement" },
                      { label: "Settings", href: "/account/settings/login" },
                      { label: "Activity", href: "/account/activity" },
                      { label: "Bet Buttons", href: "/account/settings/bet-buttons" },
                      { label: "Rules", href: "/exchange/betting-rules/sports-rules" },
                    ].map((item, index) => (
                      <li key={index} className="mb-1 hover:bg-transparent no-underline h-12 min-[600px]:h-auto text-[0.875rem] leading-[1.57143px]">
                        <Link
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center w-full px-2 py-2 text-[0.875rem] leading-[1.57143px] text-white hover:bg-transparent transition-colors h-[34px]"
                        >
                          <span className="ml-4">{item.label}</span>
                        </Link>
                      </li>
                    ))}

                    {/* Theme Option (Static Icon for now) */}
                    <li className="mb-1 hover:bg-transparent no-underline h-12 min-[600px]:h-auto text-[0.875rem] leading-[1.57143px]">
                      <div className="flex items-center justify-between w-full px-2 text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                        <span className="ml-4">Theme</span>
                        {/* Placeholder Icon */}
                        <ThemeToggle />
                      </div>
                    </li>

                    {/* Hide Balance Toggle */}
                    <li className="mb-1 hover:bg-transparent no-underline h-12 min-[600px]:h-[44px] text-[0.875rem] leading-[1.57143px] flex items-center">
                      <div className="flex items-center justify-between w-full px-2 text-[14px] text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent menu from closing
                          setHideBalance(!hideBalance);
                        }}
                      >
                        <span className="ml-4">Hide Balance</span>
                        {/* Custom Tailwind Switch */}
                        <span className="w-[58px] h-[38px] flex justify-end items-center">
                          <div className={`relative w-[34px] h-5 mr-[10px] rounded-full transition-colors ${hideBalance ? 'bg-[#FF5630]' : 'bg-gray-600'}`}>
                            <div className={`absolute top-[3px] left-[3px] bg-white w-3.5 h-3.5 rounded-full transition-transform ${hideBalance ? 'translate-x-4' : 'translate-x-0'}`}></div>
                          </div>
                        </span>
                      </div>
                    </li>
                  </ul>

                  <hr className="m-0 shrink-0 border-0 border-b border-dashed border-[#919eab33]" />

                  {/* Logout Button */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setIsLoggedIn(false);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-2 text-[14px] font-bold text-[#FF5630] hover:bg-[#FF5630]/10 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>

                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <div className="flex min-[960px]:hidden border-b-1  border-[#919eab14] relative overflow-hidden px-3">
        <hr className="m-0 shrink-0 border-0 border-t-[1px] border-dashed border-[#919eab33] absolute top-0 left-0 w-full z-[9]" />

        <nav className="flex items-center gap-[8.5px] w-full lg:gap-4 font-bold --palette-text-primary  overflow-x-auto overflow-y-hidden scrollbar-hide h-[30px]">
          <Link
            href="/"
            className="flex py-1 pr-[4px] pl-1 items-center text-[13px] font-bold --palette-text-primary  hover:--palette-text-primary  transition-colors group whitespace-nowrap"
          >
            <span className=" group-hover:--palette-text-primary  transition-colors mr-[2px] ml-[-1px]">
              <Icon name="exchange" className="h-6 w-6" />
            </span>
            <span className="relative !top-[-0.5px] ml-[0.3px]">Exchange</span>
          </Link>

          <Link
            href="/live-casino"
            className="flex py-1 pr-[4px] pl-[0.5px] items-center text-[13px] font-medium --palette-text-primary  hover:--palette-text-primary  transition-colors group whitespace-nowrap relative left-[3px] font-bold"
          >
            {/* Live Casino Icon */}
            <span className=" group-hover:--palette-text-primary  transition-colors mr-[1.8px] ">
              <Icon name="casino" className="h-6 w-6" />
            </span>
            <span className="relative !top-[-0.5px] font-bold">Casino</span>
          </Link>

          <Link
            href="/slot"
            className="flex py-1 pr-[4px] pl-[2.8px] items-center justify-center min-w-[70px] text-[13px] font-medium --palette-text-primary  hover:--palette-text-primary  transition-colors whitespace-nowrap relative !left-[4px]"
          >
            <span className="mr-[3px] inline-block ">
              <Icon name="fancty" className="h-5 w-5" />
            </span>
            <span className="--palette-text-primary  font-bold relative !top-[-0.5px]">
              Fancty
            </span>
          </Link>

          <Link
            href="/casinos/q-tech/aviator"
            className="flex py-1 pr-[4px] pl-[3.8px] items-center text-[13px] font-medium --palette-text-primary  hover:--palette-text-primary  transition-colors whitespace-nowrap"
          >
            <span className="mr-[3px] inline-block">
              <Icon name="sportbook" className="h-5 w-5" />
            </span>
            <span className="font-bold --palette-text-primary    relative !top-[-0.5px]">
              Sportbook
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
