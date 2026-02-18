"use client";
import Icon from "@/icons/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTheme } from "next-themes";
import React, { Fragment, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const BottomNavbar = () => {
  const [isSafari, setIsSafari] = useState(false);

  const pathName = usePathname();
  const { theme, setTheme } = useTheme();
  const items = [
    { icon: "house", link: "/" },
    { icon: "inplay", link: "/inplay" },
    { icon: "theme" },
    { icon: "exchange", link: "#" },
    { icon: "casino", link: "#" },
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
        "md:hidden fixed border shadow-[0_8px_32px_rgba(0,0,0,0.2)]! bottom-5 left-1/2 -translate-x-1/2 px-2 py-2 gap-2 max-w-[85%] flex justify-center items-center rounded-full glass h-15",
        theme === "dark"
          ? "border-[rgba(255,255,255,0.3)]"
          : "border-[rgb(205,192,192,0.5)] bg-[linear-gradient(135deg,rgba(255,255,255,0.25),rgba(255,255,255,0.05))]! backdrop-blur-[20px]!",
        isSafari ? "bottom-2" : "bottom-5",
      )}
    >
      {items?.map((item, idx) => (
        <Fragment key={idx}>
          {item?.link ? (
            <Link
              href={item.link}
              className={cn(
                "h-12 w-12 flex border border-[rgba(255,255,255,0.3)] justify-center items-center glass rounded-full",
                pathName === item?.link
                  ? "bg-(--nav-item-root-active-bg)! text-(--nav-item-root-active-color)"
                  : "bg-(--IconButton-hoverBg)",
                theme === "dark"
                  ? "border-[rgba(255,255,255,0.3)]"
                  : "border-[rgb(205,192,192,0.5)]",
              )}
            >
              <Icon name={item.icon} width={25} height={25} />
            </Link>
          ) : (
            <div
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={cn(
                "h-12 w-12 border border-[rgba(255,255,255,0.3)] flex justify-center items-center glass rounded-full bg-(--IconButton-hoverBg)",
                theme === "dark"
                  ? "border-[rgba(255,255,255,0.3)]"
                  : "border-[rgb(205,192,192,0.5)]",
              )}
            >
              {theme === "dark" ? (
                <Icon
                  name="moon"
                  width={25}
                  height={25}
                  className="transition-transform"
                />
              ) : (
                <img
                  src="/sun.svg"
                  alt="sun"
                  className="w-6.25 h-6.25 transition-transform"
                  style={{
                    filter:
                      "invert(67%) sepia(9%) saturate(354%) hue-rotate(174deg) brightness(70%) contrast(87%)",
                  }}
                />
              )}
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default BottomNavbar;
