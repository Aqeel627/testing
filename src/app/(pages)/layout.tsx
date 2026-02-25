"use client";

import { useLayoutEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { useUIStore } from "@/lib/store/ui-store";
import { cn } from "@/lib/utils";
import { useCacheStore } from "@/lib/store/cacheStore";
import { useAuthStore } from "@/lib/useAuthStore";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/common/resizeable";
import ChangePassword from "@/components/modal/change-password";
const Header = dynamic(() => import("@/components/common/header"));
const Footer = dynamic(() => import("@/components/common/footer"));
const Sidebar = dynamic(() => import("@/components/common/sidebar"));
const BetSlip = dynamic(() => import("@/components/common/betslip"));
const BottomNavbar = dynamic(() => import("@/components/common/bottom-nav"));
const LoginModal = dynamic(() => import("@/components/modal/login"));
const BetsTable = dynamic(() => import("@/components/common/betstable"));

const MAIN_WIDTH_STORAGE_KEY = "pages-layout-main-width";

export default function PagesLayout({ children }: { children: ReactNode }) {
  const { loginModal } = useCacheStore();
  const { isLoggedIn } = useAuthStore();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobileSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const openMobileSidebar = useUIStore((s) => s.openSidebar);
  const closeMobileSidebar = useUIStore((s) => s.closeSidebar);
  const isBetsOpen = useUIStore((s) => s.isBetsOpen);

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
            // "w-full overflow-hidden!",
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
            className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${isMobileSidebarOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
              }`}
            onClick={() => closeMobileSidebar()}
            aria-hidden="true"
          />

          <aside
            className={`fixed top-0 sidebar-container left-0 z-[70] h-screen w-[288px] max-w-[85vw] bg-[var(--background)] overflow-y-auto no-scrollbar transition-transform duration-300 ease-in-out ${isMobileSidebarOpen ? "translate-x-0 drawer" : "-translate-x-full"
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
        {/* <ChangePassword /> */}
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
                // NOTE: "70%" ki jagah numbers use karein (70), ye library ka rule hai
                defaultSize={isBetsOpen ? 70 : 100}
                className="transition-all duration-300 ease-in-out h-full pt-[50px] overflow-y-auto no-scrollbar pb-[30px] min-w-[450px] ps-3 pe-[6px] mt-[10px]"
                style={{ transition: "flex 0.35s ease-in-out" }} // 👈 Ye jadoo karega
              >
                <div className="@container w-full">
                  {children}
                  <Footer />
                </div>
              </ResizablePanel>

              {isBetsOpen && (
                <>
                  <ResizableHandle
                    withHandle
                    className="ml-[6.5px] bg-[rgba(145,158,171,0.2)] w-1 mt-[50px]"
                  />

                  <ResizablePanel
                    defaultSize={isBetsOpen ? 30 : 0}
                    className="animate-in slide-in-from-right fade-in duration-300 flex-auto min-w-0 h-full overflow-y-auto no-scrollbar pt-[50px] border-l border-white/5"
                    style={{ transition: "flex 0.35s ease-in-out" }}
                  >
                    <BetSlip />
                    {isLoggedIn && <BetsTable />}
                  </ResizablePanel>
                </>
              )}



            </ResizablePanelGroup>
          </div>
        </div>
        {loginModal && <LoginModal />}
        {/* <ChangePassword /> */}
      </>
    );
  }
}
