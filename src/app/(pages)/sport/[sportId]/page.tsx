"use client";
import { useAppStore } from "@/lib/store/store";
import { useState, useMemo, use } from "react";
import dynamic from "next/dynamic";
import { useIndexManagerStore } from "@/lib/store/indexManagerStore";
const SingleMarket = dynamic(() => import("@/components/common/single-market"));
const SportsBreadCrumb = dynamic(() => import("@/components/common/sports-bread-crumb"));

// Sport ID mapping — matches allEventsList keys
const SPORT_IDS: Record<string, string> = {
  cricket: "4",
  soccer: "1",
  tennis: "2",
};

interface SportPageProps {
  params: Promise<{ sportId: string }>;
}

const SportPage = ({ params }: SportPageProps) => {
  const { sportId } = use(params);
  const { allEventsList,eventTypes } = useIndexManagerStore();
  const [activeTab, setActiveTab] = useState("All");
  const sportName = eventTypes?.find((type:any) => type.id === sportId)?.name || "Sport";

  // Pull events from allEventsList[sportId] — same pattern as SingleMarket
  const sportEvents: any[] = useMemo(() => {
    if (!sportId || !allEventsList) return [];
    return allEventsList[sportId] ?? [];
  }, [allEventsList, sportId]);

  // Derive unique competition names for tab filtering
  const competitions = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    sportEvents.forEach((event: any) => {
      const name = event?.competition?.name;
      if (name && !seen.has(name)) {
        seen.add(name);
        result.push(name);
      }
    });
    return result;
  }, [sportEvents]);

  // Filter by active competition tab
  const filteredEvents = useMemo(() => {
    if (activeTab === "All") return sportEvents;
    return sportEvents.filter(
      (event: any) => event?.competition?.name === activeTab
    );
  }, [activeTab, sportEvents]);

  if (!allEventsList) return <p className="text-white p-4">Loading...</p>;
  // if (!sportEvents.length)
    // return ;

  return (
    <>
      <SportsBreadCrumb title={sportName} />
      <SingleMarket events={filteredEvents} />
    </>
  );
};

export default SportPage;