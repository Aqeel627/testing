"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "@/components/pages/home/sports-nav/style.module.css";
import { useAppStore } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import { useIndexManagerStore } from "@/lib/store/indexManagerStore";

type NavItem = { label: string; href: string; id: string };

export default function InplaySportNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (value: string) => void;
}) {
  const { eventTypes, inplayEvents } = useIndexManagerStore();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const router = useRouter();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (!eventTypes || !inplayEvents) {
      setNavItems([]);
      return;
    }

    const newItems: NavItem[] = eventTypes
      .filter((item: any) => {
        const name = item?.name?.toLowerCase();
        const id = item?.id;
        const hasEvents = inplayEvents[id]?.length > 0;

        return hasEvents;
      })
      .map((item: any) => ({
        label: item?.name,
        href: `/game-list/${item?.name}/${item?.id}`,
        id: item?.id,
      }));

    setNavItems(newItems);
  }, [eventTypes, inplayEvents]); 

  // ----- Update indicator -----
  const updateIndicator = useCallback(() => {
    if (!tabsListRef.current || !activeTab) return;

    const activeBtn = tabsListRef.current.querySelector(
      `button[data-tab="${activeTab}"]`,
    ) as HTMLElement;

    if (!activeBtn || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const isFirst = firstRender.current;

    // ----- Indicator Position -----
    setIndicatorStyle({
      left: activeBtn.offsetLeft,
      top: activeBtn.offsetTop,
      width: activeBtn.offsetWidth,
      height: activeBtn.offsetHeight,
      opacity: 1,
      animate: !isFirst,
    });

    // ----- PERFECT CENTER SCROLL -----
    const containerWidth = container.clientWidth;
    const scrollWidth = container.scrollWidth;

    let targetScroll =
      activeBtn.offsetLeft - containerWidth / 2 + activeBtn.offsetWidth / 2;

    // prevent over scroll
    targetScroll = Math.max(
      0,
      Math.min(targetScroll, scrollWidth - containerWidth),
    );

    container.scrollTo({
      left: targetScroll,
      behavior: isFirst ? "auto" : "smooth",
    });

    if (isFirst) {
      firstRender.current = false;
    }
  }, [activeTab]);

  // ----- Effect to run after navItems or tab change -----
  useEffect(() => {
    const handle = () => {
      updateIndicator();
    };

    handle();

    window.addEventListener("resize", handle);

    return () => {
      window.removeEventListener("resize", handle);
    };
  }, [navItems, activeTab, updateIndicator]);

  return (
    <div id="inplay-tabs.tsx">
      <div
        className={`${styles["tabs-root"]} border-2 min-[900]:mt-6 mt-3 border-dashed border-(--dotted-line)`}
      >
        <div
          ref={scrollContainerRef}
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
                data-tab={item.id}
                aria-selected={activeTab === item.id}
                className={`${styles["tab-btn"]} ${
                  activeTab === item.id ? styles.active : ""
                }`}
                onClick={() => {
                  setActiveTab(item.id);
                }}
              >
                <span
                  className={`${styles["tab-icon"]} ${
                    styles[
                      `icon-${item.label.toLowerCase().replace(/\s/g, "-")}`
                    ]
                  }`}
                />
                {item.label}

                {activeTab === item.id && (
                  <span className={styles["tab-indicator"]}></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
