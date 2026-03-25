"use client";

import { useAuthStore } from "@/lib/useAuthStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useTheme } from "next-themes";
import React, { Fragment, useEffect, useState, useRef, useLayoutEffect, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMiniCasinoStore } from "@/lib/store/miniCasinoStore";
import { useCacheStore } from "@/lib/store/cacheStore";
import dynamic from "next/dynamic";
import Icon from "@/icons/icons";
import { useAppStore } from "@/lib/store/store";
import { useMyBetsDrawerStore } from "@/lib/store/myBetsDrawerStore";

// 🔥 Framer Motion
import { motion, useSpring, useTransform, useVelocity } from "framer-motion";
import styles from "./CrystalBottomNav.module.css";

const CenterRadialButton = dynamic(
  () => import("@/components/common/bottom-nav/center-radial-btn"), // <-- Yahan / miss ho gaya tha
);

// --- FRAMER CONSTANTS ---
const REST_LENS_SIZE = 48;
const ENGAGED_LENS_SIZE = 60;
const LENS_SPRING = { stiffness: 170, damping: 28, mass: 1.18 };
const ENGAGE_SPRING = { stiffness: 220, damping: 26, mass: 0.92 };

type TabMeasure = { left: number; top: number; width: number; center: number };

const BottomNavbar = () => {
  const [isSafari, setIsSafari] = useState(false);

  const pathName = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  const { isLoggedIn } = useAuthStore();
  const { userExposureList, matchedUnmatchedTotal } = useAppStore();
  const { setLoginModal } = useCacheStore();
  const { isOpen, open, close } = useMiniCasinoStore();
  const isBetsOpen = useMyBetsDrawerStore((s) => s.isOpen);
  const openMyBets = useMyBetsDrawerStore((s) => s.openMyBets);
  const openOpenBets = useMyBetsDrawerStore((s) => s.openOpenBets);
  const closeMyBets = useMyBetsDrawerStore((s) => s.close);

  const segs = pathName.split("/").filter(Boolean);
  const eventId = segs?.[1] || params?.get("eventId");
  const sportId = segs?.[2] || params?.get("sportId");

  const navItems = [
    { type: "link", icon: "house", link: "/", label: "Home" },
    { type: "link", icon: "inplay", link: "/inplay", label: "In Play" },
    { type: "center", label: "Center" },
    { type: "link", icon: "bets", link: "#", label: "My Bets" },
    { type: "link", icon: "casinoic", link: "#", label: "Casino" },
  ];

  const defaultActiveIndex = navItems.findIndex(item => item.type === "link" && item.link === pathName) >= 0
    ? navItems.findIndex(item => item.type === "link" && item.link === pathName)
    : 0;

  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [measures, setMeasures] = useState<TabMeasure[]>([]);

  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | HTMLDivElement | null)[]>([]);
  const previewIndexRef = useRef<number | null>(null);
  const activeIndexRef = useRef(activeIndex);

  const lensLeft = useSpring(0, LENS_SPRING);
  const lensTop = useSpring(0, LENS_SPRING);
  const lensWidth = useSpring(0, LENS_SPRING);
  const lensHeight = useSpring(0, LENS_SPRING);
  const engage = useSpring(0, ENGAGE_SPRING);
  const [glintAngle, setGlintAngle] = useState(0);

  useEffect(() => { previewIndexRef.current = previewIndex; }, [previewIndex]);
  useEffect(() => { activeIndexRef.current = activeIndex; }, [activeIndex]);

  useEffect(() => {
    const idx = navItems.findIndex(item => item.type === "link" && item.link === pathName);
    if (idx !== -1) setActiveIndex(idx);
  }, [pathName]);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const safari = userAgent.includes("Safari") && !userAgent.includes("Chrome") && !userAgent.includes("Chromium");
    setIsSafari(safari);
  }, []);

  // 🔥 COLOR PICKER LOGIC
  useEffect(() => {
    let raf: number;

    const updateDynamicColor = () => {
      const currentIndex = previewIndexRef.current ?? activeIndexRef.current;
      const activeEl = itemRefs.current[currentIndex];

      if (activeEl && stageRef.current) {
        const iconEl = activeEl.querySelector("svg");

        if (iconEl) {
          const computedColor = window.getComputedStyle(iconEl).color;
          stageRef.current.style.setProperty("--lens-edge-color", computedColor);
        }
      }

      raf = requestAnimationFrame(updateDynamicColor);
    };

    raf = requestAnimationFrame(updateDynamicColor);
    return () => cancelAnimationFrame(raf);
  }, []);

  const measure = useCallback(() => {
    const stage = stageRef.current?.getBoundingClientRect();
    if (!stage) return;

    setMeasures(
      itemRefs.current.map((node) => {
        if (!node) return { left: 0, top: 0, width: 0, center: 0 };
        const rect = node.getBoundingClientRect();
        const left = rect.left - stage.left;
        const top = rect.top - stage.top;
        return { left, top, width: rect.width, center: left + rect.width / 2 };
      })
    );
  }, []);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const getRestFrame = useCallback((index: number) => {
    const m = measures[index];
    if (!m) return null;
    return { left: m.left, top: m.top, width: m.width, height: m.width };
  }, [measures]);

  const getEngagedFrameAtX = useCallback((localX: number) => {
    const size = ENGAGED_LENS_SIZE;
    const m = measures[0];
    return {
      left: localX - size / 2,
      top: m ? m.top - (size - REST_LENS_SIZE) / 2 : 0,
      width: size,
      height: size,
    };
  }, [measures]);

  const applyFrame = useCallback((frame: { left: number; top: number; width: number; height: number }, engagedValue: number) => {
    lensLeft.set(frame.left);
    lensTop.set(frame.top);
    lensWidth.set(frame.width);
    lensHeight.set(frame.height);
    engage.set(engagedValue);
  }, [engage, lensHeight, lensLeft, lensTop, lensWidth]);

  useLayoutEffect(() => {
    if (!measures.length || isInteracting) return;
    const frame = getRestFrame(activeIndex);
    if (frame) applyFrame(frame, 0);
  }, [activeIndex, applyFrame, getRestFrame, isInteracting, measures.length]);

  const beginInteraction = useCallback((index: number) => {
    setPreviewIndex(index);
    setIsInteracting(true);
    const centerX = measures[index]?.center ?? 0;
    const frame = getEngagedFrameAtX(centerX);
    if (frame) applyFrame(frame, 1);
  }, [applyFrame, getEngagedFrameAtX, measures]);


  // 🔥 JADOO YAHAN HAI: Click aur Drag Release dono ke liye ek unified function 🔥
  const handleTabSelectRef = useRef<any>(null);

  handleTabSelectRef.current = (idx: number, e?: React.MouseEvent) => {
    const item = navItems[idx];
    if (!item) return; // 🔥 Puraani line yahan se change ki hai

    // 🔥 JADOO YAHAN HAI: Agar Lens Center par aakar ruka hai 🔥
    if (item.type === "center") {
      // Agar drag kar ke chhorda gaya hai (e exist nahi karta)
      if (!e) {
        document.getElementById("center-radial-btn")?.click(); // Fake Click!
      }
      return;
    }

    setActiveIndex(idx);

    if ((item.icon === "bets" || item.icon === "casinoic") && !isLoggedIn) {
      if (e) e.preventDefault();
      setLoginModal(true);
      return;
    }

    if (isBetsOpen) {
      closeMyBets();
      return;
    }

    if (item.icon === "bets") {
      if (e) e.preventDefault();
      if (pathName?.includes("/market-details/")) {
        const segs = pathName.split("/").filter(Boolean);
        const evId = segs?.[1];
        const spId = segs?.[2];
        if (evId && spId) {
          openOpenBets(evId, spId);
          return;
        }
      }
      openMyBets();
      return;
    }

    if (item.icon === "casinoic") {
      if (e) e.preventDefault();
      if (isOpen) close();
      else open();
      return;
    }

    if (!e && item.link && item.link !== "#") {
      router.push(item.link);
    }
  };

  const finishInteraction = useCallback(() => {
  const targetIndex = previewIndexRef.current;
  const currentIndex = activeIndexRef.current;

  if (targetIndex !== null && targetIndex !== currentIndex) {
    // ✅ 1. Pehle active update karo
    setActiveIndex(targetIndex);

    // ✅ 2. Action bhi call karo
    handleTabSelectRef.current(targetIndex);

    // ✅ 3. Frame ko turant target pe set karo
    const restFrame = getRestFrame(targetIndex);
    if (restFrame) applyFrame(restFrame, 0);
  } else {
    // fallback
    const restFrame = getRestFrame(currentIndex);
    if (restFrame) applyFrame(restFrame, 0);
  }

  // ✅ 4. END me interaction band karo
  requestAnimationFrame(() => {
    setIsInteracting(false);
    setPreviewIndex(null);
  });

}, [applyFrame, getRestFrame]);

  useEffect(() => {
    if (!isInteracting) return;

    const getLocalX = (clientX: number) => {
      const rect = stageRef.current?.getBoundingClientRect();
      return rect ? clientX - rect.left : null;
    };

    const getNearestIndex = (localX: number) => {
      let nearest = 0;
      let min = Number.POSITIVE_INFINITY;
      measures.forEach((m, i) => {
        const d = Math.abs(m.center - localX);
        if (d < min) { min = d; nearest = i; }
      });
      return nearest;
    };

    const handleMove = (event: PointerEvent) => {
      const localX = getLocalX(event.clientX);
      if (localX === null) return;
      const nextPreview = getNearestIndex(localX);
      if (previewIndexRef.current !== nextPreview) setPreviewIndex(nextPreview);
      const frame = getEngagedFrameAtX(localX);
      applyFrame(frame, 1);
    };

    const handleUp = () => finishInteraction();

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, [applyFrame, finishInteraction, getEngagedFrameAtX, isInteracting, measures]);

  const glowOpacity = useTransform(engage, [0, 1], [0, 0.45]);


  return (
    <div id="bottomNavbar.tsx">
      <div
        ref={stageRef}
        className={cn(
          "md:hidden z-[40] fixed border shadow-[0_8px_32px_rgba(0,0,0,0.2)]! bottom-5 left-1/2 -translate-x-1/2 px-2 py-2 w-[84%] flex justify-around items-center rounded-full glass-blur h-15",
          theme === "dark"
            ? "border-[rgba(255,255,255,0.3)]"
            : "border-[rgb(205,192,192,0.5)] ",
          isSafari ? "bottom-2" : "bottom-5",
        )}
        style={{ touchAction: "none" }}
      >

        {/* 🔥 LENS 🔥 */}
        <motion.div
          className={cn(styles.lensTrack, "rounded-full")}
          style={{
            left: lensLeft,
            top: lensTop,
            width: lensWidth,
            height: lensHeight,
            position: "absolute",
            zIndex: 0,
            pointerEvents: "none",
          }}
          animate={{ opacity: isInteracting ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className={styles.lens}>
            <div className={styles.lensIsolation} />
            <motion.div
              className={styles.lensGlow}
              style={{
                opacity: glowOpacity,
                background: "var(--lens-edge-color)",
                boxShadow: "0 0 24px 8px var(--lens-edge-color)"
              }}
            />
            <div className={styles.lensSpecular} />
          </div>

          <motion.div
            className={styles.shadesContainer}
            style={{ rotate: glintAngle }}
          />
          <motion.div
            className={styles.lensRim}
            style={{ borderColor: "var(--lens-edge-color)" }}
          />
        </motion.div>

        {navItems.map((item, idx) => {

          if (item.type === "center") {
            return (
              <div
                key={`item-${idx}`}
                ref={(el) => { itemRefs.current[idx] = el; }}
                onPointerDown={() => beginInteraction(idx)}
                className={cn(
                  "relative z-10 flex items-center justify-center transition-all duration-200",
                  isInteracting ? "[&_*]:!bg-transparent [&_*]:!border-transparent [&_*]:!shadow-none" : "",
                  isInteracting && "[&_*]:!bg-transparent [&_*]:!backdrop-blur-none [&_*]:!shadow-none"
                )}
              >
                <CenterRadialButton />
              </div>
            );
          }

          return (
            <Link
              key={`item-${idx}`}
              ref={(el) => { itemRefs.current[idx] = el; }}
              prefetch={false}
              aria-label={item.label}
              href={item.icon === "bets" || item.icon === "casinoic" ? "#" : (item.link || "#")}

              onPointerDown={() => beginInteraction(idx)}

              // 🔥 Click par bhi unified function call hoga 🔥
              onClick={(e) => handleTabSelectRef.current(idx, e)}

              className={cn(
                "h-12 w-12 flex justify-center items-center rounded-full relative z-10 transition-all duration-200",

                (pathName === item?.link || activeIndex === idx) ? "text-(--nav-item-root-active-color)" : "text-inherit",

                isInteracting
                  ? "bg-transparent border-transparent shadow-none"
                  : cn(
                    "glass border",
                    theme === "dark" ? "border-[rgba(255,255,255,0.3)]" : "border-[rgb(205,192,192,0.5)]",
                    (pathName === item?.link || activeIndex === idx)
                      ? "bg-(--nav-item-root-active-bg)!"
                      : "bg-(--IconButton-hoverBg)"
                  )
              )}
            >
              <Icon name={item.icon as string} width={25} height={25} />

              {item.icon === "bets" &&
                isLoggedIn &&
                (eventId && sportId
                  ? matchedUnmatchedTotal > 0
                  : userExposureList?.totalExposure > 0) && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex justify-center items-center text-white">
                    {eventId && sportId
                      ? matchedUnmatchedTotal
                      : userExposureList?.totalExposure || 0}
                  </span>
                )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavbar;