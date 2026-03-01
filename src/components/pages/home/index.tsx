"use client";
import { useAppStore } from "@/lib/store/store";
import React, { useMemo, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import CasinoGames from "./casino-games";
import MarketLoader from "@/components/common/market-loader";
import { useIndexManagerStore } from "@/lib/store/indexManagerStore";

const SportsNav = dynamic(() => import("@/components/pages/home/sports-nav"));
const HomeSlider = dynamic(() => import("@/components/pages/home/home-slider"));
const SingleMarket = dynamic(() => import("@/components/common/single-market"));

export default function HomePage() {
  // const { allEventsList } = useAppStore();
  const { eventsBySocket } = useIndexManagerStore();
  const [selectedEvent, setSelectedEvent] = useState("4");

  const handleActiveIdChange = React.useCallback((id: string) => {
    setSelectedEvent((prev) => (prev === id ? prev : id));
  }, []);

  const marketEvents = useMemo(() => {
    return eventsBySocket?.[selectedEvent] || [];
  }, [eventsBySocket, selectedEvent]);

  return (
    <div id="home.tsx">
      <HomeSlider />

      <div className="min-[425]:mt-[12.5px] min-[375]:mt-3 min-[320]:mt-[11.5px] min-[992]:mb-2 min-[992]:mt-[10.5px]">
        {/* ⚡ Pass the transition handler instead of the raw setter */}
        <SportsNav setSelectedEvent={handleActiveIdChange} />
      </div>

      <div className="mb-4">
        {/* Optional: Show a loading state while transitioning */}
        <SingleMarket events={marketEvents} className="mt-2!" />
      </div>

      <CasinoGames />
    </div>
  );
}
