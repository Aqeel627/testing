"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./sportsPage.module.css";
import { useAppStore } from "@/lib/store/store";
import Icon from "@/icons/icons";

export default function SportsNave() {
  const { menuList } = useAppStore();
  const [activeTab, setActiveTab] = useState("Cricket");
  const [navItems, setNavItems] = useState<{ label: string; href: string }[]>([]);

  const navData = ["cricket", "soccer", "tennis"];
  const [isMobile, setIsMobile] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1200);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    const eventsType = menuList?.eventTypes;

    if (!eventsType) {
      setNavItems([]);
      return;
    }

    type NavItem = { label: string; href: string };

    const newItems: NavItem[] = eventsType
      .filter((item: any) => navData.includes(item?.eventType?.name?.toLowerCase()))
      .map((item: any) => ({
        label: item?.eventType?.name,
        href: `/game-list/${item?.eventType?.name}/${item?.eventType?.id}`,
      }));

    setNavItems(newItems);

    // ✅ Explicitly typed `item`
    if (!newItems.some((item: NavItem) => item.label === activeTab)) {
      const cricketTab = newItems.find((item: NavItem) => item.label.toLowerCase() === "cricket");
      setActiveTab(cricketTab ? cricketTab.label : newItems[0]?.label);
    }
  }, [menuList]);



  const isActive = useCallback(
    (href: string) => {
      if (!href) return false;
      return href === "/" ? window.location.pathname === "/" : window.location.pathname.startsWith(href);
    },
    []
  );


  const checkArrowsVisibility = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
  }, []);

  const updateIndicator = useCallback(() => {
    if (!tabsListRef.current || !activeTab) return;

    // Active button dhoondo
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
        block: "nearest"
      });
    }
  }, [activeTab]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      checkArrowsVisibility();
      updateIndicator();
    }, 100);

    window.addEventListener("resize", checkArrowsVisibility);
    window.addEventListener("resize", updateIndicator);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", checkArrowsVisibility);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [navItems, checkArrowsVisibility, updateIndicator]);

  const handleScrollClick = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 200;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section>
      <div
        className={`${styles["tabs-root"]} border-[1.5px] border-dashed border-[rgba(145,158,171,0.2)]`}>
        <div onClick={() => handleScrollClick("left")} className={`inline-flex items-center justify-center relative box-border [-webkit-tap-highlight-color:transparent] bg-transparent outline-none border-0 m-0 rounded-none p-0 cursor-pointer select-none align-middle appearance-none no-underline text-inherit font-sans w-10 shrink-0
          ${showLeftArrow ? "opacity-80" : "opacity-0 pointer-events-none"}
          `}>
          <Icon name="leftArrow" className="w-5 h-5 text-white" />
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={checkArrowsVisibility}
          className={`${styles["tabs-scroller"]} overflow-x-auto overflow-y-hidden`}>
          <div role="tablist" className={styles["tabs-list"]} ref={tabsListRef}>
            <div
           className={`${styles["sliding-indicator"]} py-[14.5px] `}

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
                className={`${styles["tab-btn"]} label: item?.eventType?.name?.capitalize(), ${activeTab === item.label ? styles.active : ""
                  }`}
                onClick={() => setActiveTab(item.label)}
              >
                {item.label}

                {/* Tab icon placeholder (optional) */}
                <span
                  className={`${styles["tab-icon"]} ${styles[`icon-${item.label.toLowerCase().replace(/\s/g, "-")}`]
                    }`}
                />

                {/* Active underline */}
                {activeTab === item.label && (
                  <span className={styles["tab-indicator"]}></span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div onClick={() => handleScrollClick("right")} className={`inline-flex items-center justify-center relative box-border [-webkit-tap-highlight-color:transparent] bg-transparent outline-none border-0 m-0 rounded-none p-0 cursor-pointer select-none align-middle appearance-none no-underline text-inherit font-sans w-10 shrink-0
          ${showRightArrow ? "opacity-80" : "opacity-0 pointer-events-none"}
          `}>
          <Icon name="rightArrow" className="w-5 h-5 text-white" />
        </div>
      </div>
    </section>
  );
}
