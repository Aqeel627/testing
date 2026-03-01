"use client";

import { useState, useEffect, useCallback, useRef, useMemo, useTransition } from "react";
import styles from "./style.module.css";
import { useAppStore } from "@/lib/store/store";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type NavItem = { label: string; href: string; id: string };

const NAV_DATA = ["cricket", "soccer", "tennis"];

export default function SportsNav({
  setSelectedEvent,
}: {
  setSelectedEvent: (value: string) => void;
}) {
  const { menuList } = useAppStore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabsListRef = useRef<HTMLDivElement>(null);

  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  const navItems = useMemo<NavItem[]>(() => {
    if (!menuList?.eventTypes) return [];

    const dynamicItems = menuList.eventTypes
      .filter((item: any) =>
        NAV_DATA.includes(item?.eventType?.name?.toLowerCase())
      )
      .map((item: any) => ({
        label: item?.eventType?.name,
        href: `/game-list/${item?.eventType?.name}/${item?.eventType?.id}`,
        id: item?.eventType?.id,
      }));

    // ✅ Static Horse Racing Add
    const horseRacingItem: NavItem = {
      label: "Horse Racing",
      href: "/horse-racing",
      id: "4339",
    };

    return [...dynamicItems, horseRacingItem];
  }, [menuList?.eventTypes]);

  // Set default tab on load
  useEffect(() => {
    if (navItems.length > 0 && !activeTab) {
      const cricketTab = navItems.find((item) => item.label.toLowerCase() === "cricket");
      const defaultTab = cricketTab ?? navItems[0];

      setActiveTab(defaultTab.label);
      startTransition(() => {
        setSelectedEvent(defaultTab.id);
      });
    }
  }, [navItems, activeTab, setSelectedEvent]);

  // Recalculate only for window resize or initial mount
  const updateIndicator = useCallback(() => {
    if (!tabsListRef.current || !activeTab) return;
    const activeBtn = tabsListRef.current.querySelector(
      `button[data-tab="${activeTab}"]`
    ) as HTMLElement;

    if (!activeBtn) return;

    setIndicatorStyle({
      left: activeBtn.offsetLeft,
      top: activeBtn.offsetTop,
      width: activeBtn.offsetWidth,
      height: activeBtn.offsetHeight,
      opacity: 1,
    });
  }, [activeTab]);

  // Attach resize listener
  useEffect(() => {
    // Thoda delay sirf initial load pe theek se render hone ke liye
    const timeout = setTimeout(updateIndicator, 50);
    window.addEventListener("resize", updateIndicator);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator]);

  // ⚡ SUPER FAST CLICK HANDLER
  const handleTabClick = (e: React.MouseEvent<HTMLButtonElement>, item: NavItem) => {
    if (activeTab === item.label) return;


    // ✅ If Horse Racing → Direct Route
    if (item.label === "Horse Racing") {
      router.push("/horse-racing");
      return;
    }

    const target = e.currentTarget;

    // 1. Instantly update indicator position BEFORE render cycle completes
    setIndicatorStyle({
      left: target.offsetLeft,
      top: target.offsetTop,
      width: target.offsetWidth,
      height: target.offsetHeight,
      opacity: 1,
    });

    // 2. Instantly adjust scroll container to keep active tab in view
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = target.offsetLeft - container.offsetWidth / 2 + target.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }

    // 3. Update active tab UI state
    setActiveTab(item.label);

    // 4. Load the heavy 600-item list in the background
    startTransition(() => {
      setSelectedEvent(item.id);
    });
  };

  return (
    <section id="sport-nav.tsx">
      <div className={`${styles["tabs-root"]} border-2 border-dashed border-(--dotted-line)`}>
        <div
          ref={scrollContainerRef}
          className={`${styles["tabs-scroller"]} overflow-x-auto overflow-y-hidden`}
        >
          <div role="tablist" className={cn(styles["tabs-list"], "w-full h-full")} ref={tabsListRef}>

            <div
              className={`${styles["sliding-indicator"]} py-[14.5px]`}
              style={{
                left: `${indicatorStyle.left}px`,
                top: `${indicatorStyle.top - 0.5}px`,
                width: `${indicatorStyle.width}px`,
                height: `${indicatorStyle.height}px`,
                opacity: indicatorStyle.opacity,
                // ⚡ Smooth hardware-accelerated transition
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />

            {navItems.map((item) => (
              <button
                key={item.id}
                role="tab"
                data-tab={item.label}
                aria-selected={activeTab === item.label}
                className={cn(
                  styles["tab-btn"],
                  activeTab === item.label && styles.active
                )}
                // ⚡ Pass the event (e) to the handler
                onClick={(e) => handleTabClick(e, item)}
              >
                <span
                  className={`${styles["tab-icon"]} ${styles[`icon-${item.label.toLowerCase().replace(/\s/g, "-")}`]}`}
                />
                {item.label}
                {activeTab === item.label && (
                  <span className={styles["tab-indicator"]}></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}