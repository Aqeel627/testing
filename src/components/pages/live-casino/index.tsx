"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store/store";

export default function Casino() {
  const { casinoEvents } = useAppStore();
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState("1");

  useEffect(() => {
    // console.log("casinoEvents", casinoEvents);
  }, [casinoEvents]);

  const filteredItems = React.useMemo(() => {
    if (!casinoEvents?.lobby?.length) return [];
    if (activeIndex === "1") {
      return casinoEvents.lobby.filter((item: any) => item.popular);
    }
    return casinoEvents.lobby.filter(
      (item: any) => item.menuId === activeIndex,
    );
  }, [casinoEvents, activeIndex]);

  return (
    <div className="w-full flex flex-col py-4 relative">
      
      {/* 🟢 PREMIUM LIVE CASINO HEADING SECTION 🟢 */}
      <div className="relative flex items-center justify-center w-full mb-6 px-2 min-[600px]:px-4">
        
        {/* Left Glowing Line & Dots */}
        {/* flex-1 lagaya hai taake line auto-stretch ho */}
        <div className="flex items-center justify-end gap-1.5 min-[500px]:gap-2 w-full max-w-[80px] min-[400px]:max-w-[150px] min-[700px]:max-w-[250px]">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent to-[#f5b82e] shadow-[0_0_8px_#f5b82e]"></div>
          <div className="w-[4px] h-[4px] min-[500px]:w-[5px] min-[500px]:h-[5px] bg-white shadow-[0_0_5px_rgba(255,255,255,0.9)]"></div>
          <div className="w-[4px] h-[4px] min-[500px]:w-[5px] min-[500px]:h-[5px] rounded-full bg-[#f5b82e] shadow-[0_0_8px_#f5b82e]"></div>
        </div>

        {/* Heading Text */}
        {/* tracking-[0.2em] se words ke darmiyan exact waisi spacing aayegi */}
        <h2 className="mx-2 min-[500px]:mx-4 text-white text-[14px] min-[500px]:text-[17px] font-medium tracking-[0.2em] uppercase whitespace-nowrap">
          Live Casino
        </h2>

        {/* Right Glowing Line & Dots */}
        <div className="flex items-center justify-start gap-1.5 min-[500px]:gap-2 w-full max-w-[80px] min-[400px]:max-w-[150px] min-[700px]:max-w-[250px]">
          <div className="w-[4px] h-[4px] min-[500px]:w-[5px] min-[500px]:h-[5px] rounded-full bg-[#f5b82e] shadow-[0_0_8px_#f5b82e]"></div>
          <div className="w-[4px] h-[4px] min-[500px]:w-[5px] min-[500px]:h-[5px] bg-white shadow-[0_0_5px_rgba(255,255,255,0.9)]"></div>
          <div className="h-[1px] w-full bg-gradient-to-l from-transparent to-[#f5b82e] shadow-[0_0_8px_#f5b82e]"></div>
        </div>

        
      </div>
      {/* 🔴 HEADING SECTION END 🔴 */}


      {/* 🟢 CARDS GRID SECTION 🟢 */}
      <ul className="grid grid-cols-2 min-[375px]:grid-cols-3 min-[786px]:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 list-none px-2 m-0">
        {filteredItems?.map((item: any, index: number) => (
          <li key={index} className="w-full">

            <article
              className="relative w-full aspect-[2/2.5] rounded-xl overflow-hidden shadow-2xl transition-transform duration-300 [transform:perspective(1000px)_rotateY(5deg)_skewX(-5deg)] border border-white/10 cursor-pointer group"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${item.bg || "https://bintu-vod-eu-02-ak.nanocosmos.de/Nlb8p/thumbnails/Nlb8p-H2srA.jpg"})`,
                }}
              />

              {/* Black Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>

              {/* Content Container - Bottom Center */}
              <div className="absolute bottom-0 left-0 w-full p-2 min-[600px]:p-3 flex flex-col items-center justify-end h-full">

                {/* Game Title */}
                <h3 className="text-white text-sm min-[600px]:text-[17px] font-bold uppercase text-center mb-1.5 min-[600px]:mb-2 tracking-wide drop-shadow-md">
                  {item.eventName || item.dealer || "TEEN PATTI"}
                </h3>

                {/* Badges Row */}
                <div className="flex items-center justify-center gap-1.5 min-[600px]:gap-2 w-full">

                  {/* LIVE Badge */}
                  <span className="bg-transparent text-[#22c55e] border border-[#22c55e] text-[9px] min-[600px]:text-[11px] font-bold px-1.5 py-0.5 min-[600px]:px-2 min-[600px]:py-[2px] rounded uppercase shadow-[0_0_5px_rgba(34,197,94,0.4)]">
                    LIVE
                  </span>

                  {/* Range Badge */}
                  <span className="bg-black/60 text-white text-[9px] min-[600px]:text-[11px] font-semibold px-1.5 py-0.5 min-[600px]:px-2 min-[600px]:py-[2px] rounded border border-white/20 whitespace-nowrap">
                    {item.range || "10 - 500K"}
                  </span>

                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
      
    </div>
  );
}