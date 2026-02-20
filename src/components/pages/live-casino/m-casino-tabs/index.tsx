"use client";
import React, { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface MCasinoTabsProps {
  tabs: { id: string; name: string }[];
}

const MCasinoTabs = ({ tabs }: MCasinoTabsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "Popular";
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

    container.scrollTo({
      left: scrollLeft,
      behavior: "smooth",
    });
  }, [activeTab, tabs]); 

  return (
    <div className="mob-wrapper px-1 py-4">
      <div className="mob-scroll" ref={scrollContainerRef}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            data-tab-id={tab.id} // ✅ selector k liye
            onClick={() => router.push(`?tab=${tab.id}`)}
            className={`mob-card ${activeTab === tab.id ? "mob-active" : "mob-inactive"}`}
          >
            <span className={`mob-label ${activeTab === tab.id ? "mob-label-active" : "mob-label-inactive"}`}>
              {tab.name}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .mob-wrapper {
          width: 100%;
          background-color: var(--layout-nav-bg);
          border-bottom: 1px solid rgba(145, 158, 171, 0.2);
        }
        .mob-scroll {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .mob-scroll::-webkit-scrollbar { display: none; }
        .mob-card {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          min-width: 120px;
          height: 48px;
          flex-shrink: 0;
          border-radius: 16px;
          padding: 12px;
          border: 1px solid transparent;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mob-inactive {
          background-color: rgba(7, 141, 238, 0.08);
          color: rgb(145, 158, 171);
          border-color: rgba(7, 141, 238, 0.3);
        }
        .mob-active {
          background-color: rgba(7, 141, 238, 0.24);
          border-color: rgb(7, 141, 238);
        }
        .mob-label {
          font-size: 0.75rem;
          text-align: center;
          white-space: nowrap;
        }
        .mob-label-active  { font-weight: 700; }
        .mob-label-inactive { font-weight: 400; }
      `}</style>
    </div>
  );
};

export default MCasinoTabs;