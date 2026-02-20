"use client";
import Casino from "@/components/pages/live-casino";
import MCasinoTabs from "@/components/pages/live-casino/m-casino-tabs";
import { useAppStore } from "@/lib/store/store";

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
