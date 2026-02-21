"use client";
import SingleMarket from "@/components/pages/home/single-market";
import SportsNav from "@/components/pages/home/sports-nav";
import HomeSlider from "@/components/pages/home/home-slider";
import Casino from "@/components/pages/live-casino";
import { useAppStore } from "@/lib/store/store";
import InplayMarket from "../inplay/inplay-market";
import { useMemo, useState, useTransition } from "react";

export default function HomePage() {
  const { allEventsList } = useAppStore();
  const [selectedEvent, setSelectedEvent] = useState("4");

  // ⚡ Asal jadoo yahan hai: Array ko SLICE kardo
  const marketEvents = useMemo(() => {
    return allEventsList?.[selectedEvent] || [];
  }, [allEventsList, selectedEvent]);

  return (
    <div>
      <HomeSlider />

      <div className="min-[425]:mt-[12.5px] min-[375]:mt-3 min-[320]:mt-[11.5px] min-[992]:mb-2 min-[992]:mt-[10.5px]">
        <SportsNav setSelectedEvent={setSelectedEvent} />
      </div>

      <div className="mb-4">
        <InplayMarket events={marketEvents} className="mt-2!" />
      </div>

      <Casino />
    </div>
  );
}
