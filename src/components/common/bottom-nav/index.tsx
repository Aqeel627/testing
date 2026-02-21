"use client";
import { useAuthStore } from "@/lib/useAuthStore";
import Icon from "@/icons/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTheme } from "next-themes";
import React, { Fragment, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import CenterRadialButton from "@/components/common/bottom-nav/CenterRadialButton";
import { useMiniCasinoStore } from "@/lib/store/miniCasinoStore";
import { useCacheStore } from "@/lib/store/cacheStore";

const BottomNavbar = () => {
  const [isSafari, setIsSafari] = useState(false);

  const pathName = usePathname();
  const { theme } = useTheme();

  const { isLoggedIn } = useAuthStore();
const { setLoginModal } = useCacheStore();
const { isOpen, open, close } = useMiniCasinoStore();

  const items = [
    { icon: "house", link: "/" },
    { icon: "inplay", link: "/inplay" },
        { icon: "bets", link: "#" },
    { icon: "casinoic", link: "#" },

  ];

  useEffect(() => {
    const userAgent = navigator.userAgent;

    const safari =
      userAgent.includes("Safari") &&
      !userAgent.includes("Chrome") &&
      !userAgent.includes("Chromium");

    setIsSafari(safari);
  }, []);

  return (
    <div
      className={cn(
        "md:hidden z-[40] fixed border shadow-[0_8px_32px_rgba(0,0,0,0.2)]! bottom-5 left-1/2 -translate-x-1/2 px-2 py-2 w-[84%] flex justify-around items-center rounded-full glass-blur h-15",
        theme === "dark"
          ? "border-[rgba(255,255,255,0.3)]"
          : "border-[rgb(205,192,192,0.5)] bg-[linear-gradient(135deg,rgba(255,255,255,0.25),rgba(255,255,255,0.05))]! backdrop-blur-[20px]!",
        isSafari ? "bottom-2" : "bottom-5",
      )}
    >
      {items.map((item, idx) => (
        <Fragment key={idx}>
          {idx === 2 && <CenterRadialButton />}

          <Link
            href={item.link}
onClick={(e) => {
  if (item.icon === "casinoic") {
    e.preventDefault();

    if (!isLoggedIn) {
      setLoginModal(true);
      return;
    }

    if (isOpen) {
      close();
    } else {
      open();
    }
  }
}}
            className={cn(
              "h-12 w-12 flex border justify-center items-center glass rounded-full",
              pathName === item?.link
                ? "bg-(--nav-item-root-active-bg)! text-(--nav-item-root-active-color)"
                : "bg-(--IconButton-hoverBg)",
              theme === "dark"
                ? "border-[rgba(255,255,255,0.3)]"
                : "border-[rgb(205,192,192,0.5)]"
            )}
          >
            <Icon name={item.icon} width={25} height={25} />
          </Link>
        </Fragment>
      ))}
    </div>
  );
};

export default BottomNavbar;