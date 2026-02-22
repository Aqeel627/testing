"use client";

import {
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import { useAppStore } from "@/lib/store/store";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useCacheStore } from "@/lib/store/cacheStore";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/common/resizeable";
import dynamic from "next/dynamic";
const BetSlip = dynamic(() => import("@/components/common/betslip"));
const DCasinoTabs = dynamic(() => import("@/components/pages/live-casino/d-casino-tabs"));
const BottomNavbar = dynamic(() => import("@/components/common/bottom-nav"));
const LoginModal = dynamic(() => import("@/components/modal/login"));
const Header = dynamic(() => import("@/components/common/header"));
const Footer = dynamic(() => import("@/components/common/footer"));

const MAIN_WIDTH_STORAGE_KEY = "pages-layout-main-width";

export default function CasinoLayout({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const { loginModal } = useCacheStore();
  const { casinoEvents } = useAppStore();

  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "Popular";

  const dynamicTabs =
    casinoEvents?.menu?.map((m: any) => ({
      id: m.menuName,
      name: m.menuName,
    })) || [];

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
            loginModal && "overflow-hidden!",
          )}
        >
          <div className="w-full fixed top-0 z-50">
            {/* <Marque /> */}
            {/* ✅ toggle via store */}
            <Header hideMenuBtn />
          </div>
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
            <Header hideMenuBtn />
          </div>
          <div className="flex h-full w-100% ">
            <ResizablePanelGroup
              orientation="horizontal"
              className="min-w-112.5!"
            >
              <aside className="h-full pt-[50px] border-r min-w-75 w-75 no-scrollbar overflow-hidden transition-all duration-300 border-white/5 ease-in-out">
                <DCasinoTabs
                  tabs={dynamicTabs}
                  activeTab={activeTab}
                  onTabChange={(name: string) => router.push(`?tab=${name}`)} // ✅
                />
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
