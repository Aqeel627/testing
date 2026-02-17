"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "@/components/pages/home/sports-nav/sportsPage.module.css";
import { useAppStore } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import Icon from "@/icons/icons";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string; id: string };

export default function InplaySportNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (value: string) => void;
}) {
  const { menuList } = useAppStore();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const router = useRouter();

  const navData = ["cricket", "soccer", "tennis"];
  const [showButtons, setShowButtons] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const tabsListRef = useRef<HTMLDivElement>(null);

  // First render ref to skip initial animation
  const firstRender = useRef(true);

  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
    animate: false,
  });

  // ----- Build nav items from menuList -----
  useEffect(() => {
    const eventsType = menuList?.eventTypes;
    if (!eventsType) {
      setNavItems([]);
      return;
    }

    const newItems: NavItem[] = eventsType
      .filter((item: any) =>
        navData.includes(item?.eventType?.name?.toLowerCase()),
      )
      .sort((a: any, b: any) => {
        const aIndex = navData.indexOf(a?.eventType?.name?.toLowerCase());
        const bIndex = navData.indexOf(b?.eventType?.name?.toLowerCase());
        return aIndex - bIndex;
      })
      .map((item: any) => ({
        label: item?.eventType?.name,
        href: `/game-list/${item?.eventType?.name}/${item?.eventType?.id}`,
        id: item?.eventType?.id,
      }));

    setNavItems(newItems);
  }, [menuList]);

  // ----- Scroll arrows -----
  const checkArrowsVisibility = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

    const hasOverflow = scrollWidth > clientWidth + 1;

    if (!hasOverflow) {
      // No overflow → hide both arrows
      setShowLeftArrow(false);
      setShowRightArrow(false);
      setShowButtons(false);
      return;
    }

    if (hasOverflow) {
      setShowButtons(true);
    }

    // Overflow exists → decide based on scroll position
    setShowLeftArrow(scrollLeft > 5);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  // ----- Update indicator -----
  const updateIndicator = useCallback(() => {
    if (!tabsListRef.current || !activeTab) return;

    const activeBtn = tabsListRef.current.querySelector(
      `button[data-tab="${activeTab}"]`,
    ) as HTMLElement;

    if (activeBtn) {
      const isFirst = firstRender.current;

      setIndicatorStyle({
        left: activeBtn.offsetLeft,
        top: activeBtn.offsetTop,
        width: activeBtn.offsetWidth,
        height: activeBtn.offsetHeight,
        opacity: 1,
        animate: !isFirst, // animation only if not first render
      });

      activeBtn.scrollIntoView({
        behavior: isFirst ? "auto" : "smooth",
        inline: "center",
        block: "nearest",
      });

      // 👇 IMPORTANT: first render ke baad flag off karo
      if (isFirst) {
        firstRender.current = false;
      }
    }
  }, [activeTab]);

  // ----- Effect to run after navItems or tab change -----
  useEffect(() => {
    const handle = () => {
      checkArrowsVisibility();
      updateIndicator();
    };

    handle();

    window.addEventListener("resize", handle);

    return () => {
      window.removeEventListener("resize", handle);
    };
  }, [navItems, activeTab, checkArrowsVisibility, updateIndicator]);

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const observer = new ResizeObserver(() => {
      checkArrowsVisibility();
    });

    observer.observe(scrollContainerRef.current);

    return () => observer.disconnect();
  }, [checkArrowsVisibility]);

  const handleScrollClick = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 200;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`${styles["tabs-root"]} border-3 min-[900]:mt-6 mt-3 border-dashed border-[rgba(145,158,171,0.2)]`}
    >
      <div
        onClick={() => handleScrollClick("left")}
        className={cn(
          "inline-flex items-center justify-center relative box-border bg-transparent outline-none border-0 m-0 p-0 cursor-pointer select-none font-sans w-10 shrink-0",
          showLeftArrow ? "opacity-80" : "opacity-0 pointer-events-none",
          !showButtons && "hidden",
        )}
      >
        <Icon name="leftArrow" className="w-5 h-5 text-white" />
      </div>
      <div
        ref={scrollContainerRef}
        onScroll={checkArrowsVisibility}
        className={`${styles["tabs-scroller"]} overflow-x-auto overflow-y-hidden`}
      >
        <div role="tablist" className={styles["tabs-list"]} ref={tabsListRef}>
          {/* Sliding Indicator */}
          <div
            className={`${styles["sliding-indicator"]} py-3.5 ${
              !indicatorStyle.animate ? styles["no-animation"] : ""
            }`}
            style={{
              left: `${indicatorStyle.left}px`,
              top: `${indicatorStyle.top}px`,
              width: `${indicatorStyle.width}px`,
              height: `${indicatorStyle.height}px`,
              opacity: indicatorStyle.opacity,
            }}
          />

          {/* All Tab */}
          <button
            role="tab"
            data-tab={"All"}
            aria-selected={activeTab === "All"}
            className={`${styles["tab-btn"]} ${
              activeTab === "All" ? styles.active : ""
            }`}
            onClick={() => {
              setActiveTab("All");
            }}
          >
            All
            {activeTab === "All" && (
              <span className={styles["tab-indicator"]}></span>
            )}
          </button>

          {/* Dynamic Tabs */}
          {navItems.map((item, idx) => (
            <button
              key={idx}
              role="tab"
              data-tab={item.label}
              aria-selected={activeTab === item.label}
              className={`${styles["tab-btn"]} ${
                activeTab === item.label ? styles.active : ""
              }`}
              onClick={() => {
                setActiveTab(item.label);
              }}
            >
              {item.label}

              <span
                className={`${styles["tab-icon"]} ${
                  styles[`icon-${item.label.toLowerCase().replace(/\s/g, "-")}`]
                }`}
              />

              {activeTab === item.label && (
                <span className={styles["tab-indicator"]}></span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div
        onClick={() => handleScrollClick("right")}
        className={cn(
          "inline-flex items-center justify-center relative box-border bg-transparent outline-none border-0 m-0 p-0 cursor-pointer select-none font-sans w-10 shrink-0",
          showRightArrow ? "opacity-80" : "opacity-0 pointer-events-none",
          !showButtons && "hidden",
        )}
      >
        <Icon name="rightArrow" className="w-5 h-5 text-white" />
      </div>
    </div>
  );
}
