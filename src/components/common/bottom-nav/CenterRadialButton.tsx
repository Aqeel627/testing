

"use client";
import { useEffect, useRef, useState } from "react";
import Icon from "@/icons/icons";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const CenterRadialButton = () => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const el = containerRef.current;
      if (!el) return;

      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [open]);

  const rotations = [-60, -20, 20, 60];
  const radialIcons = ["theme", "whatsapp", "google", "facebook"];

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center pointer-events-none bottom-[-11px]"
    >
      <div className="relative w-12 h-12 mx-auto">
        {/* GLASS SEMI CIRCLE BACKGROUND */}
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 bottom-[64px] h-[125px] max-[360px]:h-[118px]  overflow-hidden transition-all duration-300",
            "w-[74vw] max-[405px]:w-[73vw] max-[390px]:w-[72vw] max-[375px]:w-[71vw] min-[426px]:w-[325px]",
            open ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
          )}
        >
          <div
            className={cn(
              "absolute left-1/2 top-0 w-full aspect-square -translate-x-1/2 rounded-full glass-radial  border",
              theme === "dark"
                ? "border-[rgba(255,255,255,0.25)]"
                : "border-[rgba(255,255,255,0.4)]"
            )}
            style={{ transformOrigin: "center top" }}
          />
        </div>

        {/* RADIAL ICONS */}
        {rotations.map((deg, i) => (
          <span
            key={i}
            className="absolute left-1/2 bottom-0  pointer-events-auto transition-transform duration-500"
            style={{
              transform: open
                ? `translateX(-50%) translateY(-22px) rotate(${deg}deg) translateY(-95px) rotate(${-deg}deg)`
                : `translateX(-50%) translateY(-22px)`,
              transitionDelay: open ? `${i * 0.08}s` : "0s",
            }}
          >
            {/* THEME TOGGLE (first / left icon) */}
            {radialIcons[i] === "theme" ? (
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "w-[50px] h-[50px] max-[355px]:w-[45px] max-[355px]:h-[45px] max-[330px]:h-[42px] rounded-full flex items-center justify-center glass backdrop-blur-[20px] border shadow-lg transition-opacity duration-300",
                  open ? "opacity-100" : "opacity-0",
                  theme === "dark"
                    ? "border-[rgba(255,255,255,0.25)]"
                    : "border-[rgba(255,255,255,0.4)]"
                )}
              >
                {theme === "dark" ? (
                  <Icon name="moon" width={22} height={22} />
                ) : (
                  <img
                    src="/sun.svg"
                    alt="sun"
                    className="w-[22px] h-[22px]"
                    style={{
                      filter:
                        "invert(67%) sepia(9%) saturate(354%) hue-rotate(174deg) brightness(70%) contrast(87%)",
                    }}
                  />
                )}
              </button>
            ) : (
              <div
                className={cn(
                  "w-[50px] h-[50px] max-[355px]:w-[45px] max-[355px]:h-[45px] rounded-full flex items-center justify-center glass backdrop-blur-[20px] border shadow-lg transition-opacity duration-300",
                  open ? "opacity-100" : "opacity-0",
                  theme === "dark"
                    ? "border-[rgba(255,255,255,0.25)]"
                    : "border-[rgba(255,255,255,0.4)]"
                )}
              >
                <Icon name={radialIcons[i]} width={22} height={22} />
              </div>
            )}
          </span>
        ))}

        {/* CENTER BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "absolute left-1/2 bottom-0 w-12 h-12 rounded-full pointer-events-auto z-10 flex items-center justify-center transition-all duration-300 glass backdrop-blur-[25px] border shadow-[0_8px_25px_rgba(0,0,0,0.25)]",
            theme === "dark"
              ? "border-[rgba(255,255,255,0.3)]"
              : "border-[rgba(255,255,255,0.4)]"
          )}
          style={{ transform: "translateX(-50%) translateY(-11px)" }}
        >
          <span className="text-[30px] font-medium transition-transform duration-300 relative bottom-[2px]">
            {open ? "×" : "+"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default CenterRadialButton;