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
import Header from "@/components/common/header";
import Sidebar from "@/components/common/sidebar";
import Footer from "@/components/common/footer";
import BottomNavbar from "@/components/common/bottom-nav";
import LoginModal from "@/components/modal/login";
import BetSlipUI from "@/components/common/betslip";
import BetsTable from "@/components/common/betstable";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
// const Header = dynamic(() => import("@/components/common/header"));
// const Footer = dynamic(() => import("@/components/common/footer"));
// const Sidebar = dynamic(() => import("@/components/common/sidebar"));
// const BetSlip = dynamic(() => import("@/components/common/betslip"));
// const BottomNavbar = dynamic(() => import("@/components/common/bottom-nav"));
// const LoginModal = dynamic(() => import("@/components/modal/login"));
// const BetsTable = dynamic(() => import("@/components/common/betstable"));

const MAIN_WIDTH_STORAGE_KEY = "pages-layout-main-width";

export default function PagesLayout({ children }: { children: ReactNode }) {
  const { loginModal, isPasswordModalOpen } = useCacheStore();
  const { isLoggedIn } = useAuthStore();
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobileSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const openMobileSidebar = useUIStore((s) => s.openSidebar);
  const closeMobileSidebar = useUIStore((s) => s.closeSidebar);
  const isBetsOpen = useUIStore((s) => s.isBetsOpen);
  const pathname = usePathname();

  const HIDE_FOOTER_ROUTES = [
    "/statement",
    "/profit-loss",
    "/bets-history",
    "/settings",
    "/activity",
  ];

  const shouldHideFooter = HIDE_FOOTER_ROUTES.includes(pathname);

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
            "w-full min-h-screen app-scroll-root",
            (loginModal || isMobileSidebarOpen) && "overflow-hidden!",
          )}
        >
          <div className="w-full fixed top-0 z-50">
            <Header
              onMenuClick={() =>
                isMobileSidebarOpen ? closeMobileSidebar() : openMobileSidebar()
              }
            />
          </div>

          {/* ✅ Backdrop: Framer Motion se smooth opacity */}
          <AnimatePresence>
            {isMobileSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => closeMobileSidebar()}
                className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px]" // halka blur Safari pe premium lagta hai
                aria-hidden="true"
              />
            )}
          </AnimatePresence>

          {/* ✅ Sidebar: Framer Motion Fix */}
          <AnimatePresence>
            {isMobileSidebarOpen && (
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }} // iPhone pe ye bounce-free aur smooth chalta hai
      style={{
        height: "100svh", // keep as-is for everyone by default
        WebkitBackfaceVisibility: "hidden",
      }}
                // className="fixed top-0 left-0 z-[70] w-[288px] max-w-[85vw] bg-[var(--background)] sidebar-container overflow-y-auto no-scrollbar shadow-2xl"
                  className="fixed top-0 left-0 z-[70] w-[288px] max-w-[85vw] bg-[var(--background)] sidebar-drawer shadow-2xl"
              >
                <div className="sidebar-drawer-scroll">
                <Sidebar />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          <main className="pt-[80px] px-3 h-screen">
            {children}
            {!shouldHideFooter && <Footer />}
            <div className="md:hidden h-25"></div>
          </main>

          <BottomNavbar />
        </div>
        {loginModal && <LoginModal />}
        {isPasswordModalOpen && <ChangePassword />}
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

          <div className="flex h-full w-full">

            <motion.aside
              animate={{ width: isSidebarOpen ? 300 : 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="h-full pt-[50px] shrink-0 overflow-hidden border-r border-white/5"
            >
              <div className="w-[300px] h-full">
                <Sidebar />
              </div>
            </motion.aside>

            <ResizablePanelGroup
              orientation="horizontal"
              className="flex-1 min-w-0"
            >
              <ResizablePanel
                minSize={450}
                defaultSize="70%"
                className="h-full pt-[50px] overflow-y-auto no-scrollbar pb-[30px] min-w-[450px] ps-3 pe-[6px] mt-[10px]"
              >
                <div className="@container w-full">
                  {children}
                  {!shouldHideFooter && <Footer />}
                </div>
              </ResizablePanel>

              <AnimatePresence>
                {(!isLoggedIn || isBetsOpen) && (
                  <>
                    <ResizableHandle
                      withHandle
                      className="ml-[6.5px] bg-[rgba(145,158,171,0.2)] w-1 mt-[50px]"
                    />
                    <ResizablePanel
                      defaultSize={"30%"}
                      className="flex-auto min-w-0 h-full border-l border-white/5 overflow-hidden pt-[50px]"
                    >
                      <motion.div
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="w-full h-full overflow-y-auto no-scrollbar"
                      >
                        <BetSlipUI />
                        {isLoggedIn && <BetsTable />}
                      </motion.div>
                    </ResizablePanel>
                  </>
                )}
              </AnimatePresence>
            </ResizablePanelGroup>

          </div>
        </div>
        {loginModal && <LoginModal />}
        {isPasswordModalOpen && <ChangePassword />}
      </>
    );
  }
}
