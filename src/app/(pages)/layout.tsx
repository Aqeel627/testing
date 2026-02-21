"use client";

import {
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import Sidebar from "@/components/common/sidebar";
import { useAppStore } from "@/lib/store/store";
import { fetchData } from "@/lib/functions";
import { CONFIG } from "@/lib/config";
import BetSlip from "@/components/common/betslip";
import { useUIStore } from "@/lib/store/ui-store"; // ✅ import store
import BottomNavbar from "@/components/common/bottom-nav";
import LoginModal from "@/components/modal/login";
import { cn } from "@/lib/utils";
import { useCacheStore } from "@/lib/store/cacheStore";
import { useAuthStore } from "@/lib/useAuthStore";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/common/resizeable";

const MAIN_WIDTH_STORAGE_KEY = "pages-layout-main-width";

export default function PagesLayout({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isMobileSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const openMobileSidebar = useUIStore((s) => s.openSidebar);
  const closeMobileSidebar = useUIStore((s) => s.closeSidebar);

  const LEFT_WIDTH_OPEN = 300;
  const DIVIDER_WIDTH = 0.279;

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

  const { loginModal } = useCacheStore();
  const { checkLogin, isLoggedIn } = useAuthStore();

  const handleAllEvents = (data: any) => {
    setAllEventsList(data);
    console.log("Events Set", data);

    const formatted = useAppStore.getState().getFormattedInplayEvents?.();
    console.log("Formatted:", formatted);
  };

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
  }, []);

  useLayoutEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 1200);
    };

    checkDevice(); // 👈 run before paint
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (isMobile === null) return null;

  if (isMobile) {
    return (
      <>
        <div
          className={cn(
            "w-full min-h-screen",
            (loginModal || isMobileSidebarOpen) && "overflow-hidden!",
          )}
        >
          <div className="w-full fixed top-0 z-50">
            {/* <Marque /> */}
            {/* ✅ toggle via store */}
            <Header
              onMenuClick={() =>
                isMobileSidebarOpen ? closeMobileSidebar() : openMobileSidebar()
              }
            />
          </div>

          {/* ✅ backdrop closes via store */}
          <div
            className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${
              isMobileSidebarOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={() => closeMobileSidebar()}
            aria-hidden="true"
          />

          <aside
            className={`fixed top-0 sidebar-container left-0 z-[70] h-screen w-[288px] max-w-[85vw] bg-[var(--background)] overflow-y-auto no-scrollbar transition-transform duration-300 ease-in-out ${
              isMobileSidebarOpen ? "translate-x-0 drawer" : "-translate-x-full"
            }`}
          >
            <Sidebar />
          </aside>

          <main className="pt-[80px] px-3 h-screen">
            {children}
            <Footer />
            <div className="md:hidden h-25"></div>
          </main>

          <BottomNavbar />
        </div>
        {loginModal && <LoginModal />}
      </>
    );
  } else {
    return (
      <>
        <div className="w-full h-screen overflow-hidden">
          <div className="fixed top-0 left-0 w-full z-50">
            {/* <Marque /> */}
            <Header onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />
          </div>

          <div className="flex h-full w-100% ">
            <ResizablePanelGroup
              orientation="horizontal"
              className="min-w-112.5!"
            >
              <aside
                className={cn(
                  "h-full pt-[50px] no-scrollbar overflow-hidden transition-all duration-300 border-white/5 ease-in-out",
                  isSidebarOpen
                    ? "border-r min-w-75 w-75"
                    : "border-0 w-0 min-w-0",
                )}
              >
                <Sidebar />
              </aside>

              <ResizablePanel
                minSize={450} 
                defaultSize="70%"
                className="h-full pt-[50px] overflow-y-auto no-scrollbar pb-[30px] min-w-[450px] ps-3 pe-[6px] mt-[10px]"
              >
                <div className="@container w-full">
                  {children}
                  <Footer />
                </div>
              </ResizablePanel>
              <ResizableHandle
                withHandle
                className="ml-[6.5px] bg-[rgba(145,158,171,0.2)] w-1 mt-[50px]"
              />

              <ResizablePanel
                defaultSize="30%"
                className="flex-auto min-w-0 h-full overflow-y-auto no-scrollbar pt-[50px] border-l border-white/5"
              >
                <BetSlip />
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
        {loginModal && <LoginModal />}
      </>
    );
  }
}
