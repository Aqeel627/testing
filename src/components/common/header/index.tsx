"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./headerPage.module.css";
import Icon from "@/icons/icons";
import { useEffect, useState } from "react";
import { CONFIG } from "@/lib/config";
import { useAppStore } from "@/lib/store/store";
import { fetchData } from "@/lib/functions";
import { useAuthStore } from "@/lib/store/authStore";
import { ThemeToggle } from "../theme-toggler";

type HeaderProps = {
  onMenuClick?: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  // New state for checkbox toggles - default true
  const [showBalance, setShowBalance] = useState(true);
  const [showExposure, setShowExposure] = useState(true);
  const { userBalance, setUserBalance } = useAppStore();
  const { isLoggedIn } = useAuthStore();

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

  return (
    <header className="w-full   text-white sticky top-0 z-50 bg-[rgba(20,26,33,96%)]">
      <div className="max-w-[1600px] mx-auto px-2 h-12 flex items-center justify-between">
        {/* 👇 Left: Hamburger & Logo */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="text-gray-400 hover:text-white transition-colors p-1 cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <Icon name="logo" className="h-6 w-6" />
          </button>
          <Link
            href="/"
            className="font-[inherit]  no-underline shrink-0 text-transparent inline-flex h-[44px] w-[152px] cursor-pointer"
          >
            <Image
              src="/brand_logo_dark.png"
              alt="AuExch Logo"
              fill
              className="object-contain relative! mx-1 "
            />
          </Link>
        </div>

        <nav className="hidden min-[960px]:flex items-center gap-2 font-bold text-white relative left-[3px]">
          <Link
            href="/"
            className="flex p-1 items-center text-[13px] font-bold text-white hover:text-white transition-colors group"
          >
            <span className=" group-hover:text-white transition-colors mr-[2px]">
              <Icon name="exchange" className="h-6 w-6" />
            </span>
            <span className="relative top-[-0.5px]">Exchange</span>
          </Link>

          <Link
            href="/live-casino"
            className="flex p-1 items-center text-[13px] text-white hover:text-white transition-colors group relative left-[2px] font-bold"
          >
            {/* Live Casino Icon */}
            <span className=" group-hover:text-white transition-colors mr-[2px]">
              <Icon name="casino" className="h-6 w-6" />
            </span>
            <span className="relative top-[-0.5px]">Casino</span>
          </Link>

          <Link
            href="/casinos/q-tech/aviator"
            className="flex p-1 items-center text-[13px] font-medium text-white hover:text-white transition-colors relative left-[0.5px]"
          >
            <span className=" group-hover:text-white transition-colors mr-[2px]">
              <Icon name="aviator" className="h-8 w-8" />
            </span>
            <span className="font-bold text-white relative top-[-0.5px]">
              Sportbook
            </span>
          </Link>

          <Link
            href="/slot"
            className="flex p-1 items-center justify-center text-[13px] font-bold text-white hover:text-white transition-colors w-[70px] relative left-[3px]"
          >
            <span className=" group-hover:text-white transition-colors mr-[2px]">
              <Icon name="slot" className="h-5 w-5" />
            </span>
            <span className="text-white font-bold relative top-[-0.5px]">
              Fancty
            </span>
          </Link>


        </nav>

        <div className="flex items-center gap-2 sm:gap-[10px]">
          <ThemeToggle />

          <Link
            href="/login"
            className="text-sm leading-[1.71429] [text-transform:unset] min-w-16 py-[5px] px-3 flex justify-center items-center text-sm border-1 border-[#919eab52] rounded-[8px] text-white  font-bold transition-all duration-300 mr-1"
          >
            Login
          </Link>
        </div>
      </div>

      <div className="flex min-[960px]:hidden border-b-1  border-[#919eab14] relative overflow-hidden px-3">
        <hr className="m-0 shrink-0 border-0 border-t-[1px] border-dashed border-[#919eab33] absolute top-0 left-0 w-full z-[9]" />

        <nav className="flex items-center gap-[8.5px] w-full lg:gap-4 font-bold text-white overflow-x-auto overflow-y-hidden scrollbar-hide h-[30px]">
          <Link
            href="/"
            className="flex py-1 pr-[4px] pl-1 items-center text-[13px] font-bold text-white hover:text-white transition-colors group whitespace-nowrap"
          >
            <span className=" group-hover:text-white transition-colors mr-[2px] ml-[-1px]">
              <Icon name="exchange" className="h-6 w-6" />
            </span>
            <span className="relative !top-[-0.5px] ml-[0.3px]">Exchange</span>
          </Link>

          <Link
            href="/live-casino"
            className="flex py-1 pr-[4px] pl-[0.5px] items-center text-[13px] font-medium text-white hover:text-white transition-colors group whitespace-nowrap relative left-[3px] font-bold"
          >
            {/* Live Casino Icon */}
            <span className=" group-hover:text-white transition-colors mr-[1.8px] ">
              <Icon name="casino" className="h-6 w-6" />
            </span>
            <span className="relative !top-[-0.5px] font-bold">
              Casino
            </span>
          </Link>

          <Link
            href="/casinos/q-tech/aviator"
            className="flex py-1 pr-[4px] pl-[3.8px] items-center text-[13px] font-medium text-white hover:text-white transition-colors whitespace-nowrap"
          >
            <span className="mr-[2px] ">
              <Icon name="aviator" className="h-8 w-8" />
            </span>
            <span className="font-bold text-white   relative !top-[-0.5px]">
              Sportbook
            </span>
          </Link>


          <Link
            href="/slot"
            className="flex py-1 pr-[4px] pl-[2.8px] items-center justify-center min-w-[70px] text-[13px] font-medium text-white hover:text-white transition-colors whitespace-nowrap relative !left-[4px]"
          >
            <span className="mr-[2px] ">
              <Icon name="slot" className="h-5 w-5" />
            </span>
            <span className="text-white font-bold relative !top-[-0.5px]">
              Fancty
            </span>
          </Link>


        </nav>
      </div>
    </header>
  );
}