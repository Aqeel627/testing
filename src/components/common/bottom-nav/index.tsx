"use client";
import Icon from "@/icons/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTheme } from "next-themes";
import React, { Fragment, useState } from "react";
import { usePathname } from "next/navigation";

const BottomNavbar = () => {
  const pathName = usePathname();
  const { theme, setTheme } = useTheme();
  const items = [
    { icon: "house", link: "/" },
    { icon: "inplay", link: "/inplay" },
    { icon: "theme" },
    { icon: "exchange", link: "#" },
    { icon: "casino", link: "#" },
  ];
  return (
    <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 px-2 py-2 gap-2 max-w-md flex justify-center items-center rounded-full glass h-15">
      {items?.map((item, idx) => (
        <Fragment key={idx}>
          {item?.link ? (
            <Link
              href={item.link}
              className={cn(
                "h-12 w-12 flex justify-center items-center glass rounded-full",
                pathName === item?.link
                  ? "bg-(--nav-item-root-active-bg)! text-(--nav-item-root-active-color)"
                  : "bg-(--IconButton-hoverBg)",
              )}
            >
              <Icon name={item.icon} width={25} height={25} />
            </Link>
          ) : (
            <div
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-12 w-12 flex justify-center items-center glass rounded-full bg-(--IconButton-hoverBg)"
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
