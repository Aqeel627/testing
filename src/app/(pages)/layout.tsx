"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Marque from "@/components/common/marque";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import Sidebar from "@/components/common/sidebar";
import { useAppStore } from "@/lib/store/store";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { fetchData } from "@/lib/functions";
import { CONFIG } from "@/lib/config";
import BetSlip from "@/components/common/betslip";

const MAIN_WIDTH_STORAGE_KEY = "pages-layout-main-width";

export default function PagesLayout({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // ✅ drag/resize (desktop only)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const LEFT_WIDTH_OPEN = 300;
  const DIVIDER_WIDTH = 0.279; // keep your same divider width percentage feel (we'll still drag on SVG)
  const [mainWidth, setMainWidth] = useState<number>(0);
  const leftWidth = isSidebarOpen ? LEFT_WIDTH_OPEN : 0;

  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

  const getContainerWidth = () => containerRef.current?.clientWidth ?? 0;

  const computeLimits = () => {
    const total = getContainerWidth();
    // divider in px based on your old percent-ish width
    const dividerPx = Math.max(3, Math.floor((DIVIDER_WIDTH / 100) * total));
    const available = Math.max(0, total - leftWidth - dividerPx);

    // right sidebar stays flexible
    const rightMin = 0;
    const minMain = 450;
    const maxMain = Math.max(minMain, available - rightMin);

    return { minMain, maxMain, dividerPx, available };
  };
  const {
    setCasinoEvents,
    setAllEventsList,
    setExchangeTypeList,
    setMenuList,
    setExchangeNews,
    setUserBalance,
    setStakeValue,
    setBannersList,
  } = useAppStore();

  const pathname = usePathname();
  const { checkLogin, isLoggedIn } = useAuthStore();

  const handleAllEvents = (data: any) => {
    setAllEventsList(data); // pehla kaam
    console.log("Events Set", data);

    // doosra function
    const formatted = useAppStore.getState().getFormattedInplayEvents?.();
    console.log("Formatted:", formatted);
  };
  // API Calls
  useEffect(() => {
    const token = localStorage.getItem("token");
    checkLogin(token || "");

    fetchData({
      url: CONFIG.getAllEventsList,
      payload: { key: CONFIG.siteKey },
      cachedKey: "allEventsList",
      setFn: handleAllEvents,
      expireIn: CONFIG.getAllEventsListTime,
    });

    fetchData({
      url: CONFIG.getTopCasinoGame,
      payload: { key: CONFIG.siteKey },
      cachedKey: "casinoEvents",
      setFn: setCasinoEvents,
      expireIn: CONFIG.getTopCasinoGameTime,
    });

    fetchData({
      url: CONFIG.menuList,
      payload: { key: CONFIG.siteKey },
      cachedKey: "menuList",
      setFn: setMenuList,
      expireIn: CONFIG.menuListTime,
    });

    // fetchData({
    //   url: CONFIG.exchangeTypeList,
    //   payload: { key: CONFIG.siteKey },
    //   cachedKey: "exchangeTypeList",
    //   setFn: setExchangeTypeList,
    //   expireIn: CONFIG.exchangeTypeListTime,
    // });

    // fetchData({
    //   url: CONFIG.getExchangeNews,
    //   payload: { key: CONFIG.siteKey },
    //   cachedKey: "exchangeNews",
    //   setFn: setExchangeNews,
    //   expireIn: CONFIG.getExchangeNewsTime,
    // });

    // fetchData({
    //   url: CONFIG.getUserBetStake,
    //   payload: { key: CONFIG.siteKey },
    //   cachedKey: "betStake",
    //   setFn: setStakeValue,
    //   expireIn: CONFIG.getUserBetStakeTime,
    // });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const nextIsMobile = window.innerWidth < 1200;
      setIsMobile(nextIsMobile);
      if (!nextIsMobile) {
        setIsMobileSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ init main width (desktop)
  useEffect(() => {
    if (isMobile) return;

    const sync = () => {
      const { minMain, maxMain, available } = computeLimits();
      if (!available) return;

      setMainWidth((prev) => {
        if (!prev) {
          const savedWidth = localStorage.getItem(MAIN_WIDTH_STORAGE_KEY);
          if (savedWidth) {
            const parsedWidth = Number(savedWidth);
            if (!Number.isNaN(parsedWidth) && parsedWidth > 0) {
              return clamp(Math.floor(parsedWidth), minMain, maxMain);
            }
          }

          // initial main width
          const initial = Math.floor(available - 398);
          return clamp(initial, minMain, maxMain);
        }
        return clamp(prev, minMain, maxMain);
      });
    };

    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [isMobile, isSidebarOpen]);

  useEffect(() => {
    if (isMobile || !mainWidth) return;
    localStorage.setItem(MAIN_WIDTH_STORAGE_KEY, String(mainWidth));
  }, [mainWidth, isMobile]);

  const startDrag = (e: React.PointerEvent) => {
    if (isMobile) return;
    draggingRef.current = true;

    // capture so drag continues smoothly
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    // UX: prevent selection
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  };

  const onDrag = (e: React.PointerEvent) => {
    if (!draggingRef.current || isMobile) return;

    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const { minMain, maxMain, dividerPx } = computeLimits();

    // main = pointerX - left - half divider
    const rawMain = x - leftWidth - dividerPx / 2;

    setMainWidth(clamp(Math.floor(rawMain), minMain, maxMain));
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  };

  if (isMobile) {
    return (
      <div className="w-full min-h-screen">
        <div className="w-full fixed top-0 z-50 css-before">
          <Marque />
          <Header onMenuClick={() => setIsMobileSidebarOpen((prev) => !prev)} />
        </div>

        <div
          className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${isMobileSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />

        <aside
          className={`fixed top-0 sidebar-container  left-0 z-[70] h-screen w-[288px] max-w-[85vw] bg-[#141A21]  overflow-y-auto no-scrollbar transition-transform duration-300 ease-in-out ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <Sidebar />
        </aside>

        <main className="pt-28 px-3 h-screen overflow-y-auto pb-2.5">
          {children}
          <Footer />
        </main>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="fixed top-0 left-0 w-full z-50">
        <Marque />
        <Header onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />
      </div>

      <div ref={containerRef} className="flex pt-[50px] h-full w-100% mt-5 ">
        {/* LEFT (fixed) */}
        <aside
          className={`h-full no-scrollbar overflow-hidden transition-all duration-300 border-white/5 ease-in-out ${isSidebarOpen ? "border-r " : "border-0"}`}
          style={{ width: `${leftWidth}px`, minWidth: `${leftWidth}px` }}
        >
          <Sidebar />
        </aside>

        {/* MAIN (resizable width) */}
        <main
          className="h-full overflow-y-auto no-scrollbar pb-[30px] min-w-[450px] ps-3 pe-[6px] mt-[10px]"
          style={
            mainWidth
              ? { width: `${mainWidth}px`, flex: `0 0 ${mainWidth}px` }
              : undefined
          }
        >
          {children}
          <Footer />
        </main>

        {/* DIVIDER (keep exact design) */}
        <div className="w-[0.279%] bg-[rgba(145,158,171,0.2)] --palette-text-primary ml-[6.5px] relative">
          <svg
            onPointerDown={startDrag}
            onPointerMove={onDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onLostPointerCapture={endDrag}
            style={{ touchAction: "none", cursor: "col-resize" }}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            role="img"
            id="_r_94_"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            className="absolute translate-[-50%] left-[60%]  top-[44.1%] h-5 w-5"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.0625 5.505C11.0625 4.5375 10.2225 3.75 9.1875 3.75C8.1525 3.75 7.3125 4.5375 7.3125 5.505C7.3125 6.474 8.1525 7.26 9.1875 7.26C10.2225 7.26 11.0625 6.474 11.0625 5.505ZM11.0625 18.495C11.0625 17.526 10.2225 16.74 9.1875 16.74C8.1525 16.74 7.3125 17.526 7.3125 18.495C7.3125 19.464 8.1525 20.25 9.1875 20.25C10.2225 20.25 11.0625 19.4625 11.0625 18.495ZM9.1875 10.245C10.2225 10.245 11.0625 11.0325 11.0625 12C11.0625 12.9675 10.2225 13.755 9.1875 13.755C8.1525 13.755 7.3125 12.9675 7.3125 12C7.3125 11.0325 8.1525 10.245 9.1875 10.245ZM16.6875 5.505C16.6875 4.5375 15.8475 3.75 14.8125 3.75C13.7775 3.75 12.9375 4.5375 12.9375 5.505C12.9375 6.474 13.7775 7.26 14.8125 7.26C15.8475 7.26 16.6875 6.474 16.6875 5.505ZM14.8125 16.74C15.8475 16.74 16.6875 17.526 16.6875 18.495C16.6875 19.464 15.8475 20.25 14.8125 20.25C13.7775 20.25 12.9375 19.4625 12.9375 18.495C12.9375 17.526 13.7775 16.74 14.8125 16.74ZM16.6875 12C16.6875 11.0325 15.8475 10.245 14.8125 10.245C13.7775 10.245 12.9375 11.0325 12.9375 12C12.9375 12.9675 13.7775 13.755 14.8125 13.755C15.8475 13.755 16.6875 12.9675 16.6875 12Z"
            ></path>
          </svg>
        </div>

        {/* RIGHT (flexible) */}
        <aside className="flex-auto min-w-0 h-full overflow-y-auto no-scrollbar border-l border-white/5">
          <BetSlip />
        </aside>
      </div>
    </div>
  );
}
