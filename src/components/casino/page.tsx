"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store/store";

interface GameItem {
   id: string;
   dealer: string;
   title: string;
   range: string;
   bg: string;
}


export default function Casino() {

   const { casinoEvents } = useAppStore();
   const pathname = usePathname();
   const [activeIndex, setActiveIndex] = useState("1");
   useEffect(() => {
      //  console.log("casinoEvents", casinoEvents);
   }, [casinoEvents]);
   const filteredItems = React.useMemo(() => {
      if (!casinoEvents?.lobby?.length) return [];
      if (activeIndex === "1") {
         return casinoEvents.lobby.filter((item: any) => item.popular);
      }
      return casinoEvents.lobby.filter((item: any) => item.menuId === activeIndex);
   }, [casinoEvents, activeIndex]);
   return (
      <ul className="grid grid-cols-1 min-[324px]:grid-cols-2 min-[624px]:grid-cols-4 gap-4 list-none p-0 m-0">
         {filteredItems?.map((item: any, index: number) => (
            <li key={index} className="w-full">
               <article className="w-full">
                  <div className="relative w-full pb-[56.25%]">
                     <div className="absolute inset-0 rounded-md overflow-hidden bg-[#141A21] cursor-pointer">
                        <div
                           className="absolute inset-0 bg-cover bg-no-repeat"
                           style={{
                              backgroundImage:
                                 "url(https://bintu-vod-eu-02-ak.nanocosmos.de/Nlb8p/thumbnails/Nlb8p-H2srA.jpg)",
                           }}
                        />
                        <div className="absolute top-0 left-1">
                           <span className="text-xs font-medium text-white">
                              {item.dealer}
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col cursor-pointer">
                     <h6 className="mt-1 min-[900px]:mt-2 text-sm font-semibold --palette-text-primary truncate leading-[14px]">
                        {item?.eventName}
                     </h6>

                     <div className="flex items-center gap-1 mt-0.5 min-[900px]:mt-1 overflow-hidden leading-[12px]">
                        {/* <span className="text-xs text-white truncate">
                           {item.range}
                        </span> */}
                        <span className="text-xs --palette-text-primary truncate">
                           10-500000
                        </span>

                        <svg
                           className="w-3.5 h-3.5 text-[#919eab] shrink-0"
                           viewBox="0 0 24 24"
                           fill="currentColor"
                        >
                           <circle cx="12" cy="6" r="4" />
                           <ellipse cx="12" cy="17" rx="7" ry="4" />
                        </svg>
                     </div>
                  </div>
               </article>
            </li>
         ))}
      </ul>
   );
}
