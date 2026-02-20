"use client";
import BreadCrumb from "@/components/common/bread-crumb";
import Casino from "@/components/pages/live-casino";
import MCasinoTabs from "@/components/pages/live-casino/m-casino-tabs";
import { useAppStore } from "@/lib/store/store";
import React from "react";

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

      <BreadCrumb title={"Live Casino Games"} />
      <Casino hideHeading />
    </>
  );
};

export default LiveCasinoRoute;
