"use client";
import { useAppStore } from "@/lib/store/store";
import dynamic from "next/dynamic";
const MCasinoTabs = dynamic(() => import("@/components/pages/live-casino/m-casino-tabs"));
const Casino = dynamic(() => import("@/components/pages/live-casino"));


const LiveCasinoRoute = () => {
  const { casinoEvents } = useAppStore(); // ✅

  const mobileTabs =
    casinoEvents?.menu?.map((m: any) => ({
      id: m.menuName,
      name: m.menuName,
    })) || [];

  return (
    <>
      <div className="block min-[1200px]:hidden">
        <MCasinoTabs tabs={mobileTabs} />
      </div>

      <Casino />
    </>
  );
};

export default LiveCasinoRoute;
