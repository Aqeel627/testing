"use client";
import React, { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface MCasinoTabsProps {
  tabs: { id: string; name: string }[];
}

const MCasinoTabs = ({ tabs }: MCasinoTabsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const activeTab = searchParams.get("tab") ?? "Popular";
  const activeTab = searchParams.get("tab") ?? tabs[0]?.id ?? ""; 
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const activeBtn = container.querySelector(
      `[data-tab-id="${activeTab}"]`
    ) as HTMLElement;
    if (!activeBtn) return;
    const scrollLeft =
      activeBtn.offsetLeft -
      container.offsetWidth / 2 +
      activeBtn.offsetWidth / 2;
    container.scrollTo({ left: scrollLeft, behavior: "smooth" });
  }, [activeTab, tabs]);

  return (
    <div className="w-full border-b border-dashed border-[var(--dotted-line)] px-1 py-4">
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab) => (
          <div
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => router.push(`?tab=${tab.id}`)}
            className={`flex items-center justify-center cursor-pointer min-w-[120px] h-[48px] flex-shrink-0 rounded-2xl px-3 border transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              activeTab === tab.id
                ? "bg-[var(--casino-tab-nonactive-bg)] border-[var(--casino-tab-nonactive-border)]"
                : "bg-[var(--casino-tab-active-bg)] border-[var(--casino-tab-active-border)] text-[var(--casino-tab-nonactive-text)]"
            }`}
          >
            <span
              className={`text-[0.75rem] text-center whitespace-nowrap ${
                activeTab === tab.id ? "font-bold" : "font-normal"
              }`}
            >
              {tab.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MCasinoTabs;