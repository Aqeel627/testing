"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./sportsPage.module.css";
import { useAppStore } from "@/lib/store/store";

type NavItem = { label: string; href: string; id: string };

export default function SportsNav() {
  const { menuList, setSelectedEventTypeId } = useAppStore();

  const [activeTab, setActiveTab] = useState("Cricket");
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  const navData = ["cricket", "soccer", "tennis"];
  const [isMobile, setIsMobile] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1200);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const eventsType = menuList?.eventTypes;  // ✅ eventsType is defined here inside useEffect

    if (!eventsType) {
      setNavItems([]);
      return;
    }

    // ✅ newItems built here with id included
    const newItems: NavItem[] = eventsType
      .filter((item: any) => navData.includes(item?.eventType?.name?.toLowerCase()))
      .map((item: any) => ({
        label: item?.eventType?.name,
        href: `/game-list/${item?.eventType?.name}/${item?.eventType?.id}`,
        id: item?.eventType?.id,   // ✅ id added
      }));

    setNavItems(newItems);

    // ✅ cricketTab defined here inside useEffect
    const cricketTab = newItems.find((item: NavItem) => item.label.toLowerCase() === "cricket");
    const defaultTab = cricketTab ?? newItems[0];

    if (defaultTab) {
      setActiveTab(defaultTab.label);
      setSelectedEventTypeId(defaultTab.id);  // ✅ set default sport ID
    }

  }, [menuList]);


  const updateIndicator = useCallback(() => {
    if (!tabsListRef.current || !activeTab) return;

    const activeBtn = tabsListRef.current.querySelector(`button[data-tab="${activeTab}"]`) as HTMLElement;

    if (activeBtn) {
      setIndicatorStyle({
        left: activeBtn.offsetLeft,
        top: activeBtn.offsetTop,
        width: activeBtn.offsetWidth,
        height: activeBtn.offsetHeight,
        opacity: 1,
      });

      activeBtn.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeTab]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateIndicator();
    }, 100);

    window.addEventListener("resize", updateIndicator);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [navItems, updateIndicator]);

  return (
    <section>
      <div className={`${styles["tabs-root"]} border-2 border-dashed border-[rgba(145,158,171,0.2)]`}>
        <div
          className={`${styles["tabs-scroller"]} overflow-x-auto overflow-y-hidden`}
        >
          <div role="tablist" className={styles["tabs-list"]} ref={tabsListRef}>
            <div
              className={`${styles["sliding-indicator"]} py-[14.5px]`}
              style={{
                left: `${indicatorStyle.left}px`,
                top: `${indicatorStyle.top - 0.5}px`,
                width: `${indicatorStyle.width}px`,
                height: `${indicatorStyle.height}px`,
                opacity: indicatorStyle.opacity,
              }}
            />

            {navItems.map((item, idx) => (
              <button
                key={idx}
                role="tab"
                data-tab={item.label}
                aria-selected={activeTab === item.label}
                className={`${styles["tab-btn"]} ${activeTab === item.label ? styles.active : ""}`}
                onClick={() => {
                  setActiveTab(item.label);
                  setSelectedEventTypeId(item.id);  // ✅ set sport ID on click
                }}
              >
                {item.label}

                <span className={`${styles["tab-icon"]} ${styles[`icon-${item.label.toLowerCase().replace(/\s/g, "-")}`]}`} />

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