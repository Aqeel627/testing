"use client";
import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAppStore } from "@/lib/store/store";

export default function Casino({ hideHeading }: { hideHeading?: boolean }) {
  const { casinoEvents } = useAppStore();
  const searchParams = useSearchParams();
  const activeIndex = searchParams.get("tab") ?? "Popular";


  // const filteredItems = React.useMemo(() => {
  //   if (!casinoEvents?.lobbies?.length) return [];
  //   if (activeIndex === "Popular") {
  //     return casinoEvents.lobbies.filter((item: any) => item.popular); // ✅
  //   }
  //   return casinoEvents.lobbies.filter(
  //     (item: any) => item.menuName === activeIndex, // ✅ name se match
  //   );
  // }, [casinoEvents, activeIndex]);

  const filteredItems = React.useMemo(() => {
  if (!casinoEvents?.lobbies?.length) return [];

  if (activeIndex === "Popular") {
    return casinoEvents.lobbies;
  }

  return casinoEvents.lobbies.filter(
    (item: any) => item.menuName === activeIndex
  );
}, [casinoEvents, activeIndex]);
  return (
    <div id="live-casino.tsx">
      <div className="w-full flex flex-col py-4 relative">
        {/* 🟢 PREMIUM LIVE CASINO HEADING SECTION 🟢 */}
        {!hideHeading && (
          <div className="relative flex items-center justify-center w-full mb-6 px-2 min-[600px]:px-4">
            {/* Left Glowing Line & Dots */}
            {/* flex-1 lagaya hai taake line auto-stretch ho */}
            <div className="flex relative items-center justify-end gap-2 w-full">
              <div className="neon-underline -top-1 -right-1 max-sm:right-3 max-md:right-1">
                {/* <span className="neon-glow glow-main"></span> */}
                <span className="neon-line line-main"></span>

                <span className="neon-glow glow-right"></span>
                <span className="neon-line line-right"></span>
              </div>
              {/* <div className="h-[1px] w-full bg-gradient-to-r from-transparent to-[#078dee] shadow-[0_0_8px_#078dee]"></div> */}
              <div
                className="w-[4px] h-[4px] min-[500px]:w-[5px] min-[500px]:h-[5px] 
                bg-[#ffbbbb] 
                dark:shadow-[0_0_6px_#ff3b3b,0_0_3px_#ff7f7f] 
                "
              ></div>

              <div className="w-[4px] h-[4px] min-[500px]:w-[5px] min-[500px]:h-[5px] rounded-full bg-[#078dee] shadow-[0_0_8px_#078dee]"></div>
            </div>

            {/* Heading Text */}
            {/* tracking-[0.2em] se words ke darmiyan exact waisi spacing aayegi */}
            <h2 className="mx-2 min-[500px]:mx-4 text-black dark:text-white text-[14px] min-[500px]:text-[17px] font-medium !font-extrabold tracking-[0.2em] uppercase whitespace-nowrap">
              Live Casino
            </h2>

            {/* Right Glowing Line & Dots */}
            <div className="relative flex items-center justify-start gap-2 w-full z-0">
              <div className="w-1 h-1 min-[500px]:w-[5px] min-[500px]:h-[5px] rounded-full bg-[#078dee] shadow-[0_0_8px_#078dee]"></div>
              <div className="w-1.25 h-1.25 bg-[#ffbbbb] dark:shadow-[0_0_6px_#ff3b3b,0_0_3px_#ff7f7f]"></div>
              <div className="neon-underline -top-1 -left-1 max-md:left-1 max-sm:left-3 z-0">
                {/* <span className="neon-glow glow-main"></span> */}
                <span className="neon-line line-main"></span>

                <span className="neon-glow glow-left"></span>
                <span className="neon-line line-left"></span>
              </div>
              {/* <div className="h-[1px] w-full bg-gradient-to-l from-transparent to-[#078dee] shadow-[0_0_8px_#078dee]"></div> */}
            </div>
          </div>
        )}
        {/* 🔴 HEADING SECTION END 🔴 */}

        {/* 🟢 CARDS GRID SECTION 🟢 */}
        <ul className="grid grid-cols-3 md:grid-cols-4 gap-1 list-none px-2 m-0 max-[350px]:gap-2">
          {filteredItems?.map((item: any, index: number) => (
            <li key={index} className="w-full">
              <article className="relative w-full aspect-[2/2.5] max-md:min-h-37.5 min-h-41.5 rounded-xl overflow-hidden shadow-2xl transition-transform duration-300 [transform:perspective(1000px)_rotateY(5deg)_skewX(-5deg)] border border-white/10 cursor-pointer group">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${item.gameImage || "https://bintu-vod-eu-02-ak.nanocosmos.de/Nlb8p/thumbnails/Nlb8p-H2srA.jpg"})`,
                  }}
                />

                {/* Black Gradient */}
                {/* <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent"></div> */}

                {/* Content Container */}
                <div className="absolute bottom-0 left-0 w-full p-2 flex flex-col items-center justify-end h-full">
                  <div
                    className="absolute bottom-0 left-0 w-full h-16 
    bg-gradient-to-t from-black/90 via-black/50 to-transparent 
    pointer-events-none"
                  ></div>
                  <h3 className="text-white z-10 max-md:text-[10px] text-sm font-bold uppercase text-center mb-1 tracking-wide drop-shadow-md">
                    {item.gameName || item.dealer || "TEEN PATTI"}
                  </h3>
                  <div className="flex items-center z-10 justify-center gap-1 w-full">
                    {/* <span className="bg-transparent text-[#22c55e] border border-[#22c55e82] text-[9px] max-[350px]:text-[7px] font-bold px-1.5 py-0.5 rounded uppercase shadow-[0_0_5px_rgba(34,197,94,0.4)]">
                    LIVE
                  </span> */}
                    <span className="bg-transparent text-[#22c55e] border border-[#22c55e82] text-[9px] max-[350px]:text-[7px] font-bold px-1.5 py-0.5 rounded uppercase shadow-[0_0_5px_rgba(34,197,94,0.4)] relative live-neon">
                      LIVE
                    </span>
                    <span className="bg-black/60 text-white text-[9px] font-semibold px-1.5 py-0.5  max-[350px]:text-[7px] rounded border border-white/20 whitespace-nowrap">
                      {/* {item.range || "10 - 500K"} */}
                      {item.minBet} - {item.maxBet}
                    </span>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
