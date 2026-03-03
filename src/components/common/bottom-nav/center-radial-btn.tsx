"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import "./custome-style.css";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Icon from "@/icons/icons";
import { useAuthStore } from "@/lib/useAuthStore";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const rad2deg = (r: number) => (r * 180) / Math.PI;

const CenterRadialButton = () => {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const containerRef = useRef<HTMLDivElement>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const arcCircleRef = useRef<HTMLDivElement>(null);
  const sampleIconRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const { logout } = useAuthStore();


  const [vw, setVw] = useState<number>(0);

  // your fixed 425px transforms (DO NOT TOUCH)
  const rotations = [-60, -20, 20, 60] as const;
  const radialIcons = ["theme", "themeSetting", "stake", "powerOff"] as const;

  const xPerc425 = [-65, -57, -50, -35] as const;
  const y425 = [-32.75, -25.75, -25.75, -31.75] as const;
  const r425 = 95.5;

  // <425px computed layout
  const [small, setSmall] = useState<{
    dx: number;
    baseY: number;
    rCenter: number;
    angles: number[];
  }>({
    dx: 0,
    baseY: -22,
    rCenter: 95,
    angles: [-60, -20, 20, 60],
  });

  // viewport tracker
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // outside click
  useEffect(() => {
    if (!open) return;

    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const el = containerRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [open]);

  // compute only for small screens (<425)
  useEffect(() => {
    // lock 425 -> 767 exactly to your DOM values
    const useFixed425To767 = vw >= 425 && vw <= 767;
    if (useFixed425To767) return;

    const root = rootRef.current;
    const arc = arcCircleRef.current;
    const icon = sampleIconRef.current;
    if (!root || !arc || !icon) return;

    const compute = () => {
      const rootRect = root.getBoundingClientRect();
      const arcRect = arc.getBoundingClientRect();

      const arcRadius = arc.offsetWidth / 2;
      const iconDiameter = icon.offsetWidth;
      const iconRadius = iconDiameter / 2;

      // make icon-orbit concentric with the arc circle
      const arcCenterX = arcRect.left + arcRect.width / 2;
      const arcCenterY = arcRect.top + arcRect.height / 2;

      const rootCenterX = rootRect.left + rootRect.width / 2;
      const baselineY = rootRect.bottom;

      const dx = arcCenterX - rootCenterX;

      // translateY so "icon center at rest" aligns to arc center
      const iconCenterRestY = baselineY - iconRadius;
      const baseY = arcCenterY - iconCenterRestY;

      // desired gap: <=20 always, on small screens becomes 10-15ish
      // (scale it down from 20 by arc size)
      const ARC_REF_WIDTH = 325; // matches your min-[426px]:w-[325px]
      const scale = clamp(arc.offsetWidth / ARC_REF_WIDTH, 0, 1);
      let gap = clamp(20 * scale, 10, 20);

      // radius for icon centers so border gap == gap
      let rCenter = arcRadius - iconRadius - gap;

      // Now make icon-to-icon gap equal to SAME gap:
      // need chord >= iconDiameter + gap
      // chord = 2*rCenter*sin(step/2)  (step = angle between adjacent icons)
      // also keep 4 icons in top half: max step is 60deg (since angles are [-1.5s, -0.5s, 0.5s, 1.5s])
      const maxStepDeg = 60;
      const baseStepDeg = 40; // your 425 step

      // if too tight, reduce gap (but never below 10) so it can fit
      for (let tries = 0; tries < 20; tries++) {
        rCenter = arcRadius - iconRadius - gap;

        const needed = iconDiameter + gap;
        const ratio = needed / (2 * rCenter);

        if (rCenter > 0 && ratio > 0 && ratio < 1) {
          const stepDeg = rad2deg(2 * Math.asin(ratio));
          if (stepDeg <= maxStepDeg) break;
        }

        gap = Math.max(10, gap - 1);
        if (gap === 10) break;
      }

      rCenter = arcRadius - iconRadius - gap;

      // final step (>=40 so it doesn't get tighter than your 425 look)
      const needed = iconDiameter + gap;
      const ratio = clamp(needed / (2 * Math.max(1, rCenter)), 0, 0.999);
      const requiredStepDeg = rad2deg(2 * Math.asin(ratio));

      const stepDeg = clamp(
        Math.max(baseStepDeg, requiredStepDeg),
        baseStepDeg,
        maxStepDeg,
      );

      const angles = [
        -1.5 * stepDeg,
        -0.5 * stepDeg,
        0.5 * stepDeg,
        1.5 * stepDeg,
      ];

      setSmall({ dx, baseY, rCenter, angles });
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(root);
    ro.observe(arc);
    ro.observe(icon);

    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [vw]);

  const handleIconAction = (iconName: string) => {
    setOpen(false);
    if (iconName === "themeSetting") {
      router.push("/theme");
    } else if (iconName === "stake") {
      router.push("/settings");
    } else if (iconName === "powerOff") {
    logout();
    router.push("/");
    }
  };

  const useFixed425To767 = vw >= 425 && vw <= 767;

  return (
    <div id="centerRadialButton.tsx">
    <div
      ref={containerRef}
      className="relative flex items-center justify-center pointer-events-none bottom-[-11px]"
    >
      <div ref={rootRef} className="relative w-12 h-12 mx-auto">
        {/* GLASS SEMI CIRCLE BACKGROUND */}
        <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 bottom-[64px] h-[125px] max-[360px]:h-[118px] overflow-hidden transition-all duration-300",
            "w-[74vw] max-[405px]:w-[73vw] max-[390px]:w-[72vw] max-[375px]:w-[71vw] min-[426px]:w-[325px]",
            open
              ? "opacity-100 scale-100 visible"
              : "opacity-0 scale-95 invisible",
          )}
        >
          <div
            ref={arcCircleRef}
            className={cn(
              "absolute left-1/2 top-0 w-full aspect-square -translate-x-1/2 rounded-full glass-radial border",
              theme !== "dark" && "light-radial",
              theme === "dark"
                ? "border-[rgba(255,255,255,0.25)]"
                : "border-[rgba(255,255,255,0.4)]",
            )}
            style={{ transformOrigin: "center top" }}
          />
        </div>

        {/* RADIAL ICONS */}
        {rotations.map((deg, i) => {
          const transformOpen = useFixed425To767
            ? // EXACT 425px values (no change from 425 to 767)
            `translateX(calc(${xPerc425[i]}% + 0px)) translateY(${y425[i]}px) rotate(${deg}deg) translateY(-${r425}px) rotate(${-deg}deg)`
            : // <425px: border gap == icon gap == (10..20px)
            `translateX(calc(-50% + ${small.dx}px)) translateY(${small.baseY}px) rotate(${small.angles[i]}deg) translateY(-${small.rCenter}px) rotate(${-small.angles[i]}deg)`;
          const iconName =
            radialIcons[i] === "stake"
              ? theme === "light"
                ? "stakeLight"
                : "stakeDark"
              : radialIcons[i] === "themeSetting"
                ? theme === "light"
                  ? "themeSettingLight"
                  : "themeSettingDark"
                : radialIcons[i];
          const iconClass = `icon-${iconName}`;
          return (
            <span
              key={i}
              // className="absolute left-1/2 bottom-0 pointer-events-auto transition-transform duration-500"
              className={`absolute left-1/2 bottom-0 pointer-events-auto transition-transform duration-500 radial-icon ${iconClass}`}
              style={{
                transform: open
                  ? transformOpen
                  : `translateX(-50%) translateY(-22px)`,
                transitionDelay: open ? `${i * 0.08}s` : "0s",
              }}
            >
              {radialIcons[i] === "theme" ? (
                <button
                  ref={sampleIconRef}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setTheme(theme === "dark" ? "light" : "dark");
                  }}
                  className={cn(
                    "c333 w-[50px] h-[50px] max-[355px]:w-[45px] max-[355px]:h-[45px] max-[330px]:h-[42px] rounded-full flex items-center justify-center  btn-glass backdrop-blur-[20px] border shadow-lg transition-opacity duration-300",
                    open ? "opacity-100" : "opacity-0",
                    theme === "dark"
                      ? "border-[rgba(255,255,255,0.25)]"
                      : "border-[rgba(255,255,255,0.4)]",
                  )}
                >
                  {theme === "dark" ? (
                    <Icon name="moon" width={22} height={22} />
                  ) : (
                    <Icon name="moonOutline" width={22} height={22} />
                  )}
                </button>
              ) : (
                <div
                  onClick={() => handleIconAction(radialIcons[i])}
                  className={cn(
                    "w-[50px] h-[50px] max-[355px]:w-[45px] max-[355px]:h-[45px] rounded-full flex items-center justify-center btn-glass backdrop-blur-[20px] border shadow-lg transition-opacity duration-300",
                    open ? "opacity-100" : "opacity-0",
                    theme === "dark"
                      ? "border-[rgba(255,255,255,0.25)]"
                      : "border-[rgba(255,255,255,0.4)]",
                  )}
                >
                  <Icon name={iconName} width={22} height={22} />
                </div>
              )}
            </span>
          );
        })}
        {/* CENTER BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "absolute left-1/2 bottom-0 w-12 h-12 rounded-full pointer-events-auto z-10000 flex items-center justify-center transition-all duration-300 btn-glass backdrop-blur-[25px] border shadow-[0_8px_25px_rgba(0,0,0,0.25)]",
            theme === "dark"
              ? "border-[rgba(255,255,255,0.3)]"
              : "border-[rgba(255,255,255,0.4)]",
          )}
          style={{ transform: "translateX(-50%) translateY(-11px)" }}
        >
          <span className="text-[30px] font-medium transition-transform duration-300 relative bottom-[2px]">
            {open ? "×" : "+"}
          </span>
        </button>
      </div>
    </div>
    </div>
  );
};

export default CenterRadialButton;
